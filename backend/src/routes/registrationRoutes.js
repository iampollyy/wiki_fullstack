const express = require("express");
const router = express.Router();
const registrationService = require("../services/registrationService");

router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const newUser = await registrationService.registerUser({
      email,
      password,
      firstName,
      lastName,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
