// gameConfig.js
export const GRADE_CONFIGS = {
    ELEMENTARY: {
        gridSize: 4,
        subGridSize: 2,
        preFilledPercentage: 0.6,
        difficulty: {
            EASY: { maxEmpty: 4 },
            MEDIUM: { maxEmpty: 6 },
            HARD: { maxEmpty: 8 }
        },
        scoring: {
            correct: 10,
            timeBonus: 5,
            penalty: -2
        }
    },
    MIDDLE: {
        gridSize: 6,
        subGridSize: 2,
        preFilledPercentage: 0.5,
        difficulty: {
            EASY: { maxEmpty: 12 },
            MEDIUM: { maxEmpty: 16 },
            HARD: { maxEmpty: 20 }
        },
        scoring: {
            correct: 15,
            timeBonus: 8,
            penalty: -3
        }
    },
    HIGH: {
        gridSize: 9,
        subGridSize: 3,
        preFilledPercentage: 0.4,
        difficulty: {
            EASY: { maxEmpty: 30 },
            MEDIUM: { maxEmpty: 40 },
            HARD: { maxEmpty: 50 }
        },
        scoring: {
            correct: 20,
            timeBonus: 10,
            penalty: -5
        }
    }
};

export const getConfigForGrade = (grade) => {
    if (grade >= 1 && grade <= 3) return GRADE_CONFIGS.ELEMENTARY;
    if (grade >= 4 && grade <= 6) return GRADE_CONFIGS.MIDDLE;
    return GRADE_CONFIGS.HIGH;
};

export const getScoreMultiplier = (grade, difficulty) => {
    const baseMultiplier = Math.ceil(grade / 3);
    const difficultyMultipliers = {
        EASY: 1,
        MEDIUM: 1.5,
        HARD: 2
    };
    return baseMultiplier * difficultyMultipliers[difficulty];
};

export const calculateTimeBonus = (completionTime, grade) => {
    const config = getConfigForGrade(grade);
    const maxBonus = config.scoring.timeBonus * 10;
    const timeLimit = 300;
    const timeUsed = completionTime / 1000;
    
    if (timeUsed > timeLimit) return 0;
    return Math.floor(maxBonus * (1 - timeUsed / timeLimit));
};