const express = require("express");
const router = express.Router();
const articleService = require("../services/articleService");

router.get("/", async (req, res) => {
  try {
    const articles = await articleService.getArticles();
    res.json(articles);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Error fetching articles" });
  }
});

router.get("/:id", async (req, res) => {
  const articleId = req.params.id;

  try {
    const article = await articleService.getArticleById(articleId);
    res.json(article);
  } catch (err) {
    console.error("No article found:", err);
    res.status(404).json({ error: "No article found" });
  }
});

router.post("/", async (req, res) => {
  const { title, birthYear, nationality, occupation, knownFor, content } =
    req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const articleId = articleService.createArticle({
      title,
      birthYear,
      nationality,
      occupation,
      knownFor,
      content,
    });
    res.status(201).json({ id: articleId, message: "Article created" });
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({ error: "Error creating article" });
  }
});

module.exports = router;
