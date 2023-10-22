const express = require('express');
const { protect } = require('../controllers/authController');
const { createComment, getComments, deleteComment } = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(protect, createComment);

router.route('/:commentId')
    .delete(protect, deleteComment);

module.exports = router;