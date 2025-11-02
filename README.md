# 🎓 Study Platform

A modern, full-stack quiz application built with React and Node.js. Practice with multiple-choice questions, track your progress with detailed analytics, and manage your question bank with an intuitive interface.

![Study Platform](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🎯 Quiz System
- **Random Question Selection** - Each quiz session presents unique questions
- **No Duplicates** - Questions appear only once per session until all are answered
- **Shuffled Answers** - Answer positions randomized to prevent memorization
- **Real-time Feedback** - Instant validation when you submit an answer
- **Progress Tracking** - See your accuracy and correct answers as you go

### 📊 Analytics Dashboard
- **Live Updates** - Analytics refresh automatically every 5 seconds
- **Session Statistics** - Track your current quiz session performance
- **Overall Performance** - View your historical accuracy and progress
- **Detailed Reports** - Identify questions you struggle with
- **Mistake Analysis** - Learn from incorrect answers with breakdown by question
- **Restart Function** - Clear all analytics data to start fresh

### 🗂️ Question Management
- **Add Questions** - Create new multiple-choice questions with 4 options
- **Edit Questions** - Update question text and answers inline
- **Delete Questions** - Remove questions with cascade deletion
- **Immediate Updates** - Changes reflect instantly without page reload
- **View All Questions** - Browse your complete question bank

### 🎨 User Experience
- **Modern UI** - Clean, gradient-based design with smooth animations
- **Responsive** - Works on desktop, tablet, and mobile devices
- **Dark Theme** - Eye-friendly color scheme
- **Progress Indicators** - Visual bars show your accuracy
- **Completion Screen** - Comprehensive results after finishing all questions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/study-platform.git
cd study-platform
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Start the backend server** (Terminal 1)
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5001`

5. **Start the frontend** (Terminal 2)
```bash
cd frontend
npm start
```
The frontend will open at `http://localhost:3000`

## 📁 Project Structure

```
study_platform/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── server.js           # Express server
│   └── package.json
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── styles/         # CSS styles
│   │   └── App.jsx         # Main App component
│   └── package.json
└── database/               # SQL migrations and seeds
```

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - UI framework
- **React Router 6** - Navigation
- **CSS3** - Styling with gradients and animations
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM for database
- **SQLite** - Database (development)
- **CORS** - Cross-origin resource sharing

## 📖 Usage

### Taking a Quiz
1. Navigate to **Quiz** page
2. Answer questions by clicking on options
3. View immediate feedback (correct/incorrect)
4. Click "Next Question" to continue
5. After completing all questions, view your detailed results

### Managing Questions
1. Go to **Add Question** to create new questions
2. Fill in the question text and 4 answer options
3. Mark the correct answer with the radio button
4. Click **Manage** to edit or delete existing questions
5. Edit inline by clicking the Edit button
6. Changes save immediately

### Viewing Analytics
1. Click **Analytics** to see your performance
2. View overall statistics and accuracy
3. See detailed breakdown by question
4. Identify areas for improvement
5. Use **Restart** button to clear data and start fresh

## 🔧 Configuration

### Backend Configuration
Edit `/backend/config/config.js`:
```javascript
module.exports = {
  db: {
    dialect: 'sqlite',  // or 'mysql', 'postgres'
    storage: './database.sqlite',
    logging: false
  },
  server: {
    port: 5001
  }
};
```

### Frontend Configuration
Edit `/frontend/src/services/api.js`:
```javascript
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

## 🎯 API Endpoints

### Quiz
- `GET /api/quiz/question?exclude=1,2,3` - Get random question
- `POST /api/quiz/answer` - Submit answer

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions/add` - Add new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Analytics
- `GET /api/analytics/summary/:userId` - Get summary statistics
- `GET /api/analytics/report/:userId` - Get detailed report
- `DELETE /api/analytics/clear/:userId` - Clear user data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Create React App
- Icons from emoji set
- Inspired by modern quiz applications

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/study-platform](https://github.com/yourusername/study-platform)

---

Made with ❤️ and ☕

