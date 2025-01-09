// backend/src/utils/gameState.js
const User = require('../models/User'); // Ensure this import is correct

const updateGameState = {
  async updateUserStats(userId, { gameId, score, timeElapsed }) {
    try {
      const user = await User.findById(userId);

      // Update user's solo game statistics
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'stats.soloGames': 1,
          'stats.totalScore': score,
          'stats.totalTimePlayed': timeElapsed,
        },
        $max: {
          'stats.highestScore': score,
        },
        $push: {
          'stats.recentGames': {
            gameId,
            score,
            timeElapsed,
            playedAt: new Date(),
          },
        },
      });

      // Trim recent games array to keep only last 10 games
      await User.findByIdAndUpdate(userId, {
        $push: {
          'stats.recentGames': {
            $each: [],
            $slice: -10,
          },
        },
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  },
};

module.exports = { updateGameState };