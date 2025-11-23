const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");
const { registerSocketEvents } = require("./services/notificationService");

dotenv.config();

const server = http.createServer(app);
const port = process.env.PORT || 5000;

const io = initSocket(server);
io.on("connection", registerSocketEvents);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
