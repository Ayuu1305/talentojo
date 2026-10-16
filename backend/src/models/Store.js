const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Store name cannot be empty.',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Store email is already in use.',
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address.',
      },
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: {
        args: [0, 400],
        msg: 'Address cannot exceed 400 characters.',
      },
    },
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'owner_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'stores',
  timestamps: true,
  underscored: true,
});

module.exports = Store;
