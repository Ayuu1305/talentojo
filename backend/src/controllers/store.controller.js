const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');

/**
 * Get All Stores for Normal Users
 * Supports:
 * - Search by Name and Address
 * - Sorting by Name, Address, Overall Rating
 * - Displays:
 *   - Store Name
 *   - Address
 *   - Overall Rating
 *   - User's Submitted Rating (for the authenticated user)
 */
const getStoresForUser = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    const where = {};
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: searchTerm } },
        { address: { [Op.like]: searchTerm } },
      ];
    }

    const stores = await Store.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'createdAt'],
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'rating', 'userId'],
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

      // Check if current user has already submitted a rating for this store
      let userSubmittedRating = null;
      let userRatingId = null;

      if (currentUserId) {
        const existingUserRating = ratings.find((r) => r.userId === currentUserId);
        if (existingUserRating) {
          userSubmittedRating = existingUserRating.rating;
          userRatingId = existingUserRating.id;
        }
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating,
        totalRatings: ratings.length,
        userSubmittedRating, // null if not rated yet, 1-5 if rated
        userRatingId,
        hasRated: userSubmittedRating !== null,
      };
    });

    // Handle sorting by overall rating
    if (sortBy === 'rating') {
      const orderModifier = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
      formattedStores.sort((a, b) => (a.overallRating - b.overallRating) * orderModifier);
    }

    return res.status(200).json({
      success: true,
      stores: formattedStores,
    });
  } catch (error) {
    console.error('getStoresForUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve store listings.',
      error: error.message,
    });
  }
};

/**
 * Submit or Modify Rating for a Store (Normal User)
 * Ratings must be between 1 and 5
 */
const submitOrUpdateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // Validate rating value
    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    // Verify store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      });
    }

    // Check if user has already rated this store
    let userRating = await Rating.findOne({
      where: {
        userId,
        storeId,
      },
    });

    let isModified = false;
    if (userRating) {
      // Modify existing rating
      userRating.rating = numericRating;
      await userRating.save();
      isModified = true;
    } else {
      // Submit new rating
      userRating = await Rating.create({
        userId,
        storeId,
        rating: numericRating,
      });
    }

    // Recalculate store overall rating
    const allStoreRatings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating'],
    });

    const sum = allStoreRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const newOverallRating = parseFloat((sum / allStoreRatings.length).toFixed(1));

    return res.status(200).json({
      success: true,
      message: isModified 
        ? 'Your rating has been modified successfully.' 
        : 'Thank you! Your rating has been submitted.',
      rating: userRating.rating,
      overallRating: newOverallRating,
      totalRatings: allStoreRatings.length,
    });
  } catch (error) {
    console.error('submitOrUpdateRating error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit or modify rating.',
      error: error.message,
    });
  }
};

module.exports = {
  getStoresForUser,
  submitOrUpdateRating,
};
