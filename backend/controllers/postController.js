const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Post = require('../model/postModel');
const Follow = require('../model/followModel');
const Like = require('../model/likeModel');
const Comment = require('../model/commentModel');

// Create post
// POST method
// Protected route /api/users/user._id/posts
exports.createPost = catchAsync(async (req, res, next) => {
    const post = await Post.create({ imageURL: req.body.imageURL, user: req.params.userId });
    
    res.status(201).json({
        _id: post._id,
        imageURL: post.imageURL,
        userId: post.user,
        createdAt: post.createdAt
    });
});

// Find all user posts
// GET method
// Protected route /api/users/user._id/posts
exports.getPosts = catchAsync(async (req, res, next) => {
    // Find all posts (user posts) where user field is equal req.params.userId
    const posts = await Post.find({ user: { $eq: req.params.userId } })
        .populate({ path: 'comments', options:{ sort:{ createdAt: -1 } } })
        .populate('likes')  
        .sort({ createdAt: -1 });

    res.status(200).json(posts);
});

// Find user post by id
// GET method
// Protected route /api/users/user._id/posts/post._id
exports.getPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.findById(postId)
        .populate({ path: 'user', select: 'displayName photoURL' }).populate({ path: 'comments', options: { sort: { createdAt: -1 }} }).populate('likes');
    
    if(!post) {
        return next(new AppError('No post found with that ID.', 404));
    }

    res.status(200).json(post);
});

// Delete user post by id
// DELETE method
// Protected route /api/users/user._id/posts/post._id
exports.deletePost = catchAsync(async (req, res, next) => {
    // User can delete only his own posts
    const post = await Post.findByIdAndDelete({ _id: req.params.postId }).where('user').equals(`${req.params.userId}`);
    
    if(!post) {
        return next(new AppError('No post found with that ID.', 404));
    }
    
    // Delete all comments and likes on post
    await Comment.deleteMany({ post: { $eq: req.params.postId } });
    await Like.deleteMany({ post: { $eq: req.params.postId } });

    res.status(204).json();
});

// Find all user timeline posts
// GET method
// Protected route /api/users/user._id/posts/timeline
exports.getTimelinePosts = catchAsync(async (req, res, next) => {
    const following = await Follow.find({ follower: req.params.userId }).populate({ path: 'followee' });

    let followingIDs = [];
    for(followObject of following) {
        followingIDs.push(followObject.followee.id);
    }

    const posts = await Post.find({ user: { $in: followingIDs } })
        .populate({ path: 'user', select: 'displayName photoURL' })
        .populate({ path: 'comments', options:{ sort:{ createdAt: -1 } } })
        .populate('likes')  
        .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
})