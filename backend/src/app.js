const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");
const articleVersionRoutes = require("./routes/articleVersionRoutes");
const commentRoutes = require("./routes/commentRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/articles", articleVersionRoutes);
app.use("/comments", commentRoutes);
app.use("/workspaces", workspaceRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/login", loginRoutes);
app.use("/signup", registrationRoutes);

module.exports = app;
