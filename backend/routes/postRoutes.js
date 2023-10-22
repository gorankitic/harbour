const express = require('express');
const commentRouter = require('../routes/commentRoutes');
const likeRouter = require('../routes/likeRoutes');
const { createPost, getPosts, getPost, deletePost, getTimelinePosts } = require('../controllers/postController');
const { protect } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use('/:postId/comments', commentRouter);
router.use('/:postId/likes', likeRouter);

router.route('/')
    .post(protect, createPost)
    .get(protect, getPosts);

router.route('/timeline')
    .get(protect, getTimelinePosts);

router.route('/:postId')
    .get(protect, getPost)
    .delete(protect, deletePost);

module.exports = router;