const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/owner.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

// Store Owner dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('store_owner'), getOwnerDashboard);

module.exports = router;
