// SudokuGrid.js
const mongoose = require('mongoose');

const sudokuGridSchema = new mongoose.Schema({
    grids: [{
        class: { type: String, required: true },
        puzzle: { type: [[Number]], required: true },
        solution: { type: [[Number]], required: true },
        difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' },
        createdAt: { type: Date, default: Date.now }
    }]
});

const SudokuGrid = mongoose.model('SudokuGrid', sudokuGridSchema);

module.exports = SudokuGrid;