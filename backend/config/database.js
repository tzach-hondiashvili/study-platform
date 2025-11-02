// Initialize and export a Sequelize instance
const { Sequelize } = require('sequelize');
const config = require('./config');
const path = require('path');

// Use SQLite for development if MySQL is not available
let sequelize;

if (config.db.dialect === 'sqlite' || !config.db.host) {
  // SQLite configuration (no server needed)
  const dbPath = path.join(__dirname, '..', 'database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: config.db.logging,
  });
  console.log('Using SQLite database at:', dbPath);
} else {
  // MySQL configuration
  sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.pass,
    {
      host: config.db.host,
      port: config.db.port,
      dialect: config.db.dialect,
      logging: config.db.logging,
    }
  );
}

module.exports = sequelize;

