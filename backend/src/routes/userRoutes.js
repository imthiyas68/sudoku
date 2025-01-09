// backend/src/routes/userRoutes.js

const express = require('express');
const { createTestUser, getTestUserProgress } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Test user routes
router.post('/test-user', createTestUser);
router.get('/test-user/progress', auth, getTestUserProgress);

module.exports = router;