const app = require('./app');
const { sequelize, User } = require('./models');
const seedDatabase = require('./utils/seedData');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('[Database] Connected successfully.');

    // Sync database schema (does not drop existing data unless forced)
    await sequelize.sync();
    console.log('[Database] Schema synchronized.');

    // If no users exist, auto-seed demo data for immediate preview
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('[Database] No existing users found. Auto-seeding initial demo data...');
      await seedDatabase();
    }

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Store Rating Backend Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
