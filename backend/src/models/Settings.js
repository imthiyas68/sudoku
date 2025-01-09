const mongoose = require('mongoose');

// Define the schema for Sudoku settings
const settingsSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'sudoku'
  difficulty: { type: String, required: true }, // e.g., 'easy', 'medium', 'hard'
  gridSize: { type: Number, required: true }, // e.g., 4, 6, 9
  mode: { type: String, required: true }, // e.g., 'unlimited', 'timed'
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Settings', settingsSchema);
