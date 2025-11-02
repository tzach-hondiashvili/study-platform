const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Get a random quiz question
router.get('/question', quizController.getQuizQuestion);

// Submit an answer
router.post('/answer', quizController.submitAnswer);

module.exports = router;
