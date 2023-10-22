const express = require('express');
const { protect } = require('../controllers/authController');
const { follow, getFollowers, getFollowing, unfollow } = require('../controllers/followController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(protect, follow)
    .delete(protect, unfollow);

router.route('/followers')
    .get(protect, getFollowers);

router.route('/following')
    .get(protect, getFollowing);

module.exports = router;