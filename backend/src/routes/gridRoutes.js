const express = require('express');
const router = express.Router();
const { generatePuzzle } = require('../utils/puzzleGenerator');
const SudokuGrid = require('../models/SudokuGrid');
const SudokuSession = require('../models/SudokuSession');

// Fetch Sudoku grid based on class and mode
router.get('/grid', async (req, res) => {
    const { class: userClass, mode, userId, firstName, lastName } = req.query;
    try {
        let grid, solution;
        if (mode === 'solo' || mode === 'challenge') {
            // Generate a new puzzle for solo or challenge mode
            const { puzzle, solution: sol } = generatePuzzle(9); // 9x9 grid
            grid = puzzle;
            solution = sol;
        } else if (mode === 'collaborative') {
            // Fetch a pre-generated puzzle for collaborative mode
            const grids = await SudokuGrid.find({ 'grids.class': userClass });
            if (grids.length > 0) {
                grid = grids[0].grids[0].puzzle;
                solution = grids[0].grids[0].solution;
            } else {
                // Fallback to generated puzzle
                const { puzzle, solution: sol } = generatePuzzle(9);
                grid = puzzle;
                solution = sol;
            }
        }

        // Create a new game session with user data
        const gameSession = await SudokuSession.create({
            mode,
            players: [{ userId, firstName, lastName, class: userClass, score: 0 }],
            puzzle: grid,
            solution: solution, // Save the solution
            startTime: new Date(),
            status: "ACTIVE"
        });

        res.json({ grid, gameSessionId: gameSession._id });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching grid', error: error.message });
    }
});

module.exports = router;