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

let corsPolicy = {};
// TODO
if (process.env.NODE_ENV === "development") {
  corsPolicy = {
    origin: ["http://localhost:5173", "http://localhost:3030"],
    methods: ["GET", "POST"],
    credentials: true,
  };
}

const io = new Server(server, {
  cors: corsPolicy,
});

// TODO
if (process.env.NODE_ENV === "development") {
  const { instrument } = require("@socket.io/admin-ui");
  instrument(io, {
    auth: false,
    mode: "development",
  });
}

io.on("connection", (socket) => {
  console.log(`${socket.id} connected...`);
  registerSocketEventHandler(io, socket);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
