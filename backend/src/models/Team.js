// backend/src/models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  currentGame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  totalScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['waiting', 'playing', 'completed'],
    default: 'waiting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', teamSchema);
