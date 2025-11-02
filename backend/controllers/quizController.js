const Question = require('../models/Question');
const Answer = require('../models/Answer');
const UserAttempt = require('../models/UserAttempt');
const shuffleAnswers = require('../utils/shuffleAnswers');

// Get a random question with shuffled answers
exports.getQuizQuestion = async (req, res) => {
  try {
    const excludeIds = req.query.exclude ? req.query.exclude.split(',').map(Number) : [];

    const count = await Question.count();
    if (!count) return res.status(404).json({ message: 'No questions found.' });

    // If all questions have been asked, signal completion
    if (excludeIds.length >= count) {
      return res.json({
        allCompleted: true,
        totalQuestions: count,
        message: 'You have completed all questions!'
      });
    }

    // Get all questions except the excluded ones
    const { Op } = require('sequelize');
    const whereClause = excludeIds.length > 0 ? { id: { [Op.notIn]: excludeIds } } : {};

    const availableQuestions = await Question.findAll({ where: whereClause });
    if (!availableQuestions.length) {
      return res.json({
        allCompleted: true,
        totalQuestions: count,
        message: 'No more questions available.'
      });
    }

    // Pick a random question from available ones
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];

    const answers = await Answer.findAll({ where: { questionId: question.id } });
    // Only send minimal answer fields to the client
    const minimalAnswers = answers.map((a) => ({ id: a.id, text: a.text }));
    const shuffled = shuffleAnswers(minimalAnswers);
    res.json({
      question,
      answers: shuffled,
      totalQuestions: count,
      questionsRemaining: count - excludeIds.length - 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit an answer and record the attempt
exports.submitAnswer = async (req, res) => {
  try {
    const { userId, questionId, answerId } = req.body;
    if (!questionId || !answerId) {
      return res.status(400).json({ message: 'questionId and answerId are required.' });
    }

    // Find the answer and check if it's correct
    const answer = await Answer.findByPk(answerId);
    if (!answer || answer.questionId !== questionId) {
      return res.status(400).json({ message: 'Invalid answer for this question.' });
    }

    const isCorrect = answer.isCorrect;

    // Record the attempt
    await UserAttempt.create({
      userId: userId || 0,
      questionId,
      answerId,
      isCorrect,
    });

    res.json({ correct: isCorrect });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
