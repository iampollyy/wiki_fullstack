const { Op } = require("sequelize");
const Article = require("../db/models/article");
const User = require("../db/models/user");
const Workspace = require("../db/models/workspace");
const { notifyRoom } = require("./notificationService");
const ArticleVersion = require("../db/models/articleVersion");
const PDFDocument = require("pdfkit");

const getArticles = async (workspaceId = null, search = null) => {
  const conditions = [];
  if (workspaceId) conditions.push({ workspaceId });
  const q =
    search != null && String(search).trim() !== ""
      ? String(search).trim()
      : null;
  if (q) {
    const pattern = `%${q}%`;
    conditions.push({
      [Op.or]: [
        { title: { [Op.iLike]: pattern } },
        { content: { [Op.iLike]: pattern } },
      ],
    });
  }
  const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

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

const generateArticlePDF = async (articleId, res) => {
  const article = await getArticleById(articleId);
  if (!article) {
    throw new Error("Article not found");
  }

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=article_${article.id}.pdf`,
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text(article.title, { align: "center" });

  doc.moveDown(1.5);

  doc
    .fontSize(10)
    .fillColor("gray")
    .text(`Workspace: ${article.workspace?.name || "-"}`);
  doc.text(`Created: ${new Date(article.createdAt).toLocaleDateString()}`);

  doc.moveDown();
  doc.fillColor("black");

  doc.fontSize(12).font("Helvetica").text(article.content, {
    align: "left",
    lineGap: 5,
  });

  doc.end();
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  generateArticlePDF,
};
