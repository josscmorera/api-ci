const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const communitySchema = new mongoose.Schema({
    _id : { type: String, default: uuidv4 },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    followers: [{ type: String, ref: 'User' }],
    tags: [{ type: String, ref: 'Tag' }],
    createAt: { type: Date, default: Date.now },
});


const Community = mongoose.model('Community', communitySchema);

module.exports = Community;