// backend/src/models/SudokuSession.js
const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    mode: { type: String, required: true }, // Game mode (e.g., "SOLO", "COLLABORATIVE", "CHALLENGE")
    players: [{
        userId: { type: String, required: true }, // ID of the player
        firstName: { type: String, required: true }, // Player's first name
        lastName: { type: String, required: true }, // Player's last name
        class: { type: String, required: true }, // Player's class/grade level
        score: { type: Number, default: 0 } // Player's score
    }],
    puzzle: [[Number]], // The Sudoku puzzle grid for this session
    startTime: { type: Date, default: Date.now }, // Timestamp of when the game started
    endTime: Date, // Timestamp of when the game ended
    status: { type: String, default: "ACTIVE" } // Status of the game (e.g., "ACTIVE", "COMPLETED")
});

// Create the SudokuSession model and explicitly set the collection name to 'sudoku_sessions'
const SudokuSession = mongoose.model('SudokuSession', gameSessionSchema, 'sudoku_sessions');

module.exports = SudokuSession; // Correct export