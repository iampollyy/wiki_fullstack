const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Article",
    tableName: "Articles",
    timestamps: true,
  }
);

module.exports = Article;
