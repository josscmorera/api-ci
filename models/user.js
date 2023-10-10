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
    likes: [{ type: String, ref: 'Post' }],
    dislikes: [{ type: String, ref: 'Post' }],
    createAt: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);

module.exports = User;