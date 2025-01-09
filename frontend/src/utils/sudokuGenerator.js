// utils/sudokuGenerator.js
import { getConfigForGrade } from './gameConfig';

class SudokuGenerator {
  constructor() {
    this.initialize(9);
  }

  initialize(size) {
    this.size = size;
    this.boxSize = Math.sqrt(size);
    this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
  }

  generateBoard(grade, difficulty = 'MEDIUM') {
    const config = getConfigForGrade(grade);
    this.initialize(config.gridSize);

    // For testing, use predefined valid puzzles
    let basePuzzle;
    
    if (config.gridSize === 4) {
      basePuzzle = [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1]
      ];
    } else if (config.gridSize === 6) {
      basePuzzle = [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 1, 2, 3],
        [2, 3, 1, 6, 4, 5],
        [5, 6, 4, 3, 1, 2],
        [3, 1, 2, 5, 6, 4],
        [6, 4, 5, 2, 3, 1]
      ];
    } else {
      basePuzzle = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 1, 5, 6, 4, 8, 9, 7],
        [5, 6, 4, 8, 9, 7, 2, 3, 1],
        [8, 9, 7, 2, 3, 1, 5, 6, 4],
        [3, 1, 2, 6, 4, 5, 9, 7, 8],
        [6, 4, 5, 9, 7, 8, 3, 1, 2],
        [9, 7, 8, 3, 1, 2, 6, 4, 5]
      ];
    }

    // Create puzzle by removing numbers based on difficulty
    const puzzle = basePuzzle.map(row => [...row]);
    const maxEmptyCells = config.difficulty[difficulty].maxEmpty;
    let cellsToRemove = maxEmptyCells;

    while (cellsToRemove > 0) {
      const row = Math.floor(Math.random() * this.size);
      const col = Math.floor(Math.random() * this.size);
      
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        cellsToRemove--;
      }
    }

    return {
      puzzle,
      solution: basePuzzle
    };
  }
}

export default SudokuGenerator;