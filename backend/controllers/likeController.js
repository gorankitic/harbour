const Like = require("../model/likeModel");
const Notification = require('../model/NotificationModel');
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// Like a post
// POST method
// Protected route /api/posts/post._id/likes
exports.like = catchAsync(async (req, res, next) => {
    const liked = await Like.findOne({ user: req.user._id }).where('post').equals(`${req.params.postId}`);
    if(liked) {
        return next(new AppError('You have already liked this post.', 400));
    }

    const like = await Like.create({ post: req.params.postId, user: req.user._id });

    // Create like notification
    if(like) {
        await Notification.create({
            content: 'liked your photo.',
            user: req.body.userId,
            sender: req.user._id,
            post: req.params.postId
        });
    }

    res.status(200).json(like);
});

// Get all likes
// GET method
// Protected route /api/posts/post._id/likes
exports.getLikes = catchAsync(async (req, res, next) => {
    const likes = await Like.find({ post: req.params.postId });

    res.status(200).json({
        status: 'success',
        results: likes.length,
        likes
    });
});

// Unlike a post
// DELETE method
// Protected route /api/posts/post._id/likes
exports.unlike = catchAsync(async (req, res, next) => {
    const unlike = await Like.findOneAndDelete({ user: req.user._id }).where('post').equals(`${req.params.postId}`);

    if(!unlike) {
        return next(new AppError("User can't unlike this photo!", 400));
    }
    res.status(204).json();
});
