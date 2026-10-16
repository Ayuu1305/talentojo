const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_store_rating_jwt_key_2026');
    
    // Fetch user from DB to ensure account is still active and valid
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'address', 'role'],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param  {...string} roles Allowed roles ('admin', 'user', 'store_owner')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access is restricted to [${roles.join(', ')}] role(s).`,
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
