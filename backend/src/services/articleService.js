const Article = require("../db/models/article");
const Workspace = require("../db/models/workspace");
const { notifyRoom } = require("./notificationService");
const ArticleVersion = require("../db/models/articleVersion");

const getArticles = async (workspaceId = null) => {
  const where = workspaceId ? { workspaceId } : {};
  const articles = await Article.findAll({
    where,
    attributes: [
      "id",
      "title",
      "content",
      "workspaceId",
      "attachments",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Workspace,
        as: "workspace",
        attributes: ["id", "name", "slug"],
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return articles.map((article) => article.toJSON());
};

const getArticleById = async (articleId) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid article ID");
  }

  const article = await Article.findByPk(id, {
    include: [
      {
        model: Workspace,
        as: "workspace",
        attributes: ["id", "name", "slug"],
      },
    ],
  });
  if (!article) {
    throw new Error("Article not found");
  }
  return article.toJSON();
};

const createArticle = async ({
  title,
  content,
  attachments,
  workspaceId,
  workspaceSlug,
  workspaceName,
  authorId,
}) => {
  if (!authorId) {
    throw new Error("Author ID is required");
  }

  let finalWorkspaceId = workspaceId || null;

  if (workspaceSlug && !workspaceId) {
    let workspace = await Workspace.findOne({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      workspace = await Workspace.create({
        name: workspaceName || workspaceSlug,
        slug: workspaceSlug,
      });
    }

    finalWorkspaceId = workspace.id;
  }

  const article = await Article.create({
    title,
    content,
    attachments: attachments || [],
    workspaceId: finalWorkspaceId,
    authorId,
  });

  await ArticleVersion.create({
    articleId: article.id,
    title,
    content,
    attachments: attachments || [],
    workspaceId: finalWorkspaceId,
    versionNumber: 1,
  });

  return article.id;
};

const updateArticle = async (articleId, updatedData, userId) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid article ID");
  }

  const article = await Article.findByPk(id);
  if (!article) {
    throw new Error("Article not found");
  }

  if (!userId) {
    throw new Error("Access denied");
  }

  const { workspaceSlug, workspaceName, ...restData } = updatedData;
  let finalData = { ...restData };

  if (workspaceSlug) {
    let workspace = await Workspace.findOne({
      where: { slug: workspaceSlug },
    });

    if (!workspace) {
      workspace = await Workspace.create({
        name: workspaceName || workspaceSlug,
        slug: workspaceSlug,
      });
    }

    finalData.workspaceId = workspace.id;
  }

  let newVersion = null;
  if (finalData.title || finalData.content) {
    const lastVersion = await ArticleVersion.findOne({
      where: { articleId },
      order: [["versionNumber", "DESC"]],
    });

    const nextVersion = lastVersion ? lastVersion.versionNumber + 1 : 1;

    newVersion = await ArticleVersion.create({
      articleId,
      title: finalData.title || article.title,
      content: finalData.content || article.content,
      attachments: finalData.attachments || article.attachments,
      workspaceId: finalData.workspaceId || article.workspaceId,
      versionNumber: nextVersion,
    });
  }

  await article.update(finalData);
  const updatedArticle = article.toJSON();

  notifyRoom(`article_${articleId}`, {
    type: "notification",
    article: updatedArticle,
    version: newVersion ? newVersion.toJSON() : null,
    message: "Article has been updated!",
  });

  return newVersion ? newVersion.toJSON() : updatedArticle;
};

const deleteArticle = async (articleId, userId) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    return false;
  }

  const article = await Article.findByPk(id);
  if (!article) {
    return false;
  }

  if (!userId) {
    throw new Error("Access denied");
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
