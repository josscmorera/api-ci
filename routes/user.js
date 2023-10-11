var express = require('express');

const { jwtValidate } = require('../middlewares/jwt');
const { validateUserData } = require('../middlewares/user');
const { createUser, loginUser, validateUser } = require('../controllers/user');

var router = express.Router();

router.post('/new',  validateUserData,createUser);
router.post('/login',  loginUser);
router.get('/validate', jwtValidate, validateUser);

module.exports = router;