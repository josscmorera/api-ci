var express = require("express");

const { jwtValidate } = require("../middlewares/jwt");
const { validateUserData } = require("../middlewares/user");
const {
  createUser,
  loginUser,
  validateUser,
  winCoins,
  getUserByUsername,
  followUser,
  unfollowUser,
  updateUser,
} = require("../controllers/user");

var router = express.Router();

router.post("/register", validateUserData, createUser);
router.post("/login", loginUser);
router.get("/authtoken", jwtValidate, validateUser);
router.get("/username/:username", getUserByUsername);
router.put("/:id", jwtValidate, updateUser);
router.put("/:id/donate", jwtValidate, winCoins);
router.put("/:userId/follow", jwtValidate, followUser);
router.put("/:userId/unfollow", jwtValidate, unfollowUser);

module.exports = router;
