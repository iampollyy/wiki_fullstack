const User = require("../db/models/user");
const { notifyRoom } = require("../notificationService");
const bcrypt = require("bcrypt");

const registerUser = async ({ email, password, firstName, lastName }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  } else {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });
    notifyRoom("registrations", `Registered successfully: ${email}`);
    return newUser.toJSON();
  }
};

module.exports = {
  registerUser,
};
