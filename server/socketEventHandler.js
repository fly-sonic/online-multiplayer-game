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
};
