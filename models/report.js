// schema report
const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const reportSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  type: { type: String, required: true, enum: ['post', 'comment'] },
  typeId: { type: String, required: true },
  user: { type: String, ref: 'User' },
  content: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;