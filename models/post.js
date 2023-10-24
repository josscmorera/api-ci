const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const postSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String, ref: "User" },
  upvotes: [{ type: String, ref: "User" }],
  downvotes: [{ type: String, ref: "User" }],
  community: { type: String, ref: "Community" },
  comments: [{ type: String, ref: "Comment" }],
  reports: [{ type: String, ref: "Report" }],
  tag: { type: String, ref: "Tag" },
  createAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
