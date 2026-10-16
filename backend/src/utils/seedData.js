const bcrypt = require('bcryptjs');
const { sequelize, User, Store, Rating } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Syncing database schema...');
    await sequelize.sync({ force: true });
    console.log('[Seed] Database synced.');

    // 1. Create Users
    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@1234', salt);
    const ownerPassword = await bcrypt.hash('Owner@1234', salt);
    const userPassword = await bcrypt.hash('User@1234', salt);

    const admin = await User.create({
      name: 'System Administrator Master User', // 33 characters (valid 20-60)
      email: 'admin@example.com',
      password: adminPassword,
      address: '742 Evergreen Terrace, Sector 5, Springfield Central',
      role: 'admin',
    });

    const owner = await User.create({
      name: 'Store Owner Alexander Hamilton', // 30 characters (valid 20-60)
      email: 'owner@example.com',
      password: ownerPassword,
      address: '10 Downing Street, Commercial Hub, London City',
      role: 'store_owner',
    });

    const user1 = await User.create({
      name: 'First Registered Normal Customer', // 32 characters (valid 20-60)
      email: 'user1@example.com',
      password: userPassword,
      address: '221B Baker Street, Marylebone, London City',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Second Registered Regular Client', // 32 characters (valid 20-60)
      email: 'user2@example.com',
      password: userPassword,
      address: '404 Elm Street, Downtown District, Metropolis',
      role: 'user',
    });

    // 2. Create Stores
    console.log('[Seed] Creating demo stores...');
    const store1 = await Store.create({
      name: 'Downtown Tech Gadgets & Accessories',
      email: 'contact@downtowntech.com',
      address: '123 Innovation Boulevard, Suite 400, Metro City',
      ownerId: owner.id, // Assigned to Alexander Hamilton
    });

    const store2 = await Store.create({
      name: 'Artisan Coffee Roasters & Bakery',
      email: 'hello@artisancoffee.com',
      address: '456 Heritage Lane, Old Town Square, Metro City',
      ownerId: null,
    });

    const store3 = await Store.create({
      name: 'Green Leaf Organic Grocery Mart',
      email: 'support@greenleafmart.com',
      address: '789 Evergreen Terrace, Greenfield District, Metro City',
      ownerId: null,
    });

    const store4 = await Store.create({
      name: 'Summit Sports & Outdoor Equipments',
      email: 'sales@summitsports.com',
      address: '101 Mountain View Road, Alpine Ridge, Metro City',
      ownerId: null,
    });

    // 3. Create Ratings
    console.log('[Seed] Creating demo ratings...');
    await Rating.create({
      userId: user1.id,
      storeId: store1.id,
      rating: 5,
    });

    await Rating.create({
      userId: user2.id,
      storeId: store1.id,
      rating: 4,
    });

    await Rating.create({
      userId: user1.id,
      storeId: store2.id,
      rating: 4,
    });

    await Rating.create({
      userId: user2.id,
      storeId: store2.id,
      rating: 5,
    });

    await Rating.create({
      userId: user1.id,
      storeId: store3.id,
      rating: 3,
    });

    console.log('[Seed] Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('  Admin User:   admin@example.com / Admin@1234');
    console.log('  Store Owner:  owner@example.com / Owner@1234');
    console.log('  Normal User:  user1@example.com / User@1234');
    console.log('  Normal User:  user2@example.com / User@1234');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

module.exports = seedDatabase;
