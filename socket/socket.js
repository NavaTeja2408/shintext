const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

const server = express();

const app = http.createServer(server);
const io = new Server(app, {
  cors: { origin: ["http://localhost:3000", "https://shin-text.vercel.app"] },
});

const userSocketMap = {};

const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const getReciverId = (receiverId) => {
  return receiverId;
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { server, io, app, getReciverSocketId, getReciverId };
