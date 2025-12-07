const express = require("express");
const router = express.Router();
const articleVersionService = require("../services/articleVersionService");

router.get("/:articleId/versions/:versionNumber", async (req, res) => {
  const articleId = req.params.articleId;
  const versionNumber = req.params.versionNumber;
  if (!articleId || !versionNumber) {
    return res
      .status(404)
      .json({ error: "No such Article ID or version number" });
  }
  try {
    const version = await articleVersionService.getArticleVersion(
      articleId,
      versionNumber
    );
    res.status(200).json(version);
  } catch (err) {
    console.error("Error fetching article version:", err);
    res.status(500).json({ error: "Error fetching article version" });
  }
});

router.get("/:articleId/versions", async (req, res) => {
  const articleId = req.params.articleId;
  if (!articleId) {
    return res.status(404).json({ error: "No such Article ID" });
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
