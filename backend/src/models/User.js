// backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  class: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  totalScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
