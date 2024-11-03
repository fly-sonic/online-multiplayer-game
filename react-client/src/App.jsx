import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome!</h1>
      <br />

      <h2>Play Tic-Tac-Toe with your friend in three easy steps:</h2>
      <p>1. Click the button below to enter a game room</p>
      <p>2. Share the game room link with your friend</p>
      <p>3. Just Play!</p>

      <button
        onClick={() => {
          const minCeiled = 1;
          const maxFloored = 1000;
          const randomRoomId = Math.floor(
            Math.random() * (maxFloored - minCeiled) + minCeiled
          );
          navigate(`/room/${randomRoomId}`);
        }}
      >
        Enter Game Room
      </button>
    </>
  );
}

export default App;
