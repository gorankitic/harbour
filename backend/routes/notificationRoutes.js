const express = require('express');
const { protect } = require('../controllers/authController');
const { getNotifications, getNotificationsLength, makeNotificationsRead } = require('../controllers/notificationController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getNotifications)
    .patch(protect, makeNotificationsRead)

module.exports = router;