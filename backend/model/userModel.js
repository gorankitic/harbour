const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = mongoose.Schema({
    displayName: {
        type: String,
        required: [true, 'You must provide displayName.']
    },
    email: {
        type: String,
        required: [true, 'You must provide email.'],
        lowercase: true,
        unique: [true, 'Email already in use.'],
        validate: [validator.isEmail, 'Please provide valid email.']
    },
    password: {
        type: String,
        required: [true, 'You must provide password.'],
        validate: [validator.isStrongPassword, 'Password is not strong enough.'],
        select: false
    },
    photoURL: {
        type: String,
        default: ''
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('followers', {
    ref: 'Follow',
    foreignField: 'followee',
    localField: '_id'
});

userSchema.virtual('following', {
    ref: 'Follow',
    foreignField: 'follower',
    localField: '_id'
});

userSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'user',
    localField: '_id'
});

// Pre-save mongoose document hook/middleware to hash password
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Pre-save mongoose document hook/middleware to update user passwordChangedAt property
userSchema.pre('save', function(next) {
    // Only run this function if password is modified or on new document save
    if(!this.isModified('password') || this.isNew) return next();
    // To ensure that token is created after password has been changed: -1000ms
    this.passwordChangedAt = Date.now() - 1000;    
    next();
});

// Pre-query mongoose hook to not show inactive(deactivated) users in queries
userSchema.pre(/^find/, function(next) {
    this.find({ active: true });
    next();
});

// This functions are instance methods, so they are available on all user documents
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 1000 * 60 * 10; // 10 minutes from now
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;