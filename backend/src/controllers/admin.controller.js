const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');

/**
 * Get Admin Dashboard Stats
 * - Total number of users
 * - Total number of stores
 * - Total number of submitted ratings
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    console.error('Admin getDashboardStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics.',
      error: error.message,
    });
  }
};

/**
 * Get All Users with Filtering, Sorting, and Store Owner Rating
 * Supports filters on: name, email, address, role
 * Supports sorting by: name, email, address, role, rating, createdAt
 */
const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name.trim()}%` };
    }
    if (email) {
      where.email = { [Op.like]: `%${email.trim()}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address.trim()}%` };
    }
    if (role) {
      where.role = role.trim();
    }

    // Fetch users with their owned store and store ratings
    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      include: [
        {
          model: Store,
          as: 'ownedStore',
          attributes: ['id', 'name'],
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: ['rating'],
            },
          ],
        },
      ],
      order: sortBy !== 'rating' ? [[sortBy, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']] : undefined,
    });

    // Format output and calculate store owner rating if applicable
    let formattedUsers = users.map((user) => {
      let storeRating = null;
      let storeName = null;

      if (user.role === 'store_owner' && user.ownedStore) {
        storeName = user.ownedStore.name;
        const ratings = user.ownedStore.ratings || [];
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
          storeRating = parseFloat((sum / ratings.length).toFixed(1));
        } else {
          storeRating = 0; // 0 ratings yet
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        storeName,
        rating: storeRating, // Displayed if Store Owner
        createdAt: user.createdAt,
      };
    });

    // If sorting by rating
    if (sortBy === 'rating') {
      const orderModifier = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
      formattedUsers.sort((a, b) => {
        const valA = a.rating === null ? -1 : a.rating;
        const valB = b.rating === null ? -1 : b.rating;
        return (valA - valB) * orderModifier;
      });
    }

    return res.status(200).json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Admin getAllUsers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users list.',
      error: error.message,
    });
  }
};

/**
 * Add New User (Admin functionality)
 * Form fields: Name, Email, Password, Address, Role
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role = 'user' } = req.body;

    // Check email uniqueness
    const existingUser = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      address: address.trim(),
      role: role.trim(),
    });

    return res.status(201).json({
      success: true,
      message: `User created successfully with role '${newUser.role}'.`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Admin createUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user.',
      error: error.message,
    });
  }
};

/**
 * Get All Stores with Overall Rating, Filtering, and Sorting
 * Supports filters on: name, email, address
 * Supports sorting by: name, email, address, rating, createdAt
 */
const getAllStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name.trim()}%` };
    }
    if (email) {
      where.email = { [Op.like]: `%${email.trim()}%` };
    }
    if (address) {
      where.address = { [Op.like]: `%${address.trim()}%` };
    }

    const stores = await Store.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'ownerId', 'createdAt'],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: sortBy !== 'rating' ? [[sortBy, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']] : undefined,
    });

    let formattedStores = stores.map((store) => {
      const ratings = store.ratings || [];
      let overallRating = 0;
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        overallRating = parseFloat((sum / ratings.length).toFixed(1));
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        ownerName: store.owner ? store.owner.name : 'Unassigned',
        rating: overallRating,
        totalRatings: ratings.length,
        createdAt: store.createdAt,
      };
    });

    if (sortBy === 'rating') {
      const orderModifier = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
      formattedStores.sort((a, b) => (a.rating - b.rating) * orderModifier);
    }

    return res.status(200).json({
      success: true,
      stores: formattedStores,
    });
  } catch (error) {
    console.error('Admin getAllStores error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stores list.',
      error: error.message,
    });
  }
};

/**
 * Add New Store (Admin functionality)
 * Form fields: Name, Email, Address, (optional: ownerId)
 */
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check store email uniqueness
    const existingStore = await Store.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'A store with this email address already exists.',
      });
    }

    // If ownerId is provided, verify user is a store_owner
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({
          success: false,
          message: 'Selected store owner user does not exist.',
        });
      }
      if (owner.role !== 'store_owner') {
        return res.status(400).json({
          success: false,
          message: 'Selected user does not have the "store_owner" role.',
        });
      }
    }

    const newStore = await Store.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      ownerId: ownerId || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Store added successfully.',
      store: newStore,
    });
  } catch (error) {
    console.error('Admin createStore error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add store.',
      error: error.message,
    });
  }
};

/**
 * Get list of available Store Owners (users with role 'store_owner')
 * Useful for assigning a store owner when creating a store
 */
const getAvailableStoreOwners = async (req, res) => {
  try {
    const owners = await User.findAll({
      where: { role: 'store_owner' },
      attributes: ['id', 'name', 'email'],
    });

    return res.status(200).json({
      success: true,
      owners,
    });
  } catch (error) {
    console.error('Admin getAvailableStoreOwners error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store owners.',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  createUser,
  getAllStores,
  createStore,
  getAvailableStoreOwners,
};
