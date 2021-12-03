//Node js app uses express as the middleware
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { isObject } = require("util");

const app = express();
const nodeServer = http.createServer(app);
const socketEvent = socketio(nodeServer);

//This sets the node.js application to the web files in that static folder
app.use(express.static("static"));
socketEvent.on("connection", (socket) => {
  //this Text of type message is emited to the socket.
  //The client can call socket.on('message') to catch this emited event and display its content
  socket.emit("message", "Welcome to the chat");

  socket.on("join", (user) => {
    socket.join(user.room);

    socket.broadcast.to(user.room).emit("newUser", user.username);

    socket.broadcast
      .to(user.room)
      .emit("newChat", {
        username: "System",
        message: user.username + " has joined"
      });
  });

  socket.on("leave", (user) => {
    socketEvent
      .to(user.room)
      .emit("newChat", {
        username: "System",
        message: user.username + " has left"
      });
    socketEvent.to(user.room).emit("removeUser", user.username);
  });

  //Listens for chat input
  socket.on("send", (sent) => {
    socketEvent.to(sent.room).emit("newChat", sent);
  });
});

//Logging requests
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

const PORT = 80;
//The Node.js app starts to listen on port 3000
nodeServer.listen(PORT, () => console.log(`Backend running on port: ${PORT}`));
