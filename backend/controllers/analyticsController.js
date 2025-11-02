const { UserAttempt, Question, Answer } = require('../models');
const calculateScore = require('../utils/calculateScore');
const generateReport = require('../utils/generateReport');

// GET /api/analytics/summary/:userId
exports.getSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const attempts = await UserAttempt.findAll({ where: { userId } });
    const summary = calculateScore(attempts);
    res.json(summary);
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/report/:userId
exports.getDetailedReport = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const attempts = await UserAttempt.findAll({
      where: { userId },
      include: [
        { model: Question, as: 'question', attributes: ['id', 'text'] },
        { model: Answer, as: 'answer', attributes: ['id', 'text', 'isCorrect'] },
      ],
      order: [['attemptedAt', 'DESC']],
    });
    const report = generateReport(attempts);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/analytics/clear/:userId
exports.clearUserData = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deleted = await UserAttempt.destroy({ where: { userId } });
    res.json({
      message: 'Analytics data cleared successfully.',
      deletedCount: deleted
    });
  } catch (err) {
    next(err);
  }
};
