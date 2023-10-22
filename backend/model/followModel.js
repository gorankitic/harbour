const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    follower: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    followee: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;