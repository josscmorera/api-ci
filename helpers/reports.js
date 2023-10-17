const Report = require('../models/report');

const removeReportsFromPost = async (postId) => {
    await Report.deleteMany({ type: 'post', typeId: postId });
}

const removeReportsFromComment = async (commentId) => {
    await Report.deleteMany({ type: 'comment', typeId: commentId });
}

module.exports = {
    removeReportsFromPost,
    removeReportsFromComment
};