const fs = require("fs");
const path = require("path");

const DATA_FOLDER = path.join(__dirname, "../data");

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

const getArticleById = (id) => {
  const filePath = path.join(DATA_FOLDER, `${id}.json`);
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

const updateArticle = (id, updatedData) => {
  const filePath = path.join(DATA_FOLDER, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error("Article not found");
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const article = JSON.parse(content);
  const newArticle = { ...article, ...updatedData };
  fs.writeFileSync(filePath, JSON.stringify(newArticle, null, 2));
  return newArticle;
};

const deleteArticle = (id) => {
  const filePath = path.join(DATA_FOLDER, `${id}.json`);
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
