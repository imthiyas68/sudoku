// gameController.js
const Team = require('../models/Team');
const Game = require('../models/Game');
const Move = require('../models/Move'); // Assuming you have a Move model

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, members } = req.body;
    const team = await Team.create({ name, members, status: 'waiting' });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a team
const joinTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.body;
    const team = await Team.findByIdAndUpdate(teamId, { $push: { members: userId } }, { new: true });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a team move
const submitTeamMove = async (req, res) => {
  try {
    const { teamId, userId, row, col, value } = req.body;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const game = await Game.findById(team.currentGame);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const isValid = validateMove(game.puzzle, row, col, value); // Implement validateMove function
    if (isValid) {
      await Move.create({ teamId, userId, row, col, value, isCorrect: true });
      game.puzzle[row][col] = value; // Update the puzzle
      await game.save();
      res.status(200).json({ message: 'Move accepted', game });
    } else {
      await Move.create({ teamId, userId, row, col, value, isCorrect: false });
      res.status(400).json({ message: 'Invalid move' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeam,
  joinTeam,
  submitTeamMove,
};