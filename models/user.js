const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    _id : { type: String, default: uuidv4 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ['user', 'admin','blogger']},
    followers: [{ type: String, ref: 'User' }],
    following: [{ type: String, ref: 'User' }],
    upvotes: [{ type: String, ref: 'Post' }],
    downvotes: [{ type: String, ref: 'Post' }],
    coins: { type: Number, default: 0 },

    createAt: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);

module.exports = User;