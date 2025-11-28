const express = require("express");
const router = express.Router();
const commentService = require("../services/commentService");

router.get("/article/:articleId", async (req, res) => {
  const articleId = req.params.articleId;

  try {
    const comments = await commentService.getCommentsByArticleId(articleId);
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    if (err.message === "Invalid article ID") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Error fetching comments" });
  }
});

router.post("/article/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  const { author, content } = req.body;

  if (!articleId || isNaN(Number(articleId))) {
    return res.status(400).json({ error: "Invalid article ID" });
  }
  if (!author) {
    return res.status(400).json({ error: "Author is required" });
  }
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const comment = await commentService.createComment({
      articleId,
      author,
      content,
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    if (err.message === "Article not found") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Error creating comment" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }
  try {
    const success = await commentService.deleteComment(id);
    if (!success) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }
  if (updatedData.content !== undefined && !updatedData.content) {
    return res.status(400).json({ error: "Content cannot be empty" });
  }
  try {
    const updatedComment = await commentService.updateComment(id, updatedData);
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(500)
      .json({ message: "Error updating comment", error: error.message });
  }
});

module.exports = router;
