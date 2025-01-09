// gridRoutes.js
const express = require('express');
const router = express.Router();
const { SudokuGrid } = require('../models/SudokuGrid');
const { generatePuzzle } = require('../utils/puzzleGenerator');

// Fetch Sudoku grid based on class and mode
router.get('/grid', async (req, res) => {
    const { class: userClass, mode } = req.query;
    try {
        let grid;
        if (mode === 'solo' || mode === 'challenge') {
            // Generate a new puzzle for solo or challenge mode
            grid = generatePuzzle(9); // 9x9 grid
        } else if (mode === 'collaborative') {
            // Fetch a pre-generated puzzle for collaborative mode
            const grids = await SudokuGrid.find({ 'grids.class': userClass });
            grid = grids[0]?.grids[0]?.puzzle || generatePuzzle(9); // Fallback to generated puzzle
        }
        res.json({ grid });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grid', error: error.message });
    }
});

module.exports = router;