const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.SERIAL,
      primaryKey: true,
      autoIncrement: true,
    },
    firtsName: {
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
