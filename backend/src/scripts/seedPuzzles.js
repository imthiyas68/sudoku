// backend/src/scripts/seedPuzzles.js
const mongoose = require('mongoose');
const SudokuGrid = require('../models/SudokuGrid');
const { generatePuzzle } = require('../utils/puzzleGenerator');

const seedPuzzles = async () => {
    try {
        await mongoose.connect('mongodb+srv://user1:JAjMCmxIqyBGerzU@cluster0.abcde.mongodb.net/test?retryWrites=true&w=majority');

        // Generate and save 10 Sudoku puzzles
        for (let i = 0; i < 10; i++) {
            const { puzzle, solution } = generatePuzzle(9);
            const sudokuGrid = new SudokuGrid({
                grids: [{
                    class: 'default', // Replace with actual class if needed
                    puzzle,
                    solution,
                    difficulty: 'MEDIUM',
                }]
            });
            await sudokuGrid.save();
        }

        console.log('Puzzles seeded successfully!');
    } catch (error) {
        console.error('Error seeding puzzles:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedPuzzles();