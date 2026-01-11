const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Articles",
        key: "id",
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "Comments",
    timestamps: true,
  }
);

Comment.associate = function (models) {
  Comment.belongsTo(models.Article, {
    foreignKey: "articleId",
    as: "article",
  });
  Comment.belongsTo(models.User, {
    foreignKey: "authorId",
    as: "author",
  });
};

module.exports = Comment;
