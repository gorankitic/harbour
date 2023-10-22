const Notification = require('../model/NotificationModel');
const Comment = require('../model/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Create a comment
// POST method
// Protected route /api/posts/post._id/comments
exports.createComment = catchAsync(async (req, res, next) => {
    const { content, userId } = req.body;
    const { postId } = req.params;
    
    const comment = await Comment.create({ content, user: req.user, post: postId });

    if(comment) {
        await Notification.create({
            content: 'commented on your photo.',
            user: userId,
            sender: req.user._id,
            post: req.params.postId
        });
    }

    res.status(201).json({
        _id: comment._id,
        content: comment.content,
        user: comment.user,
        post: comment.post,
        createdAt: comment.createdAt
    });
});

// Delete a comment
// DELETE method
// Protected route /api/posts/post._id/comments/:comment._id
exports.deleteComment = catchAsync(async (req, res, next) => {
    // User can delete only his comments
    const comment = await Comment.findByIdAndDelete(req.params.commentId).where('user').equals(`${req.user._id}`);
    if(!comment) {
        return next(new AppError('No comment found with that ID.', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
