var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');

const { 
    createPost,
    getPosts,
    getPostById,
    getPostBySlug,
    updatePost,
    deletePost,
    upvotePost,
    downvotePost
 } = require('../controllers/post');

var router = express.Router();

router.post('/new', jwtValidate, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/slug/:slug', getPostBySlug);
router.put('/:id', jwtValidate, updatePost);
router.delete('/:id', jwtValidate, deletePost);
router.put('/:id/upvote', jwtValidate, upvotePost);
router.put('/:id/downvote', jwtValidate, downvotePost);

module.exports = router;