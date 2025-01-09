// backend/src/controllers/adminController.js
const Game = require('../models/Game');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

const adminController = {
  createTournament: async (req, res) => {
    try {
      const { mode, rounds, startTime, endTime } = req.body;
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const games = [];
      for (let i = 0; i < rounds; i++) {
        const game = new Game({
          sudokuId: `TOURNAMENT_${Date.now()}_${i}`,
          mode,
          startTime,
          endTime,
          status: 'waiting'
        });
        games.push(await game.save());
      }

      res.json(games);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  generateCertificates: async (req, res) => {
    try {
      const { gameId, type } = req.body;
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const game = await Game.findById(gameId)
        .populate('participants')
        .populate('teams');

      // Generate certificates based on game mode and rankings
      const certificates = [];
      if (game.mode === 'collaborative') {
        // Generate team certificates
        for (const team of game.teams) {
          const cert = new Certificate({
            type,
            gameMode: game.mode,
            team: team._id,
            gameId: game._id
          });
          certificates.push(await cert.save());
        }
      } else {
        // Generate individual certificates
        for (const participant of game.participants) {
          const cert = new Certificate({
            type,
            gameMode: game.mode,
            user: participant._id,
            gameId: game._id
          });
          certificates.push(await cert.save());
        }
      }

      res.json(certificates);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = adminController;