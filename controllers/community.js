const slugify = require('slugify');

const Post = require('../models/post');
const Community = require('../models/community');

const createCommunity = async (req, res) => {
    try {
        const { name } = req.body;

        const slug = slugify(name, { lower: true });

        const existCommunity = await Community.exists({ slug });

        if (existCommunity) {
            return res.status(400).json({ success: false, message: "Community already exists" });
        }

        const newCommunity = new Community({ name, slug });

        const savedCommunity = await newCommunity.save();

        return res.status(200).json({ success: true, data: savedCommunity });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const getAllCommunities = async (req, res) => {
    try {
        const select = {};

        const { createdBy, follower, tag } = req.query;

        if (createdBy) {
            select.createdBy = createdBy;
        }

        if (follower) {
            select.followers = follower;
        }

        if (tag) {
            select.tags = tag;
        }

        const communitys = await Community.find(select).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, data: communitys });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const getCommunityById = async (req, res) => {
    try {
        const { id } = req.params;

        const community = await Community.findById(id);

        if (!community) {
            return res.status(400).json({ success: false, message: "Community not found" });
        }

        return res.status(200).json({ success: true, data: community });
      
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const getCommunityBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const community = await Community.findOne({ slug });

        if (!community) {
            return res.status(400).json({ success: false, message: "Community not found" });
        }

        return res.status(200).json({ success: true, data: community });
      
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const updateCommunity = async (req, res) => {
    try {
        const { id } = req.params;

        const { name } = req.body;

        const slug = slugify(name, { lower: true });

        const existCommunity = await Community.exists({ slug, _id: { $ne: id } });

        if (existCommunity) {
            return res.status(400).json({ success: false, message: "Community already exists" });
        }

        const updatedCommunity = await Community.findByIdAndUpdate(id, { name, slug }, { new: true });

        return res.status(200).json({ success: true, data: updatedCommunity });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const deleteCommunity = async (req, res) => {
    try {
        const { id } = req.params;

        const existSomePost = await Post.exist({ community: id });

        if (existSomePost) {
            return res.status(400).json({ success: false, message: "Community is being used in a post" });
        }

        const deletedCommunity = await Community.findByIdAndDelete(id);

        return res.status(200).json({ success: true, data: deletedCommunity });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}
 
module.exports = {
    createCommunity,
    getAllCommunities,
    getCommunityById,
    getCommunityBySlug,
    updateCommunity,
    deleteCommunity
}
