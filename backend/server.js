const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const questionRoutes = require('./routes/questionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/questions', questionRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/', (req, res) => res.send('Study Platform API running'));

// Error handling middleware (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    // For development convenience; consider using migrations for production
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
