const express = require('express');
const router = express.Router();
const { getStoresForUser, submitOrUpdateRating } = require('../controllers/store.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

// View store listings (accessible to logged-in users)
router.get('/', authenticateToken, getStoresForUser);

// Submit or modify rating for a store (normal users)
router.post('/:storeId/rating', authenticateToken, authorizeRoles('user'), submitOrUpdateRating);

module.exports = router;
