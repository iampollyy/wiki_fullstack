const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Workspace extends Model {}

Workspace.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Workspace",
    tableName: "Workspaces",
    timestamps: true,
  }
);

Workspace.associate = function (models) {
  Workspace.hasMany(models.Article, {
    foreignKey: "workspaceId",
    as: "articles",
  });
};

module.exports = Workspace;
