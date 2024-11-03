import React, { useEffect, useState } from "react";
import axios from "axios";

function generateEmpty2DArray(nrow, ncol) {
  const array = [];
  for (let i = 0; i < nrow; i++) {
    array[i] = [];
    for (let j = 0; j < ncol; j++) {
      array[i][j] = null;
    }
  }
  return array;
}

const Square = ({ value, rowIndex, colIndex, handleSquareClick, disabled }) => {
  return (
    <button
      className="square"
      onClick={() => handleSquareClick(rowIndex, colIndex)}
      disabled={disabled || value !== null}
    >
      {value}
    </button>
  );
};

const Row = ({ row, rowIndex, handleSquareClick, disabled }) => {
  return (
    <div className="board-row">
      {row.map((square, colIndex) => (
        <Square
          key={colIndex}
          value={square}
          rowIndex={rowIndex}
          colIndex={colIndex}
          handleSquareClick={handleSquareClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

const Game = ({ socket, roomId, size, handleRestart }) => {
  const [gameStatus, setGameStatus] = useState({
    board: generateEmpty2DArray(size, size),
    activeSide: "X",
    gameOver: false,
    winner: null,
  });
  const [mySide, setMySide] = useState(null);

  useEffect(() => {
    socket.emit("query-side", roomId, (side) => {
      setMySide(side);
    });

    const onGameStatusUpdate = (newGameStatus) => {
      setGameStatus(newGameStatus);
    };

    socket.on("gameStatus-update", onGameStatusUpdate);

    return () => {
      socket.off("gameStatus-update", onGameStatusUpdate);
    };
  }, []);

  const handleSquareClick = (x, y) => {
    setGameStatus({
      ...gameStatus,
      activeSide: mySide === "X" ? "O" : "X",
    });

    socket.emit("game-move", roomId, x, y);
  };

  return (
    <>
      {mySide && <h1>You are playing as {mySide}</h1>}
      {gameStatus.board.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          row={row}
          rowIndex={rowIndex}
          handleSquareClick={handleSquareClick}
          disabled={gameStatus.activeSide !== mySide || gameStatus.gameOver}
        />
      ))}

      {gameStatus.gameOver && (
        <>
          {gameStatus.winner === null ? (
            <h1>Tie</h1>
          ) : (
            <h1>Winner is {gameStatus.winner}</h1>
          )}

          <button onClick={handleRestart}>Play again!</button>
        </>
      )}
    </>
  );
};

export default Game;
