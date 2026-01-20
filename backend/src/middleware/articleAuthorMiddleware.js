const Article = require("../db/models/Article");
const User = require("../db/models/User");

const articleAuthorMiddleware = async (req, res, next) => {
  const userId = req.user.userId;
  const articleId = parseInt(req.params.id, 10);

  if (isNaN(articleId)) {
    return res.status(400).json({ message: "Invalid article ID" });
  }

  const article = await Article.findByPk(articleId);
  const user = await User.findByPk(userId);

  if(!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  if (article.authorId === user.id) {
		return next();
  }
  
  if (user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "You are not the author of this article" });
}

module.exports = articleAuthorMiddleware;