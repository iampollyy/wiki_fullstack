const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;
