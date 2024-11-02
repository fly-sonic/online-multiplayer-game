const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const registerSocketEventHandler = require("./socketEventHandler");

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
  registerSocketEventHandler(io, socket);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
