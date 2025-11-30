const express = require("express");
const router = express.Router();
const articleService = require("../services/articleService");
const upload = require("../middleware/fileUpload");

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
  const { title, content, attachments, workspaceSlug } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const articleId = await articleService.createArticle({
      title,
      content,
      attachments,
      workspaceSlug,
    });
    res.status(201).json({ id: articleId, message: "Article created" });
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(500).json({ error: "Error creating article" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await articleService.deleteArticle(req.params.id);

    if (!success) {
      return res.status(404).json({ message: "The article not found" });
    }

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res
      .status(500)
      .json({ message: "Error deleting article", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const updatedArticle = await articleService.updateArticle(id, updatedData);
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    if (error && error.message === "Article not found") {
      return res.status(404).json({ message: "Article not found" });
    }
    res
      .status(500)
      .json({ message: "Error updating article", error: error.message });
  }
});

router.post("/upload-attachment", upload.single("attachment"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({ url: fileUrl });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: "File upload failed" });
  }
});

module.exports = router;
