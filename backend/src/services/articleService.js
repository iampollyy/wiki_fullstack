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
}) => {
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

const updateArticle = async (articleId, updatedData) => {
  const id = parseInt(articleId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid article ID");
  }

  const article = await Article.findByPk(id);
  if (!article) {
    throw new Error("Article not found");
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

  const hasChanges =
    (finalData.title !== undefined && finalData.title !== article.title) ||
    (finalData.content !== undefined && finalData.content !== article.content) ||
    (finalData.attachments !== undefined &&
      JSON.stringify(finalData.attachments) !== JSON.stringify(article.attachments)) ||
    (finalData.workspaceId !== undefined &&
      finalData.workspaceId !== article.workspaceId);

  let newVersion = null;
  if (hasChanges) {
    const lastVersion = await ArticleVersion.findOne({
      where: { articleId },
      order: [["versionNumber", "DESC"]],
    });

    const nextVersion = lastVersion ? lastVersion.versionNumber + 1 : 1;

    newVersion = await ArticleVersion.create({
      articleId,
      title: finalData.title !== undefined ? finalData.title : article.title,
      content:
        finalData.content !== undefined ? finalData.content : article.content,
      attachments:
        finalData.attachments !== undefined
          ? finalData.attachments
          : article.attachments,
      workspaceId:
        finalData.workspaceId !== undefined
          ? finalData.workspaceId
          : article.workspaceId,
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
