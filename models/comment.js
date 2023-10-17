const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const commentSchema = new mongoose.Schema({
    _id : { type: String, default: uuidv4 },
    content: { type: String, required: true },
    user: { type: String, ref: 'User' },
    post: { type: String, ref: 'Post' },
    upvotes: [{ type: String, ref: 'User' }],
    downvotes: [{ type: String, ref: 'User' }],
    replies: [{ type: String, ref: 'Comment' }],
    reports: [{ type: String, ref: 'Report' }],
    parent: { type: String, ref: 'Comment' },
    createAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;