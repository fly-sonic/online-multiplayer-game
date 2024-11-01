const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  BOARD_SIZE: process.env.BOARD_SIZE,
};
