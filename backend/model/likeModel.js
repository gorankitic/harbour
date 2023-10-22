const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Like must belong to user.']
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'Like must belong to post.']
    }
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;