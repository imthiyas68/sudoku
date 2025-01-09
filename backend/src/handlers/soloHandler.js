const { Game } = require('../models/Game');
const { calculateScore } = require('../utils/scoreCalculator');

// Initialize or resume game
const initializeGame = async (req, res) => {
  try {
    const { userId, grade, puzzle, solution } = req.body;

    // Save the game to the database
    const game = await Game.create({
      userId,
      mode: 'solo',
      grade,
      gridSize: puzzle.length,
      puzzle,
      solution,
      status: 'active',
      currentScore: 0,
      moves: [],
      startTime: new Date(),
      lastSaved: new Date(),
    });

    res.status(200).json({
      success: true,
      game: {
        id: game._id,
        grid: game.puzzle,
        score: game.currentScore,
        moves: game.moves,
        timeElapsed: Math.floor((new Date() - game.startTime) / 1000),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initialize game',
      error: error.message,
    });
  }
};

// Handle player move
const submitMove = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { row, col, value } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Validate the move
    const isCorrect = game.solution[row][col] === value;

    // Calculate the score
    const timeElapsed = Math.floor((new Date() - game.startTime) / 1000);
    const score = calculateScore(isCorrect, timeElapsed, game.difficulty);

    // Update the game state
    game.puzzle[row][col] = value;
    game.currentScore += score;
    game.moves.push({ row, col, value, isCorrect, timestamp: new Date() });
    await game.save();

    res.json({ isCorrect, score, currentScore: game.currentScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  initializeGame,
  submitMove,
};