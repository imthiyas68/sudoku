// backend/src/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/auth');

exports.createTestUser = async (req, res) => {
    try {
        // Delete existing test user if exists
        await User.deleteOne({ email: 'test@example.com' });

        // Create new test user
        const testUser = await User.create({
            username: 'TestUser',
            email: 'test@example.com',
            password: 'test123', // In real app, should be hashed
            grade: req.body.grade || 7,
            stats: {
                soloGames: 0,
                totalScore: 0,
                totalTimePlayed: 0,
                highestScore: 0,
                recentGames: []
            },
            preferences: {
                difficulty: 'MEDIUM',
                theme: 'light',
                notifications: true
            }
        });

        // Generate authentication token
        const token = generateToken(testUser._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: testUser._id,
                    username: testUser.username,
                    email: testUser.email,
                    grade: testUser.grade,
                    stats: testUser.stats,
                    preferences: testUser.preferences
                },
                token
            }
        });
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test user',
            error: error.message
        });
    }
};

// Add routes for test user
exports.getTestUserProgress = async (req, res) => {
    try {
        const testUser = await User.findOne({ email: 'test@example.com' })
            .select('-password')
            .populate('stats.recentGames');

        if (!testUser) {
            return res.status(404).json({
                success: false,
                message: 'Test user not found'
            });
        }

        res.status(200).json({
            success: true,
            data: testUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching test user progress',
            error: error.message
        });
    }
};