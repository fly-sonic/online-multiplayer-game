import React, { useState, useEffect } from "react";
import BeforeGameStart from "./BeforeGameStart";
import Game from "./Game";

const GameRoom = ({ socket, roomId }) => {
  const [stage, setStage] = useState(0);
  const [boardSize, setBoardSize] = useState(null);

  useEffect(() => {
    function onStartGame(size) {
      setBoardSize(size);
      setStage(1);
    }

    socket.on("start-game", onStartGame);

    return () => {
      socket.off("start-game", onStartGame);
    };
  });

  const handleRestart = () => {
    setStage(0);
  };

  return (
    <>
      {stage === 0 && <BeforeGameStart socket={socket} roomId={roomId} />}
      {stage === 1 && (
        <Game
          socket={socket}
          roomId={roomId}
          size={boardSize}
          handleRestart={handleRestart}
        />
      )}
    </>
  );
};

export default GameRoom;
