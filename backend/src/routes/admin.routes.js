const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  createUser,
  getAllStores,
  createStore,
  getAvailableStoreOwners,
} = require('../controllers/admin.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const { validateUserRegistration, validateStoreCreation } = require('../middleware/validate.middleware');

// All routes here require Admin role
router.use(authenticateToken, authorizeRoles('admin'));

// Admin Dashboard stats
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.post('/users', validateUserRegistration, createUser);

// Store Management
router.get('/stores', getAllStores);
router.post('/stores', validateStoreCreation, createStore);

// Helper to get available store owners for store creation
router.get('/store-owners', getAvailableStoreOwners);

module.exports = router;
