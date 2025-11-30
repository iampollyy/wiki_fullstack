const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./db/db");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");
const { registerSocketEvents } = require("./services/notificationService");

const Article = require("./db/models/article");
const Comment = require("./db/models/comment");
const Workspace = require("./db/models/workspace");

const models = { Article, Comment, Workspace };
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    await sequelize.sync();
    console.log("Tables synchronized");

    const server = http.createServer(app);
    const io = initSocket(server);
    
    io.on("connection", registerSocketEvents);

    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();
