const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./db/db");
const http = require("http");
const app = require("./app");

// Импортируем модели, чтобы они инициализировались
require("./db/models/article");

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await sequelize.sync();
    console.log("Tables synchronized");

    const server = http.createServer(app);
    server.listen(process.env.PORT || 5000);
  } catch (err) {
    console.error(err);
  }
}

start();
