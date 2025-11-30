const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");
const commentRoutes = require("./routes/commentRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);
app.use("/workspaces", workspaceRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;
