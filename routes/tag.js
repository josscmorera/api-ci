var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');

const { 
    createTag,
    getAllTags,
    getTagById,
    getTagBySlug,
    updateTag,
    deleteTag
 } = require('../controllers/tag');

var router = express.Router();

router.post('/new', jwtValidate, createTag);
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.get('/slug/:slug', getTagBySlug);
router.put('/:id', jwtValidate, updateTag);
router.delete('/:id', jwtValidate, deleteTag);

module.exports = router;