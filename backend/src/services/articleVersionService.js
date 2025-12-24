const ArticleVersion = require("../db/models/articleVersion");

const getArticleVersions = async (articleId) => {
  const versions = await ArticleVersion.findAll({
    where: { articleId },
    order: [["versionNumber", "DESC"]],
  });
  return versions.map((version) => version.toJSON());
};

const getArticleVersion = async (articleId, versionNumber) => {
  const version = await ArticleVersion.findOne({
    where: { articleId, versionNumber },
  });
  return version ? version.toJSON() : null;
};

module.exports = {
  getArticleVersions,
  getArticleVersion,
};
