require("dotenv").config();

const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
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
        console.log("✓ Admin user already exists");
      }
    } catch (err) {
      console.error("Error seeding admin:", err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await User.destroy({
        where: { email: process.env.ADMIN_EMAIL },
      });
      console.log("✓ Admin user removed");
    } catch (err) {
      console.error("Error removing admin:", err);
      throw err;
    }
  },
};
