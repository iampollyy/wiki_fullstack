const express = require("express");
const router = express.Router();
const registrationService = require("../services/registrationService");

router.post("/", async (req, res) => {
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
    
    if (err.name === "SequelizeValidationError") {
      const validationErrors = err.errors.map((e) => {
        if (e.path === "email" && e.validatorKey === "isEmail") {
          return "Please enter a valid email address";
        }
        if (e.path === "email") {
          return "Email is required";
        }
        if (e.path === "firstName") {
          return "First name is required";
        }
        if (e.path === "lastName") {
          return "Last name is required";
        }
        if (e.path === "passwordHash") {
          return "Password is required";
        }
        return e.message;
      });
      return res.status(400).json({ error: validationErrors[0] || "Validation failed" });
    }
    
    // Handle unique constraint errors
    if (err.name === "SequelizeUniqueConstraintError") {
      if (err.errors && err.errors.some((e) => e.path === "email")) {
        return res.status(400).json({ error: "This email is already in use" });
      }
    }
    
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;
