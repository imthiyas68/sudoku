// backend/src/middleware/validate.js
const validate = {
  // Validate game mode
  gameMode: (req, res, next) => {
    const { mode } = req.body;
    const validModes = ['collaborative', 'solo', 'challenge'];

    if (!validModes.includes(mode)) {
      return res.status(400).json({ message: 'Invalid game mode' });
    }
    next();
  },

  // Validate team size
  teamSize: (req, res, next) => {
    const { members } = req.body;

    if (!Array.isArray(members) || members.length > 5) {
      return res.status(400).json({ message: 'Team size must not exceed 5 members' });
    }
    next();
  },

  // Validate Sudoku move
  validateMove: (board, row, col, value) => {
    // Check if the value is valid for the given cell
    if (value < 1 || value > 9) return false;

    // Check row and column for duplicates
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value || board[i][col] === value) {
        return false;
      }
    }

    // Check the 3x3 subgrid for duplicates
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === value) {
          return false;
        }
      }
    }

    return true;
  },
};

module.exports = validate;