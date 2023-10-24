const User = require("../models/user");
const bcrypt = require("bcrypt");

const { USER_EMAIL, USER_ADMIN_PASSWORD } = process.env;
const createAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(USER_ADMIN_PASSWORD, 10);
      const newUser = new User({
        username: "admin",
        password: hashedPassword,
        email: USER_EMAIL,
        firstName: "Admin",
        lastName: "Chain Insights",
        role: "admin",
      });
      await newUser.save();
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { createAdminUser };
