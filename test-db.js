const { Sequelize, DataTypes } = require('sequelize');

// Connect to your SQLite DB
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});

// Define a test model (matches your User table)
const User = sequelize.define('User', {
  email: DataTypes.STRING,
  zoom_id: DataTypes.STRING,
  device_id: DataTypes.STRING,
  is_premium: DataTypes.BOOLEAN
});

// Run test
async function testDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection established successfully.');

    await User.sync(); // creates table if not exists
    console.log('✅ User model synced.');

    // Add dummy user
    await User.create({
      email: 'test@example.com',
      zoom_id: 'zoom_123',
      device_id: 'device_abc',
      is_premium: true
    });

    console.log('✅ Dummy user added.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

testDB();
