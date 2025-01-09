export const DIFFICULTY_CONFIGS = {
  EASY: {
    minClues: 45,
    maxEmpty: 36
  },
  MEDIUM: {
    minClues: 36,
    maxEmpty: 45
  },
  HARD: {
    minClues: 30,
    maxEmpty: 51
  }
};

export const isValidMove = (grid, row, col, value) => {
  // Implementation of isValidMove function
};

export const isPuzzleComplete = (grid) => {
  if (!grid || grid.length !== 9) return false;

  // Check if grid is filled
  for (let i = 0; i < 9; i++) {
    if (!grid[i] || grid[i].length !== 9) return false;
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0 || grid[i][j] === null || grid[i][j] === undefined) return false;
    }
  }

  // Check rows
  for (let row = 0; row < 9; row++) {
    const numbers = new Set();
    for (let col = 0; col < 9; col++) {
      numbers.add(grid[row][col]);
    }
    if (numbers.size !== 9) return false;
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const numbers = new Set();
    for (let row = 0; row < 9; row++) {
      numbers.add(grid[row][col]);
    }
    if (numbers.size !== 9) return false;
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const numbers = new Set();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          numbers.add(grid[boxRow + i][boxCol + j]);
        }
      }
      if (numbers.size !== 9) return false;
    }
  }

  return true;
};

export const calculateScore = (moves, timer, difficulty) => {
  const baseScore = 1000;
  const timePenalty = timer * 2;
  const movePenalty = moves.length * 5;
  const difficultyMultiplier = DIFFICULTY_CONFIGS[difficulty].maxEmpty / 10;

  return Math.max(0, baseScore - timePenalty - movePenalty) * difficultyMultiplier;
};