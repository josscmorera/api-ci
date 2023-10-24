const slugify = require("slugify");

const Post = require("../models/post");
const Comment = require("../models/comment");
const { removeReportsFromPost } = require("../helpers/reports");
const { deleteCommentsFromPost } = require("../helpers/comment");

const getPost = async (id) => {
  const post = await Post.findById(id)
    .populate("author")
    .populate("community")
    .populate("tag");
  return post;
};

const createPost = async (req, res) => {
  try {
    const { title, content, tag, community } = req.body;
    const imagePath = req.file ? req.file.path : undefined;

    const slug = slugify(title, { lower: true });

    const existPost = await Post.exists({ slug });

    if (existPost) {
      return res
        .status(400)
        .json({ success: false, message: "Post already exists" });
    }

    const author = req.decodedToken.id;

    const newPost = new Post({
      title,
      content,
      tag,
      community,
      slug,
      author,
      image: imagePath,
    });

    await newPost.save();

    const post = await getPost(newPost._id);

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const select = {};

    const {
      author,
      community,
      tag,
      sortBy = "createAt",
      sortAsc = -1,
    } = req.query;

    if (author) {
      select.author = author;
    }

    if (community) {
      select.community = community;
    }

    if (tag) {
      select.tag = tag;
    }

    const posts = await Post.find(select)
      .sort({ [sortBy]: sortAsc })
      .populate("author")
      .populate("community")
      .populate("tag");

    return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("author")
      .populate("community")
      .populate("tag");

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug })
      .populate("author")
      .populate("community")
      .populate("tag");

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content, tag, community } = req.body;

    const slug = slugify(title, { lower: true });

    const existPost = await Post.exists({ slug, _id: { $ne: id } });

    if (existPost) {
      return res
        .status(400)
        .json({ success: false, message: "Post already exists" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, tag, community, slug },
      { new: true }
    );

    const post = await getPost(updatedPost._id);

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    await deleteCommentsFromPost(id);
    await removeReportsFromPost(id);

    return res.status(200).json({ success: true, data: deletedPost });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const upvotePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    const user = req.decodedToken.id;

    if (post.upvotes.includes(user)) {
      post.upvotes = post.upvotes.filter((userId) => userId !== user);
    } else {
      post.upvotes.push(user);
      post.downvotes = post.downvotes.filter((userId) => userId !== user);
    }

    await post.save();

    const updatedPost = await getPost(id);

    return res.status(200).json({ success: true, data: updatedPost });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const downvotePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }

    const user = req.decodedToken.id;

    if (post.downvotes.includes(user)) {
      post.downvotes = post.downvotes.filter((userId) => userId !== user);
    } else {
      post.downvotes.push(user);
      post.upvotes = post.upvotes.filter((userId) => userId !== user);
    }

    await post.save();

    const updatedPost = await getPost(id);

    return res.status(200).json({ success: true, data: updatedPost });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
};
