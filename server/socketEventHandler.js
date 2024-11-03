const gameRooms = require("./gameRooms");
const GameRoom = require("./GameRoom");

function getGameRoomById(gameRooms, roomId) {
  const gameRoom = gameRooms.find((gameRoom) => gameRoom.id === roomId);
  if (!gameRoom) {
    throw new Error(`Can't find gameRoom ${roomId}`);
  }
  return gameRoom;
}

module.exports = (io, socket) => {
  socket.on("try-join-room", (roomId, cb) => {
    let joinRoomSucceeded = false;
    if (
      !io.sockets.adapter.rooms.has(roomId) ||
      io.sockets.adapter.rooms.get(roomId).size < 2
    ) {
      socket.join(roomId);
      joinRoomSucceeded = true;
    }

    if (joinRoomSucceeded) {
      if (io.sockets.adapter.rooms.get(roomId).size === 2) {
        gameRooms.push(
          new GameRoom(roomId, io.sockets.adapter.rooms.get(roomId))
        );
      }

      socket.on("ready", (roomId, cb) => {
        const gameRoom = getGameRoomById(gameRooms, roomId);

        gameRoom.readyPlayerCount++;
        cb();

        if (gameRoom.readyPlayerCount === gameRoom.players.length) {
          gameRoom.startGame();
          io.to(roomId).emit("start-game", gameRoom.boardSize);
        }
      });

      socket.on("query-side", (roomId, cb) => {
        const gameRoom = getGameRoomById(gameRooms, roomId);

        const side = gameRoom.getSide(socket.id);
        cb(side);
      });

      socket.on("game-move", (roomId, x, y) => {
        const gameRoom = getGameRoomById(gameRooms, roomId);

        // Only play if the socket player is active
        if (gameRoom.getSide(socket.id) === gameRoom.game.activeSide) {
          if (gameRoom.game.tryPlace(x, y)) {
            io.to(roomId).emit("gameStatus-update", {
              board: gameRoom.game.board,
              activeSide: gameRoom.game.activeSide,
              gameOver: gameRoom.game.gameOver,
              winner: gameRoom.game.winner,
            });
          }
        }
      });
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

      gameRooms.splice(
        gameRooms.findIndex((gameRoom) => gameRoom.id === roomId),
        1
      );
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected!`);
  });
};
