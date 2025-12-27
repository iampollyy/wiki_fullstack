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
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Workspaces",
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
  },
  {
    sequelize,
    modelName: "Article",
    tableName: "Articles",
    timestamps: true,
  }
);

Article.associate = function (models) {
  Article.hasMany(models.Comment, {
    foreignKey: "articleId",
    as: "comments",
  });
  Article.belongsTo(models.Workspace, {
    foreignKey: "workspaceId",
    as: "workspace",
  });
  Article.belongsTo(models.User, {
    foreignKey: "authorId",
    as: "author",
  });
  Article.hasMany(models.ArticleVersion, {
    foreignKey: "articleId",
    as: "versions",
  });
};

module.exports = Article;
