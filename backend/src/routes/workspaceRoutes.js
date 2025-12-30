const express = require("express");
const router = express.Router();
const workspaceService = require("../services/workspaceService");
const authMiddleware = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const workspaces = await workspaceService.getWorkspaces();
    res.json(workspaces);
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    res.status(500).json({ error: "Error fetching workspaces" });
  }
});

router.get("/slug/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    const workspace = await workspaceService.getWorkspaceBySlug(slug);
    res.json(workspace);
  } catch (err) {
    console.error("No workspace found:", err);
    res.status(404).json({ error: "No workspace found" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: "Name and slug are required" });
  }

  try {
    const workspaceId = await workspaceService.createWorkspace({
      name,
      slug,
    });
    res.status(201).json({ id: workspaceId, message: "Workspace created" });
  } catch (err) {
    console.error("Error creating workspace:", err);
    if (err.message.includes("already exists")) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Error creating workspace" });
  }
});

module.exports = router;
