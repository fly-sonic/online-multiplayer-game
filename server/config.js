const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  DEFAULT_BOARD_SIZE: process.env.DEFAULT_BOARD_SIZE,
};
