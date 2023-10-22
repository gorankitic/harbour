const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Function for filtering unwanted fields from req.body that are not allowed to be updated
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

// Update user profile
// PATCH method
// Protected route /api/users/updateProfile
exports.updateProfile = catchAsync(async (req, res, next) => {
    // 1. Create error if user POSTs password data
    if(req.body.password) {
        return next(new AppError('This route is not for password update. Please use /updatePassword.', 400));
    }
    // 2. Filter out unwanted fields from req.body that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'displayName', 'email', 'photoURL');

    let updates = {}
    if(filteredBody) {
        if(req.body.displayName) {
            updates.displayName = req.body.displayName;
        }
        if(req.body.email) {
            updates.email = req.body.email;
        }
        if(req.body.photoURL) {
            updates.photoURL = req.body.photoURL;
        }
    }
    // 3. Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
        _id: updatedUser._id
    });
});

// Search for users
// GET method
// Protected route /api/users/search
exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({ displayName: { $regex:'^' + req.query.q } });
    res.status(200).json(users);
});

// Get user by id
// GET method
// Protected route /api/users/:_id
exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params._id).populate('followers').populate('following').populate('posts');
    res.status(200).json(user);
});

// Delete (deactivate) user
// DELETE method
// Protected route /api/users/deactivateProfile
exports.deactivateProfile = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
        status: 'success',
    });
});