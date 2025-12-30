const express = require("express");
const router = express.Router();
const commentService = require("../services/commentService");
const authMiddleware = require("../middleware/auth");
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

router.post("/article/:articleId", authMiddleware, async (req, res) => {
  const articleId = req.params.articleId;
  const { content } = req.body;

  if (!articleId || isNaN(Number(articleId))) {
    return res.status(400).json({ error: "Invalid article ID" });
  }
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const comment = await commentService.createComment({
      articleId,
      authorId: req.user.userId,
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

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }
  try {
    const success = await commentService.deleteComment(id, req.user.userId);
    if (!success) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    if (error.message === "Access denied") {
      return res.status(403).json({ message: "Access denied" });
    }
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }
  if (updatedData.content !== undefined && !updatedData.content.trim()) {
    return res.status(400).json({ error: "Content cannot be empty" });
  }
  try {
    const updatedComment = await commentService.updateComment(
      id,
      updatedData,
      req.user.userId
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    if (error.message === "Access denied") {
      return res.status(403).json({ message: "Access denied" });
    }
    res
      .status(500)
      .json({ message: "Error updating comment", error: error.message });
  }
});

module.exports = router;
