const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;
