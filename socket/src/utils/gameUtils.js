// socket/src/utils/gameUtils.js
class GameUtils {
    // Validate if a move is legal in Sudoku rules
    static validateMove(board, row, col, value, gridSize) {
        // Skip validation for empty cell
        if (value === 0) return true;

        // Check row
        for (let i = 0; i < gridSize; i++) {
            if (i !== col && board[row][i] === value) {
                return false;
            }
        }

        // Check column
        for (let i = 0; i < gridSize; i++) {
            if (i !== row && board[i][col] === value) {
                return false;
            }
        }

        // Check box
        const boxSize = Math.sqrt(gridSize);
        const boxStartRow = Math.floor(row / boxSize) * boxSize;
        const boxStartCol = Math.floor(col / boxSize) * boxSize;

        for (let i = boxStartRow; i < boxStartRow + boxSize; i++) {
            for (let j = boxStartCol; j < boxStartCol + boxSize; j++) {
                if (i !== row && j !== col && board[i][j] === value) {
                    return false;
                }
            }
        }

        return true;
    }

    // Calculate possible numbers for all empty cells
    static updatePossibleNumbers(board, gridSize) {
        const possibleNumbers = Array(gridSize).fill().map(() => 
            Array(gridSize).fill().map(() => 
                new Set([...Array(gridSize)].map((_, i) => i + 1))
            )
        );

        // Remove numbers based on existing values
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (board[row][col] !== 0) {
                    this.updateCellInfluence(possibleNumbers, row, col, board[row][col], gridSize);
                }
            }
        }

        return possibleNumbers;
    }

    // Update possible numbers for cells affected by a placement
    static updateCellInfluence(possibleNumbers, row, col, value, gridSize) {
        // Remove from row
        for (let i = 0; i < gridSize; i++) {
            possibleNumbers[row][i].delete(value);
        }

        // Remove from column
        for (let i = 0; i < gridSize; i++) {
            possibleNumbers[i][col].delete(value);
        }

        // Remove from box
        const boxSize = Math.sqrt(gridSize);
        const boxStartRow = Math.floor(row / boxSize) * boxSize;
        const boxStartCol = Math.floor(col / boxSize) * boxSize;

        for (let i = boxStartRow; i < boxStartRow + boxSize; i++) {
            for (let j = boxStartCol; j < boxStartCol + boxSize; j++) {
                possibleNumbers[i][j].delete(value);
            }
        }
    }

    // Calculate score for a move
    static calculateMoveScore(difficulty, possibleNumbersCount, timeElapsed, gridSize) {
        const basePoints = 10;
        const difficultyMultiplier = {
            easy: 1,
            medium: 1.5,
            hard: 2
        };

        // Fewer possible numbers = harder move = more points
        const complexityMultiplier = Math.max(1, (gridSize - possibleNumbersCount) / 2);

        // Earlier moves get slightly more points
        const timeBonus = Math.max(1, 2 - (timeElapsed / 600)); // 10 minutes base time

        return Math.round(
            basePoints * 
            difficultyMultiplier[difficulty] * 
            complexityMultiplier * 
            timeBonus
        );
    }

    // Check if the game is complete
    static checkGameCompletion(board) {
        const gridSize = board.length;

        // Check if board is fully filled
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (board[row][col] === 0) return false;
            }
        }

        // Validate all rows, columns and boxes
        return this.validateFullBoard(board);
    }

    // Validate a completed board
    static validateFullBoard(board) {
        const gridSize = board.length;
        const boxSize = Math.sqrt(gridSize);

        // Check rows and columns
        for (let i = 0; i < gridSize; i++) {
            const rowNums = new Set();
            const colNums = new Set();

            for (let j = 0; j < gridSize; j++) {
                rowNums.add(board[i][j]);
                colNums.add(board[j][i]);
            }

            if (rowNums.size !== gridSize || colNums.size !== gridSize) {
                return false;
            }
        }

        // Check boxes
        for (let boxRow = 0; boxRow < gridSize; boxRow += boxSize) {
            for (let boxCol = 0; boxCol < gridSize; boxCol += boxSize) {
                const boxNums = new Set();

                for (let i = 0; i < boxSize; i++) {
                    for (let j = 0; j < boxSize; j++) {
                        boxNums.add(board[boxRow + i][boxCol + j]);
                    }
                }

                if (boxNums.size !== gridSize) {
                    return false;
                }
            }
        }

        return true;
    }
}

module.exports = GameUtils;