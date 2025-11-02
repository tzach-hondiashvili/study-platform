// Centralize model initialization and associations
const sequelize = require('../config/database');
const Question = require('./Question');
const Answer = require('./Answer');
const UserAttempt = require('./UserAttempt');
// Optional: if a User model is later added
let User;
try {
  // eslint-disable-next-line global-require
  User = require('./User');
} catch (_) {
  User = null;
}

// Associations
Question.hasMany(Answer, {
  foreignKey: 'questionId',
  as: 'answers',
  onDelete: 'CASCADE',
});
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// Attempts associations
UserAttempt.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
UserAttempt.belongsTo(Answer, { foreignKey: 'answerId', as: 'answer' });
if (User) {
  UserAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}

module.exports = {
  sequelize,
  Question,
  Answer,
  UserAttempt,
  ...(User ? { User } : {}),
};

