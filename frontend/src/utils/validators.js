// utils/validators.js
export const validateMove = (puzzle, row, col, value) => {
  // Check row
  for (let i = 0; i < puzzle.length; i++) {
    if (i !== col && puzzle[row][i]?.value === value) return false;
  }
  
  // Check column
  for (let i = 0; i < puzzle.length; i++) {
    if (i !== row && puzzle[i][col]?.value === value) return false;
  }
  
  // Check box
  const boxSize = puzzle.length === 9 ? 3 : puzzle.length === 6 ? 2 : 2;
  const boxRow = Math.floor(row / boxSize) * boxSize;
  const boxCol = Math.floor(col / boxSize) * boxSize;
  
  for (let i = boxRow; i < boxRow + boxSize; i++) {
    for (let j = boxCol; j < boxCol + boxSize; j++) {
      if (i !== row && j !== col && puzzle[i][j]?.value === value) return false;
    }
  }
  
  return true;
};