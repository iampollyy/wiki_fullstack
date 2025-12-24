const User = require("../db/models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );
  return { token, user: user.toJSON() };
};

module.exports = {
  loginUser,
};
