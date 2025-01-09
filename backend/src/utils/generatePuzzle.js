function generatePuzzle(gridSize) {
  const blockSize = Math.sqrt(gridSize);

  function isValid(grid, row, col, num) {
    // Row check
    for (let x = 0; x < gridSize; x++) {
      if (grid[row][x] === num) return false;
    }

    // Column check
    for (let x = 0; x < gridSize; x++) {
      if (grid[x][col] === num) return false;
    }

    // Box check
    let startRow = row - row % blockSize;
    let startCol = col - col % blockSize;
    for (let i = 0; i < blockSize; i++) {
      for (let j = 0; j < blockSize; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  function solveSudoku(grid, row, col) {
    if (row === gridSize - 1 && col === gridSize) return true;
    if (col === gridSize) {
      row++;
      col = 0;
    }
    if (grid[row][col] !== 0) return solveSudoku(grid, row, col + 1);

    for (let num = 1; num <= gridSize; num++) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (solveSudoku(grid, row, col + 1)) return true;
      }
      grid[row][col] = 0;
    }

    return false;
  }

  function removeNumbers(grid, count) {
    while (count !== 0) {
      let cellId = Math.floor(Math.random() * gridSize * gridSize);
      let i = Math.floor(cellId / gridSize);
      let j = cellId % gridSize;
      if (grid[i][j] !== 0) {
        grid[i][j] = 0;
        count--;
      }
    }
  }

  let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  solveSudoku(grid, 0, 0);
  removeNumbers(grid, gridSize * gridSize / 2);
  return grid;
}

module.exports = generatePuzzle;