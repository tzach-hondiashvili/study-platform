import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../services/questionService';

export default function HomePage() {
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const questions = await questionService.getAll();
        setQuestionCount(questions.length);
      } catch (err) {
        console.error('Failed to load question count:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCount();
  }, []);

  return (
    <div className="hero">
      <h1>🎓 Study Platform</h1>
      <p>
        Master your knowledge with interactive multiple-choice questions.
        Track your progress, learn from mistakes, and become an expert!
      </p>
      <div className="hero-buttons">
        <Link to="/quiz" className="btn btn-primary">
          🚀 Start Quiz
        </Link>
        <Link to="/add" className="btn btn-secondary">
          ➕ Add Question
        </Link>
        <Link to="/analytics" className="btn btn-secondary">
          📊 View Analytics
        </Link>
      </div>

      <div className="stats mt-4">
        <div className="stat-card">
          <span className="stat-value">{loading ? '...' : questionCount}</span>
          <span className="stat-label">Questions Available</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">4</span>
          <span className="stat-label">Options Each</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">100%</span>
          <span className="stat-label">Your Potential</span>
        </div>
      </div>

      <div className="card mt-4" style={{ textAlign: 'left', maxWidth: '600px', margin: '3rem auto' }}>
        <h3>✨ Features</h3>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: '2' }}>
          <li>🔀 Randomized answer positions to prevent memorization</li>
          <li>📈 Detailed analytics and performance tracking</li>
          <li>🎯 Learn from your mistakes with comprehensive reports</li>
          <li>💡 Add your own questions to the pool</li>
          <li>🚫 No login required - start practicing immediately</li>
        </ul>
      </div>
    </div>
  );
}

