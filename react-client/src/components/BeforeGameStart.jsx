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
      <button onClick={handleClickStart} disabled={ready}>
        Start Game
      </button>
    </>
  );
};

export default BeforeGameStart;
