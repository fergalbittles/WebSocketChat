var express = require("express");
var socket = require("socket.io");

// App setup
var app = express();
var server = app.listen(9080, function () {
  console.log("listening for requests on port 9080");
});

// Serve static files from public folder
app.use(express.static("public"));

// Socket setup
var io = socket(server);

// Listen for a client connection
io.on("connection", function (socket) {
  console.log("made a socket connection", socket.id);

  // Handle "messageSent" event
  socket.on("messageSent", function (data) {
    io.sockets.emit("newMessage", data);
  });

  // Handle "typing" event
  socket.on("typing", function (data) {
    socket.broadcast.emit("newTyping", data);
  });
});
