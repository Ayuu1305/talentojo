const express = require('express');
const router = express.Router();
const { signup, login, getMe, updatePassword } = require('../controllers/auth.controller');
const { validateUserRegistration, validatePasswordUpdate } = require('../middleware/validate.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', validateUserRegistration, signup);
router.post('/login', login);

// Protected routes (for all authenticated users)
router.get('/me', authenticateToken, getMe);
router.put('/update-password', authenticateToken, validatePasswordUpdate, updatePassword);

module.exports = router;
