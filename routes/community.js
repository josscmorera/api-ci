var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');

const { 
    createCommunity,
    getAllCommunities,
    getCommunityById,
    getCommunityBySlug,
    updateCommunity,
    deleteCommunity
 } = require('../controllers/community');

var router = express.Router();

router.post('/new', jwtValidate, createCommunity);
router.get('/', getAllCommunities);
router.get('/:id', getCommunityById);
router.get('/slug/:slug', getCommunityBySlug);
router.put('/:id', jwtValidate, updateCommunity);
router.delete('/:id', jwtValidate, deleteCommunity);

module.exports = router;