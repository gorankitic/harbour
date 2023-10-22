const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Notification must must have a content (like, comment, follow)']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Notification must belong to user']
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Notification must have a sender.']
    },
    read: {
        type: Boolean,
        default: false
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Pre-query mongoose hook to populate sender field in notifications documents
notificationSchema.pre(/^find/, function(next) {
    this.populate({ path: 'sender', select: 'displayName photoURL' });
    next();
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;