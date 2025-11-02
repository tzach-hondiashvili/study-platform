const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Get all questions
router.get('/', questionController.getAllQuestions);

// Add a new question
router.post('/add', questionController.addQuestion);

// Delete a question
router.delete('/:id', questionController.deleteQuestion);

// Update a question
router.put('/:id', questionController.updateQuestion);

module.exports = router;

