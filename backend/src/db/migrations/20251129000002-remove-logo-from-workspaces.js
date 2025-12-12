"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("Workspaces");
    if (tableDescription.logo) {
      await queryInterface.removeColumn("Workspaces", "logo");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Workspaces", "logo", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
