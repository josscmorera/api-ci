const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const tagSchema = new mongoose.Schema({
    _id : { type: String, default: uuidv4 },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
});


const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;