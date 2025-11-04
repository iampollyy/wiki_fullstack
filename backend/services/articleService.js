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
      birthYear: data.birthYear,
      nationality: data.nationality,
      occupation: data.occupation,
      knownFor: data.knownFor,
      content: data.content,
    };
  });
};

const getArticleById = (id) => {
  const filePath = path.join(DATA_FOLDER, `${id}.json`);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
};

const createArticle = ({
  title,
  birthYear,
  nationality,
  occupation,
  knownFor,
  content,
}) => {
  const articleId = Date.now().toString();
  const filePath = path.join(DATA_FOLDER, `${articleId}.json`);
  const knownForInput = knownFor || "";
  const knownForList = knownForInput
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const articleData = {
    id: articleId,
    title,
    birthYear,
    nationality,
    occupation,
    knownFor: knownForList,
    content,
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
  if (
    updatedData.hasOwnProperty("knownFor") &&
    typeof updatedData.knownFor === "string"
  ) {
    updatedData.knownFor = updatedData.knownFor
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

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
