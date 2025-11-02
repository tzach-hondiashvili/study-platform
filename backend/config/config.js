// Basic app configuration pulled from environment variables
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || null, // Set to null to use SQLite by default
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME || 'study_platform',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || '',
    dialect: process.env.DB_DIALECT || 'sqlite', // Use SQLite by default
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  },
};

