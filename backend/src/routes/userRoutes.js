const userService = require("../services/userService");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const rolesMiddleware = require("../middleware/rolesMiddleware");

router.get(
  "/",
  authMiddleware,
  rolesMiddleware(["admin"]),
  async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Error fetching users" });
    }
  }
);

router.get("/:id", authMiddleware, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(404).json({ error: "User not found" });
  }
});

router.put(
  "/:id/role",
  authMiddleware,
  rolesMiddleware(["admin"]),
  async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    if (!role || !["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }
    try {
      await userService.updateUserRole(userId, role);
      res.json({ message: "User role updated successfully" });
    } catch (err) {
      console.error("Error updating user role:", err);
      res.status(500).json({ error: "Error updating user role" });
    }
  }
);
module.exports = router;
