const Article = require("../db/models/article");
const { notifyRoom } = require("./notificationService");

const getArticles = async () => {
  const articles = await Article.findAll({
    attributes: ["id", "title", "content", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });
  return articles.map((article) => article.toJSON());
};

const getArticleById = async (articleId) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid article ID");
  }

  const article = await Article.findByPk(id);
  if (!article) {
    throw new Error("Article not found");
  }
  return article.toJSON();
};

const createArticle = async ({ title, content, attachments }) => {
  const article = await Article.create({
    title,
    content,
    attachments: attachments || [],
  });
  return article.id;
};

const updateArticle = async (articleId, updatedData) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid article ID");
  }

  const article = await Article.findByPk(id);
  if (!article) {
    throw new Error("Article not found");
  }

  await article.update(updatedData);
  const updatedArticle = article.toJSON();

  notifyRoom(`article_${articleId}`, {
    type: "notification",
    article: updatedArticle,
    message: "Article has been updated!",
  });

  return updatedArticle;
};

const deleteArticle = async (articleId) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    return false;
  }

  const article = await Article.findByPk(id);
  if (!article) {
    return false;
  }

  await article.destroy();
  return true;
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
