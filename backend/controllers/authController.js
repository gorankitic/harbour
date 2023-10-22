const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

// Reusable function for creating and sending JWT in cookie and sending user in response object
const createSendToken = (user, statusCode, res) => {
    const { _id } = user;
    // Create (sign) JWT
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Send JWT as cookie
    const cookieOptions = {
        httpOnly: true,
        SameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 1000 * 60 * 60 * 24 // 1d
    };
    user.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        _id: user._id,
        followers: user.followers,
        following: user.following
    });
};

// Sign up user
// POST method
// Public route /api/users/signup
exports.signup = catchAsync(async (req, res, next) => {
    const { displayName, email, password, photoURL } = req.body;
    // Create a new user - password is hashed in pre-save mongoose hook in User model
    const user = await User.create({ displayName, email, password, photoURL });
    // Create JWT and send cookie
    createSendToken(user, 201, res);
});

// Login user
// POST method
// Public route /api/users/login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // Check if user with this email exist and is password correct?
    const user = await User.findOne({ email }).select('+password').populate('followers').populate('following');
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password.', 401));
    }
    // Create JWT and send cookie
    createSendToken(user, 200, res);
});

// Log out user
// GET method
// Protected route /api/users/logout
exports.logout = (req, res) => {
    res.clearCookie('jwt', { httpOnly: true });
    res.status(200).json({ message: 'Logged out.' });
};

// Protect middleware
exports.protect = catchAsync(async (req, res, next) => {
    // 1. Get token and check if it is exist
    const token = req.cookies.jwt;
    if(!token) {
        return next(new AppError('Please log in to get access.', 401));
    }
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3.Find user by _id and check if user still exist
    const user = await User.findById(decoded._id);
    if(!user) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    // 4. Check if user changed password after the token was issued
    if(user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please log in again.', 401));
    }
    // 5. Grant access to protected route and attach user to request object
    req.user = user;

    next();
});

// User forgot password
// POST method
// Public route /api/users/forgotPassword
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new AppError('There is no user with that email.', 404));
    }
    // 2. Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateModifiedOnly: true });
    // 3. Send reset token to user email address
    const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit PATCH request with new password to: \n\n${resetURL}\n\nIf you didn't forget your password, please ignore this email!`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token is valid for 10 minutes.',
            message
        });
        res.status(200).json({
            status: 'success',
            message: "Token sent to user email."
        });
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateModifiedOnly: true });
        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
});

// Reset user password
// PATCH method
// Public route /api/users/resetPassword/:token
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1. Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    // 2.If token is not expired, and user exists
    if(!user) {
        return next(new AppError('Token is invalid or has expired.', 400));
    }
    // 3. Set the new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 4. Update changedPasswordAt user property 
    //    -> in userModel with pre-save mongoose document hook
    // 5. Log in user, send JWT
    createSendToken(user, 200, res);
});

// Update user password
// PATCH method
// Protected route /api/users/updatePassword
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1. Get user
    const user = await User.findById(req.user._id).select('+password');
    // 2. Check if POSTed current password is correct
    if(! (await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }
    // 3. Update password
    user.password = req.body.password;
    await user.save();
    // 4. Log in user, send JWT
    createSendToken(user, 200, res);
});