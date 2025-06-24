const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let chatHistory = [];

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  socket.on("new-user", (username) => {
    socket.username = username;
    socket.broadcast.emit("notification", `${username} joined the chat`);
    socket.emit("chat-history", chatHistory);
  });

  /*
  socket.on("chat message", (msg) => {
    const message = { user: socket.username, text: msg };
    chatHistory.push(message);
    io.emit("chat message", message);
  });*/
  socket.on("chat message", (msg) => {
  const message = {
    user: socket.username,
    text: msg,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  chatHistory.push(message);
  io.emit("chat message", message);
});


  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("notification", `${socket.username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
