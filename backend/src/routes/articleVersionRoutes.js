const express = require("express");
const router = express.Router();
const articleVersionService = require("../services/articleVersionService");
const authMiddleware = require("../middleware/auth");

router.get("/:articleId/versions/:versionNumber", authMiddleware, async (req, res) => {
  const articleId = req.params.articleId;
  const versionNumber = parseInt(req.params.versionNumber, 10);

  if (!articleId || isNaN(versionNumber)) {
    return res
      .status(400)
      .json({ error: "Invalid Article ID or version number" });
  }
  try {
    const version = await articleVersionService.getArticleVersion(
      articleId,
      versionNumber
    );
    if (!version) {
      return res.status(404).json({ error: "Version not found" });
    }
    res.status(200).json(version);
  } catch (err) {
    console.error("Error fetching article version:", err);
    res.status(500).json({ error: "Error fetching article version" });
  }
});

router.get("/:articleId/versions", authMiddleware, async (req, res) => {
  const articleId = parseInt(req.params.articleId, 10);
  if (!articleId || isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid Article ID" });
  }
  try {
    const versions = await articleVersionService.getArticleVersions(articleId);
    res.status(200).json(versions);
  } catch (err) {
    console.error("Error fetching article versions:", err);
    res.status(500).json({ error: "Error fetching article versions" });
  }
});

module.exports = router;
