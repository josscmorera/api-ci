var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');

const { 
    createCommunity,
    getAllCommunities,
    getCommunityById,
    getCommunityBySlug,
    updateCommunity,
    deleteCommunity,
    followCommunity,
    unfollowCommunity
 } = require('../controllers/community');

var router = express.Router();

router.post('/new', jwtValidate, createCommunity);
router.get('/', getAllCommunities);
router.get('/:id', getCommunityById);
router.get('/slug/:slug', getCommunityBySlug);
router.put('/:id', jwtValidate, updateCommunity);
router.delete('/:id', jwtValidate, deleteCommunity);
router.put('/:id/follow', jwtValidate, followCommunity);
router.put('/:id/unfollow', jwtValidate, unfollowCommunity);

module.exports = router;