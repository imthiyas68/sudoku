// backend/src/models/SudokuScore.js
const mongoose = require('mongoose');

const sudokuScoreSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID of the player
    firstName: { type: String, required: true }, // Player's first name
    lastName: { type: String, required: true }, // Player's last name
    class: { type: String, required: true }, // Player's class/grade level
    totalScore: { type: Number, default: 0 }, // Total score across all Sudoku games
    gamesPlayed: { type: Number, default: 0 }, // Number of Sudoku games played
    bestTime: { type: Number, default: null }, // Best completion time (in seconds)
    achievements: [{ type: String }], // List of achievements (e.g., "Fast Solver", "No Errors")
    createdAt: { type: Date, default: Date.now }, // Timestamp of when the score was created
    updatedAt: { type: Date, default: Date.now } // Timestamp of the last update
});

const SudokuScore = mongoose.model('SudokuScore', sudokuScoreSchema);

module.exports = SudokuScore;