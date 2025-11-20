const { getIO } = require("../config/socket");

const userSockets = new Map();

function registerSocketEvents(socket) {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    socket.data.userId = userId;

    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);
  }

  socket.on("join", (roomName) => {
    socket.join(roomName);
    socket.emit("joined", roomName);
  });

  socket.on("leave", (roomName) => {
    socket.leave(roomName);
  });

  socket.on("disconnect", () => {
    if (userId && userSockets.has(userId)) {
      const sockets = userSockets.get(userId);
      sockets.delete(socket.id);
      if (sockets.size === 0) userSockets.delete(userId);
    }
  });
}

function notifyRoom(roomName, payload, excludeUserId = null) {
  const io = getIO();

  if (!excludeUserId) {
    io.to(roomName).emit("notification", payload);
    return;
  }

  const socketsToExclude = userSockets.get(excludeUserId);
  if (!socketsToExclude || socketsToExclude.size === 0) {
    io.to(roomName).emit("notification", payload);
    return;
  }

  io.to(roomName)
    .except(Array.from(socketsToExclude))
    .emit("notification", payload);
}

function broadcast(event, payload) {
  const io = getIO();
  io.emit(event, payload);
}

module.exports = {
  registerSocketEvents,
  notifyRoom,
  broadcast,
};
