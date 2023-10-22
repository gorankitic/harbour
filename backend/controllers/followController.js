const Notification = require('../model/NotificationModel');
const Follow = require('../model/followModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Follow user
// POST method
// Protected route api/users/user._id/follow
exports.follow = catchAsync(async (req, res, next) => {
    const isFollowing = await Follow.find({ followee: req.params.userId }).where('follower').equals(`${req.user._id}`);
    if(isFollowing.length > 0) {
        return next(new AppError("You can't follow this user again.", 400));
    }
    const followDoc = await Follow.create({ follower: req.user._id, followee: req.params.userId });

    // Create follow notification
    if(followDoc) {
        await Notification.create({
            content: 'started following you.',
            user: req.params.userId,
            sender: req.user._id
        });
    }

    res.status(201).json(followDoc);
});

// Get all followers
// GET method
// Protected route  /api/users/user._id/follow/followers
exports.getFollowers = catchAsync(async (req, res, next) => {
    const followers = await Follow.find({ followee: req.params.userId }).populate({ path: 'follower',select: 'displayName -_id' });
    res.status(200).json({
        status: 'success',
        results: followers.length,
        followers
    });
});

// Get all following
// GET method
// Protected route  /api/users/user._id/follow/following
exports.getFollowing = catchAsync(async (req, res, next) => {
    const following = await Follow.find({ follower: req.params.userId }).populate({ path: 'followee' });
    res.status(200).json(following);
});

// Unfollow user
// DELETE method
// Protected route /api/users/user._id/follow
exports.unfollow = catchAsync(async (req, res, next) => {
    const following = await Follow.find({ followee: req.params.userId }).where('follower').equals(`${req.user._id}`);
    if(following.length === 0) {  
        return next(new AppError('You are not following this user.', 400));
    }
    const result = await Follow.findOneAndDelete({ followee: req.params.userId }).where('follower').equals(`${req.user._id}`);
    res.status(200).json(result);
});