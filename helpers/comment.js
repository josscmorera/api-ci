const Comment = require("../models/comment");
const { removeReportsFromComment } = require("./reports");


const  getCommentsParent = async (postId, parentId = null) => {
  const query = { post: postId, parent: parentId };
  const comments = await Comment.find(query).populate('user');
  
  for (const comment of comments) {
    const replies = await getCommentsParent(postId, comment._id);
    comment.replies = replies;
  }
  
  return comments;
}

const deleteCommentAndReplies = async (commentId) => {
  await Comment.findByIdAndDelete(commentId);
  await removeReportsFromComment(commentId);


  const replies = await Comment.find({ parent: commentId });
  for (const reply of replies) {
    await deleteCommentAndReplies(reply._id);
  }
}

const deleteCommentsFromPost = async (postId) => {
    const comments = await Comment.find({ post: postId });

    for (const comment of comments) {
      await deleteCommentAndReplies(comment._id);
    }
}


module.exports = {
  getCommentsParent,
  deleteCommentAndReplies,
  deleteCommentsFromPost
};