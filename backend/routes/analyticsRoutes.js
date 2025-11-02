const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Summary stats for a user
router.get('/summary/:userId', analyticsController.getSummary);

// Detailed report for a user
router.get('/report/:userId', analyticsController.getDetailedReport);

// Clear analytics data for a user
router.delete('/clear/:userId', analyticsController.clearUserData);

module.exports = router;

