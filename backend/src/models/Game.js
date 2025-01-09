// backend/src/models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  sudokuId: {
    type: String,
    required: true,
    unique: true
  },
  mode: {
    type: String,
    enum: ['collaborative', 'solo', 'challenge'],
    required: true
  },
  gridSize: {
    type: Number,
    enum: [4, 6, 9],
    required: true
  },
  puzzle: {
    type: [[Number]],
    required: true
  },
  solution: {
    type: [[Number]],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'expired'],
    default: 'waiting'
  },
  startTime: Date,
  endTime: Date,
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // TTL index: 24 hours
  }
});

module.exports = mongoose.model('Game', gameSchema);