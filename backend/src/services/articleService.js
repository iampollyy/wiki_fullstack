const fs = require("fs");
const path = require("path");
const { notifyRoom, ws } = require("./notificationService");

const DATA_FOLDER = path.join(__dirname, "../../data");

if (!fs.existsSync(DATA_FOLDER)) {
  fs.mkdirSync(DATA_FOLDER);
}

const getArticles = () => {
  return fs.readdirSync(DATA_FOLDER).map((file) => {
    const filePath = path.join(DATA_FOLDER, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    return {
      id: file.replace(".json", ""),
      title: data.title,
      content: data.content,
    };
  });
};

const getArticleById = (articleId) => {
  const filePath = path.join(DATA_FOLDER, `${articleId}.json`);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
};

const createArticle = ({ title, content, attachments }) => {
  const articleId = Date.now().toString();
  const filePath = path.join(DATA_FOLDER, `${articleId}.json`);

  const articleData = {
    id: articleId,
    title,
    content,
    attachments: attachments || [],
  };

  fs.writeFileSync(filePath, JSON.stringify(articleData, null, 2));
  return articleId;
};

const updateArticle = (articleId, updatedData) => {
  const filePath = path.join(DATA_FOLDER, `${articleId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error("Article not found");
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const article = JSON.parse(content);
  const newArticle = { ...article, ...updatedData };
  fs.writeFileSync(filePath, JSON.stringify(newArticle, null, 2));

  notifyRoom(`article_${articleId}`, { type: "notification", article: newArticle, message: "Article has been updated!" });

  return newArticle;
};

const deleteArticle = (articleId) => {
  const filePath = path.join(DATA_FOLDER, `${articleId}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
