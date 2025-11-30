const Workspace = require("../db/models/workspace");
const Article = require("../db/models/article");

const getWorkspaces = async () => {
  const workspaces = await Workspace.findAll({
    attributes: ["id", "name", "slug", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });
  return workspaces.map((workspace) => workspace.toJSON());
};

const getWorkspaceBySlug = async (slug) => {
  const workspace = await Workspace.findOne({
    where: { slug },
    include: [
      {
        model: Article,
        as: "articles",
        attributes: ["id", "title", "content", "createdAt", "updatedAt"],
        order: [["createdAt", "DESC"]],
      },
    ],
  });
  if (!workspace) {
    throw new Error("Workspace not found");
  }
  return workspace.toJSON();
};

const createWorkspace = async ({ name, slug }) => {
  if (!name || !slug) {
    throw new Error("Name and slug are required");
  }

  const existingWorkspace = await Workspace.findOne({ where: { slug } });
  if (existingWorkspace) {
    throw new Error("Workspace with this slug already exists");
  }

  const workspace = await Workspace.create({
    name,
    slug,
  });
  return workspace.id;
};

module.exports = {
  getWorkspaces,
  getWorkspaceBySlug,
  createWorkspace,
};
