var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');
const { validateUserData } = require('../middlewares/user');
const { 
  createUser, 
  loginUser, 
  validateUser, 
  winCoins, 
  getUserByUsername, 
  followUser, 
  unfollowUser 
} = require('../controllers/user');

var router = express.Router();

router.post('/new', validateUserData, createUser);
router.post('/login',  loginUser);
router.get('/validate', jwtValidate, validateUser);
router.get('/username/:username', getUserByUsername);
router.put('/:id/win-coins', jwtValidate, winCoins);
router.put('/follow', jwtValidate, followUser);
router.put('/unfollow', jwtValidate, unfollowUser);

module.exports = router;