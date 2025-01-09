// utils/scoreCalculator.js
const calculateScore = (isCorrect, timeElapsed, difficulty = 'medium') => {
  if (!isCorrect) return -5;

  const baseScore = 10;
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2
  }[difficulty];
  
  const timeBonus = Math.max(1, 2 - (timeElapsed / 300));
  return Math.round(baseScore * difficultyMultiplier * timeBonus);
};