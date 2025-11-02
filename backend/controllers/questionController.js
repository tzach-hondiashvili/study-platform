const Question = require('../models/Question');
const Answer = require('../models/Answer');
const UserAttempt = require('../models/UserAttempt');

// Get all questions with their answers
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [{ model: Answer, as: 'answers' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new question with answers
exports.addQuestion = async (req, res) => {
  try {
    const { text, answers, createdBy } = req.body;
    // answers: [{ text: string, isCorrect: boolean }]
    if (!text || !answers || answers.length !== 4 || !answers.some(a => a.isCorrect)) {
      return res.status(400).json({ message: 'Provide question text and 4 answers, one marked as correct.' });
    }
    const question = await Question.create({ text, createdBy });
    for (const ans of answers) {
      await Answer.create({ text: ans.text, isCorrect: !!ans.isCorrect, questionId: question.id });
    }
    res.status(201).json({ message: 'Question added successfully.', questionId: question.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a question and its answers
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    // Delete in order due to foreign key constraints:
    // 1. Delete user attempts for this question
    await UserAttempt.destroy({ where: { questionId: id } });

    // 2. Delete associated answers
    await Answer.destroy({ where: { questionId: id } });

    // 3. Delete the question
    await question.destroy();

    res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a question and its answers
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, answers } = req.body;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    if (!text || !answers || answers.length !== 4 || !answers.some(a => a.isCorrect)) {
      return res.status(400).json({ message: 'Provide question text and 4 answers, one marked as correct.' });
    }

    // Update question text
    await question.update({ text });

    // Delete user attempts related to old answers (since answers are changing)
    await UserAttempt.destroy({ where: { questionId: id } });

    // Delete old answers
    await Answer.destroy({ where: { questionId: id } });

    // Create new answers
    for (const ans of answers) {
      await Answer.create({ text: ans.text, isCorrect: !!ans.isCorrect, questionId: id });
    }

    res.json({ message: 'Question updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

