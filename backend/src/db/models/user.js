const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
  }
);

User.associate = function (models) {
  User.hasMany(models.Article, {
    foreignKey: "authorId",
    as: "articles",
  });
  User.hasMany(models.Comment, {
    foreignKey: "authorId",
    as: "comments",
  });
};

module.exports = User;
