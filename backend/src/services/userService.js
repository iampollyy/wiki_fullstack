const User = require("../db/models/User");
const { notifyRoom } = require("./notificationService");

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: [
      "id",
      "firstName",
      "lastName",
      "role",
      "email",
      "createdAt",
      "updatedAt",
    ],
  });
  return users.map((user) => user.toJSON());
};

const getUserById = async (userId) => {
  const id = parseInt(userId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }
  const user = await User.findByPk(id, {
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "role",
      "createdAt",
      "updatedAt",
    ],
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user.toJSON();
};

const updateUserRole = async (userId, newRole) => {
  const id = parseInt(userId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }
  const user = await User.findByPk(id, {
    attributes: [
      "id",
      "firstName",
      "lastName",
      "email",
      "role",
      "createdAt",
      "updatedAt",
    ],
  });
  if (!user) {
    throw new Error("User not found");
  }
  user.role = newRole;
  await user.save();
  notifyRoom("adminNotifications", {
    message: `User ${user.id} role updated to ${newRole}`,
    newRole,
  });
  return user.toJSON();
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
};
