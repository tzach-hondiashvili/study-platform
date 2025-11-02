const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Question = require('./Question');

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Question,
      key: 'id',
    },
    allowNull: false,
  },
});

module.exports = Answer;

