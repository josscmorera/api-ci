const Post = require('../models/post');
const Comment = require('../models/comment');
const { getCommentsParent } = require('../helpers/comment');

const createComment = async (req, res) => {
    try {
        const { content, post, parent } = req.body;

        const parentComment = await Comment.findById(parent);

        if (parent && !parentComment) {
            return res.status(400).json({ success: false, message: "Parent comment not found" });
        }
        
        const user = res.locals.decodedToken._id;

        const newComment = new Comment({ content, post, user, parent });

        const savedComment = await newComment.save();

        if (parent) {
          parentComment.replies.push(savedComment._id);
          await parentComment.save();
        } else {
          await Post.findByIdAndUpdate(post, { $push: { comments: savedComment._id } });
        }

        return res.status(200).json({ success: true, data: savedComment });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const getComments = async (req, res) => {
    try {
        let comments = [];

        const { post, parent } = req.query;

        if (post) {
             comments = await getCommentsParent(post);
             return res.status(200).json({ success: true, data: comments });

        }

        if (parent) {
            comments = await getCommentsParent(null, parent);
            return res.status(200).json({ success: true, data: comments });
        }

         comments = await Comment.find().sort({ createdAt: -1 }).populate('user');

        return res.status(200).json({ success: true, data: comments });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id).populate(['user', 'post',  'parent']);

        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment not found" });
        }

        const replies = await getCommentsParent(comment.post._id, comment._id);

        comment.replies = replies;

        return res.status(200).json({ success: true, data: comment });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const updateComment = async (req, res) => {
    try {
        const { id } = req.params;

        const { content } = req.body;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment not found" });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, { content }, { new: true });

        return res.status(200).json({ success: true, data: updatedComment });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment not found" });
        }

        if (comment.replies.length > 0) {
            await deleteCommentAndReplies(comment._id);
            
        } else {
          await Comment.findByIdAndDelete(id);
        }

        const post = await Post.findById(comment.post);

        post.comments = post.comments.filter(commentId => commentId !== id);

        await post.save();

        return res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const upvoteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment not found" });
        }

        const user = res.locals.decodedToken._id;

        if (comment.upvotes.includes(user)) {
            comment.upvotes = comment.upvotes.filter(userId => userId !== user);
        } else {
            comment.upvotes.push(user);
            comment.downvotes = comment.downvotes.filter(userId => userId !== user);
        }

        await comment.save();

        return res.status(200).json({ success: true, data: comment });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const downvoteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment not found" });
        }

        const user = res.locals.decodedToken._id;

        if (comment.downvotes.includes(user)) {
            comment.downvotes = comment.downvotes.filter(userId => userId !== user);
        } else {
            comment.downvotes.push(user);
            comment.upvotes = comment.upvotes.filter(userId => userId !== user);
        }

        await comment.save();

        return res.status(200).json({ success: true, data: comment });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment,
    upvoteComment,
    downvoteComment
};



