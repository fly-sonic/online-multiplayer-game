import React, { useState } from "react";

const BeforeGameStart = ({ socket, roomId }) => {
  const [ready, setReady] = useState(false);

  const handleClickStart = () => {
    socket.emit("ready", roomId, () => {
      setReady(true);
    });
  };

  return (
    <>
      <h1>Every one is here! Click the button to start the game!</h1>
      <button onClick={handleClickStart} disabled={ready}>
        Start Game
      </button>
    </>
  );
};

export default BeforeGameStart;
