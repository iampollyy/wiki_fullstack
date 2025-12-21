const express = require("express");
const router = express.Router();
const loginService = require("../services/loginService");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginService.loginUser({ email, password });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
