const express = require('express');
const { protect } = require('../controllers/authController');
const { like, getLikes, unlike } = require('../controllers/likeController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(protect, like)
    .get(protect, getLikes)
    .delete(protect, unlike);

module.exports = router;
