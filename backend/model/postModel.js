const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    imageURL: {
        type: String,
        // required: [true, 'Post must have an image.'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Post must belong to user.']
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Parent referencing: Virtual populate parent Post with children Comments 
postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'post',
    localField: '_id'
});

postSchema.virtual('likes', {
    ref: 'Like',
    foreignField: 'post',
    localField: '_id'
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;