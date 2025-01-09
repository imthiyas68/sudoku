export const validateMove = (puzzle, row, col, value) => {
    // Check row
    for (let i = 0; i < puzzle.length; i++) {
        if (i !== col && puzzle[row][i] === value) return false;
    }

    // Check column
    for (let i = 0; i < puzzle.length; i++) {
        if (i !== row && puzzle[i][col] === value) return false;
    }

    // Check 3x3 box
    const boxSize = puzzle.length === 9 ? 3 : puzzle.length === 6 ? 2 : 2;
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;

    for (let i = boxRow; i < boxRow + boxSize; i++) {
        for (let j = boxCol; j < boxCol + boxSize; j++) {
            if (i !== row && j !== col && puzzle[i][j] === value) return false;
        }
    }

    return true;
};

export const calculateScore = (difficulty, timeSpent, mistakes) => {
    const baseScore = 1000;
    const timeBonus = Math.max(0, 1000 - timeSpent) * 0.5;
    const mistakePenalty = mistakes * 50;
    const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2
    }[difficulty] || 1;

    return Math.max(0, Math.floor((baseScore + timeBonus - mistakePenalty) * difficultyMultiplier));
};