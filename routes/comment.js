var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');

const { 
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment,
    upvoteComment,
    downvoteComment
 } = require('../controllers/comment');

var router = express.Router();

router.post('/new', jwtValidate, createComment);
router.get('/', getComments);
router.get('/:id', getCommentById);
router.put('/:id', jwtValidate, updateComment);
router.delete('/:id', jwtValidate, deleteComment);
router.put('/:id/upvote', jwtValidate, upvoteComment);
router.put('/:id/downvote', jwtValidate, downvoteComment);

module.exports = router;