class Game {
  constructor(nrow, ncol) {
    this.board = generateEmpty2DArray(nrow, ncol);
    this.nrow = nrow;
    this.ncol = ncol;
    this.activeSide = "X";
    this.totalCount = 0;
    this.gameOver = false;
    this.winner = null;
  }

  tryPlace(x, y) {
    if (this.board[x][y] !== null) {
      return false;
    }
    if (this.gameOver) {
      return false;
    }

    this.board[x][y] = this.activeSide;
    this.totalCount++;
    if (didWin(this.board, this.nrow, this.ncol, x, y)) {
      this.gameOver = true;
      this.winner = this.activeSide;
    } else if (this.totalCount === this.nrow * this.ncol) {
      this.gameOver = true;
    }

    this.activeSide = switchSide(this.activeSide);
    return true;
  }
}

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

function switchSide(currentSide) {
  return currentSide === "X" ? "O" : "X";
}

function getCount(board, nrow, ncol, x, y, direction, symbol) {
  if (x < 0 || x >= nrow || y < 0 || y >= ncol) {
    return 0;
  }

  if (board[x][y] !== symbol) {
    return 0;
  }

  return (
    1 +
    getCount(
      board,
      nrow,
      ncol,
      x + direction[0],
      y + direction[1],
      direction,
      symbol
    )
  );
}

function didWin(board, nrow, ncol, x, y) {
  const symbol = board[x][y];

  // vertical
  let score =
    getCount(board, nrow, ncol, x, y, [-1, 0], symbol) +
    getCount(board, nrow, ncol, x, y, [1, 0], symbol) -
    1;
  if (score >= 3) return true;

  // horizental
  score =
    getCount(board, nrow, ncol, x, y, [0, 1], symbol) +
    getCount(board, nrow, ncol, x, y, [0, -1], symbol) -
    1;
  if (score >= 3) return true;

  // direction /
  score =
    getCount(board, nrow, ncol, x, y, [-1, +1], symbol) +
    getCount(board, nrow, ncol, x, y, [+1, -1], symbol) -
    1;
  if (score >= 3) return true;

  // direction \
  score =
    getCount(board, nrow, ncol, x, y, [+1, +1], symbol) +
    getCount(board, nrow, ncol, x, y, [-1, -1], symbol) -
    1;
  if (score >= 3) return true;

  return false;
}

module.exports = Game;
