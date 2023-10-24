const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.exists({ email });

    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const existUsername = await User.exists({ username: req.body.username });

    if (existUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userInfo = { ...req.body, password: hash };

    const newUser = new User(userInfo);
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1y",
    });

    return res.status(200).json({ success: true, data: savedUser, token });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate a token and send it back to the user
    const token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1y",
    });

    return res
      .status(200)
      .json({ success: true, data: foundUser, token: token });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.decodedToken.id;

    const { username, email, password, firstName, lastName } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (username) {
      const existUsername = await User.exists({
        username,
        _id: { $ne: userId },
      });

      if (existUsername) {
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
      }
    }

    if (email) {
      const existEmail = await User.exists({ email, _id: { $ne: userId } });

      if (existEmail) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      user.password = hash;
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    await user.save();

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "User not found", error: error });
  }
};

const validateUser = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const findUser = await User.findOne({ _id: decodedToken.id });

    if (!findUser) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    return res
      .status(200)
      .json({ success: true, data: findUser, token: req.token });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token", error: error });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "User not found", error: error });
  }
};

const winCoins = async (req, res) => {
  try {
    const { id } = req.params;

    const { coins } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    user.coins += parseInt(coins);

    await user.save();

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "User not found", error: error });
  }
};

const followUser = async (req, res) => {
  try {
    const id = req.decodedToken.id;

    const { userId } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const userToFollow = await User.findById(userId);

    const existUser = userToFollow.followers.find((user) => user == userId);

    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already follows the user" });
    }

    user.following.push(userId);

    userToFollow.followers.push(id);

    await user.save();
    await userToFollow.save();

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "User not found", error: error });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const id = req.decodedToken.id;

    const { userId } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const userToUnfollow = await User.findById(userId);

    const existUser = userToUnfollow.followers.find((user) => user == id);

    if (!existUser) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't follow the user" });
    }

    user.following = user.following.filter((user) => user != userId);

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (user) => user != id
    );

    await user.save();
    await userToUnfollow.save();

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "User not found", error: error });
  }
};

const getUsers = async (req, res) => {
  try {
    console.log("called");
    const users = await User.find();
    console.log("users", users.length);
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Users not found", error: error });
  }
};

module.exports = {
  winCoins,
  createUser,
  loginUser,
  followUser,
  unfollowUser,
  validateUser,
  updateUser,
  getUserByUsername,
  getUsers,
};
