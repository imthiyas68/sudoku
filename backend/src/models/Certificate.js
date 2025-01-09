// backend/src/models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['participation', 'winner'],
    required: true
  },
  gameMode: {
    type: String,
    enum: ['collaborative', 'solo', 'challenge'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  position: {
    type: Number,
    min: 1,
    max: 3
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  templateUrl: String,
  issuedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);