const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");

class ArticleVersion extends Model {}

ArticleVersion.init(
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
      onDelete: "CASCADE",
    },

    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "ArticleVersion",
    tableName: "ArticleVersions",
    timestamps: true,
  }
);

ArticleVersion.associate = function (models) {
  ArticleVersion.belongsTo(models.Article, {
    foreignKey: "articleId",
    as: "article",
  });

  ArticleVersion.belongsTo(models.Workspace, {
    foreignKey: "workspaceId",
    as: "workspace",
  });
};

module.exports = ArticleVersion;
