require("dotenv").config();

const bcrypt = require("bcryptjs");
const sequelize = require("../db");
const User = require("..db/models/user.js");

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");

    const existingAdmin = await User.findOne({
      where: { role: "admin" },
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        salt
      );

      await User.create({
        firstName: "Minion",
        lastName: "Bob",
        email: process.env.ADMIN_EMAIL,
        passwordHash: hashedPassword,
        role: "admin",
      });

      console.log("✓ Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    process.exit(1);
  });
