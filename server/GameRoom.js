const Game = require("./Game");
const { DEFAULT_BOARD_SIZE } = require("./config");

class GameRoom {
  constructor(id, playerIds) {
    this.id = id;
    this.players = [];
    playerIds.forEach((playerId) => {
      this.players.push(playerId);
    });

    this.boardSize = DEFAULT_BOARD_SIZE;
    this.readyPlayerCount = 0;
    this.XPlayerIndex = null;
    this.game = null;
  }

  startGame() {
    if (this.XPlayerIndex === null) {
      this.XPlayerIndex = 0;
    } else {
      this.XPlayerIndex = 1 - this.XPlayerIndex;
    }

    this.game = new Game(this.boardSize, this.boardSize);

    // reset ready
    this.readyPlayerCount = 0;
  }

  getSide(playerId) {
    return this.players[this.XPlayerIndex] === playerId ? "X" : "O";
  }
}

module.exports = GameRoom;
