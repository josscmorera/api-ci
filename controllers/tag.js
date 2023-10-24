const slugify = require("slugify");

const Tag = require("../models/tag");
const Post = require("../models/post");

const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const slug = slugify(name, { lower: true });

    const existTag = await Tag.exists({ slug });

    if (existTag) {
      return res
        .status(400)
        .json({ success: false, message: "Tag already exists" });
    }

    const newTag = new Tag({ name, slug });

    const savedTag = await newTag.save();

    return res.status(200).json({ success: true, data: savedTag });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ _id: -1 });

    return res.status(200).json({ success: true, data: tags });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);

    if (!tag) {
      return res.status(400).json({ success: false, message: "Tag not found" });
    }

    return res.status(200).json({ success: true, data: tag });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getTagBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const tag = await Tag.findOne({ slug });

    if (!tag) {
      return res.status(400).json({ success: false, message: "Tag not found" });
    }

    return res.status(200).json({ success: true, data: tag });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;

    const { name } = req.body;

    const slug = slugify(name, { lower: true });

    const existTag = await Tag.exists({ slug, _id: { $ne: id } });

    if (existTag) {
      return res
        .status(400)
        .json({ success: false, message: "Tag already exists" });
    }

    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );

    return res.status(200).json({ success: true, data: updatedTag });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const existSomePost = await Post.exist({ tag: id });

    if (existSomePost) {
      return res
        .status(400)
        .json({ success: false, message: "Tag is being used in a post" });
    }

    const deletedTag = await Tag.findByIdAndDelete(id);

    return res.status(200).json({ success: true, data: deletedTag });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createTag,
  getAllTags,
  getTagById,
  getTagBySlug,
  updateTag,
  deleteTag,
};
