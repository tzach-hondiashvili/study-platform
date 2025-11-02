const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAttempt = sequelize.define('UserAttempt', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  attemptedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserAttempt;
