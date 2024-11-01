const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // TODO
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected...`);

  socket.on("join-room", (roomId, cb) => {
    let joinRoomSucceeded = false;
    if (
      !io.sockets.adapter.rooms.has(roomId) ||
      io.sockets.adapter.rooms.get(roomId).size < 2
    ) {
      socket.join(roomId);
      joinRoomSucceeded = true;
    }

    cb(joinRoomSucceeded, io.sockets.adapter.rooms.get(roomId).size);

    if (joinRoomSucceeded) {
      // every socket in the room excluding the sender will get the event
      socket
        .to(roomId)
        .emit("playerCount-update", io.sockets.adapter.rooms.get(roomId).size);
    }
  });

  socket.on("disconnecting", (reason) => {
    socket.rooms.forEach((roomId) => {
      if (roomId === socket.id) {
        return;
      }

      socket
        .to(roomId)
        .emit(
          "playerCount-update",
          io.sockets.adapter.rooms.get(roomId).size - 1
        );
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected!`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
