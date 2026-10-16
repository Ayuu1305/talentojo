const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Associations

// 1. Store Owner Relationship
User.hasOne(Store, {
  foreignKey: 'ownerId',
  as: 'ownedStore',
  onDelete: 'SET NULL',
});

Store.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

// 2. User Ratings Relationship
User.hasMany(Rating, {
  foreignKey: 'userId',
  as: 'ratings',
  onDelete: 'CASCADE',
});

Rating.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// 3. Store Ratings Relationship
Store.hasMany(Rating, {
  foreignKey: 'storeId',
  as: 'ratings',
  onDelete: 'CASCADE',
});

Rating.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store',
});

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
