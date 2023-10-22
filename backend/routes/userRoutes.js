const express = require('express');
const  postRouter = require('./postRoutes');
const followRouter = require('./followRoutes');
const { signup, login, logout, protect, forgotPassword, resetPassword, updatePassword } = require('../controllers/authController');
const { getUsers, getUserById, updateProfile, deactivateProfile } = require('../controllers/userController');
const notificationRouter = require('./notificationRoutes');

const router = express.Router();

router.use('/:userId/posts', postRouter);
router.use('/:userId/follow', followRouter);
router.use('/:userId/notifications', notificationRouter);

router.get('/logout', logout);

router.get('/search',protect, getUsers);
router.get('/:_id', protect, getUserById);

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword',protect, updatePassword);
router.patch('/updateProfile', protect, updateProfile);

router.delete('/deactivateProfile', protect, deactivateProfile);

module.exports = router;