const Article = require("../db/models/article");
const Workspace = require("../db/models/workspace");

async function getWorkspaces() {
  try {
    const workspaces = await Workspace.findAll({
      attributes: ["id", "name", "slug", "createdAt", "updatedAt"],
    });
    return workspaces.map((workspace) => workspace.toJSON());
  } catch (err) {
    console.error("Error in getWorkspaces:", err);
    throw err;
  }
}

async function getWorkspaceBySlug(slug) {
  try {
    const workspace = await Workspace.findOne({
      where: { slug },
      include: [
        {
          model: Article,
          as: "articles",
          attributes: [
            "id",
            "title",
            "content",
            "workspaceId",
            "attachments",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return workspace.toJSON();
  } catch (err) {
    console.error("Error in getWorkspaceBySlug:", err);
    throw err;
  }
}

async function createWorkspace(workspace) {
  const { name, slug } = workspace;

  try {
    const existingWorkspace = await Workspace.findOne({ where: { slug } });

    if (existingWorkspace) {
      throw new Error("Workspace with this slug already exists");
    }

    const newWorkspace = await Workspace.create({
      name,
      slug,
    });

    return newWorkspace.id;
  } catch (err) {
    console.error("Error in createWorkspace:", err);
    throw err;
  }
}

module.exports = {
  getWorkspaces,
  getWorkspaceBySlug,
  createWorkspace,
};
