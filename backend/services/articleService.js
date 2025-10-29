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

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
};
