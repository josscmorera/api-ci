var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');
const { validateUserData } = require('../middlewares/user');
const { createUser, loginUser, validateUser, winCoins, getUserByUsername } = require('../controllers/user');

var router = express.Router();

router.post('/new', validateUserData, createUser);
router.post('/login',  loginUser);
router.get('/validate', jwtValidate, validateUser);
router.get('/username/:username', getUserByUsername);
router.put('/:id/win-coins', jwtValidate, winCoins);

module.exports = router;