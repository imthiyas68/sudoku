const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings'); // Assuming you have a Settings model

// GET /admin/settings - Fetch Sudoku settings
router.get('/settings', async (req, res) => {
    try {
        // Fetch settings from the database
        const settings = await Settings.findOne({ type: 'sudoku' });
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error.message);
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
});

// POST /admin/settings - Update Sudoku settings
router.post('/settings', async (req, res) => {
    const { difficulty, gridSize, mode } = req.body;

    try {
        // Find or create settings in the database
        let settings = await Settings.findOne({ type: 'sudoku' });
        if (settings) {
            // Update existing settings
            settings.difficulty = difficulty;
            settings.gridSize = gridSize;
            settings.mode = mode;
            await settings.save();
        } else {
            // Create new settings
            settings = new Settings({ type: 'sudoku', difficulty, gridSize, mode });
            await settings.save();
        }
        res.status(200).json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error('Error updating settings:', error.message);
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
});

module.exports = router;




