const Notification = require('../model/NotificationModel');

exports.getNotifications = async (req, res, next) => {

    const notifications = await Notification.find({ user: { $eq: req.params.userId } }).sort({ createdAt: -1 });
    const unreadNotifications = await Notification.find({ user: req.params.userId , read: { $eq: false } });
    
    res.status(200).json({notifications, unreadNotificationsLength: unreadNotifications.length}); 
}

exports.makeNotificationsRead = async (req, res, next) => {
    await Notification.updateMany({ user: { $eq: req.params.userId }  }, { read: true });
}
