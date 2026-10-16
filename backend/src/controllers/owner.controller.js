const { Store, Rating, User } = require('../models');

/**
 * Get Store Owner Dashboard
 * Returns:
 * - Store info (Name, Email, Address)
 * - Average Rating & Total Ratings Count
 * - List of users who submitted ratings for this store (User Name, User Email, Rating, Date)
 * - Sorting support (by name, email, rating, date)
 */
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    // Find store owned by this user
    const store = await Store.findOne({
      where: { ownerId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(200).json({
        success: true,
        hasStore: false,
        message: 'No store is currently assigned to your account. Please contact an Administrator.',
        store: null,
        averageRating: 0,
        totalRatings: 0,
        ratingUsers: [],
      });
    }

    const ratings = store.ratings || [];
    let averageRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = parseFloat((sum / ratings.length).toFixed(1));
    }

    // Format list of users who submitted ratings
    let ratingUsers = ratings.map((r) => ({
      ratingId: r.id,
      rating: r.rating,
      createdAt: r.createdAt,
      userName: r.user ? r.user.name : 'Unknown User',
      userEmail: r.user ? r.user.email : 'Unknown Email',
    }));

    // Sorting
    const orderModifier = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
    if (sortBy === 'name') {
      ratingUsers.sort((a, b) => a.userName.localeCompare(b.userName) * orderModifier);
    } else if (sortBy === 'email') {
      ratingUsers.sort((a, b) => a.userEmail.localeCompare(b.userEmail) * orderModifier);
    } else if (sortBy === 'rating') {
      ratingUsers.sort((a, b) => (a.rating - b.rating) * orderModifier);
    } else {
      // Default: date (createdAt)
      ratingUsers.sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * orderModifier);
    }

    return res.status(200).json({
      success: true,
      hasStore: true,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      averageRating,
      totalRatings: ratings.length,
      ratingUsers,
    });
  } catch (error) {
    console.error('getOwnerDashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve store dashboard.',
      error: error.message,
    });
  }
};

module.exports = {
  getOwnerDashboard,
};
