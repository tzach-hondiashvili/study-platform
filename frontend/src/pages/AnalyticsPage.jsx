import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { analyticsService } from '../services/analyticsService';

export default function AnalyticsPage({ userId = 0 }) {
  // Auto-refresh every 5 seconds to show real-time updates
  const { summary, report, loading, error, reload } = useAnalytics(userId, 5000);
  const [clearing, setClearing] = useState(false);

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all your analytics data? This action cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      await analyticsService.clearData(userId);
      reload(); // Refresh the page data
    } catch (err) {
      alert('Failed to clear data: ' + err.message);
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card">
            <div className="alert alert-error" role="alert">
              ❌ {error}
            </div>
            <button onClick={reload} className="btn mt-3">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary || summary.total === 0) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center mb-4">
            <h1>📊 Analytics</h1>
            <p>Track your learning progress and identify areas for improvement</p>
          </div>
          <div className="card">
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📈</div>
              <h3>No data yet</h3>
              <p>Start taking quizzes to see your analytics here!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-4">
          <h1>📊 Analytics Dashboard</h1>
          <p>Your learning insights and performance metrics</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              color: 'var(--success-color)'
            }}>
              <span style={{
                width: '8px',
              height: '8px',
              background: 'var(--success-color)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}></span>
            Live Updates
          </div>
          <button
            onClick={handleClearData}
            className="btn btn-danger"
            disabled={clearing}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            {clearing ? '🔄 Clearing...' : '🔄 Restart (Clear Data)'}
          </button>
          </div>
        </div>

        <div className="analytics-section">
          <h2>📈 Overall Performance</h2>
          <div className="stats">
            <div className="stat-card">
              <span className="stat-value">{summary.total}</span>
              <span className="stat-label">Total Attempts</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{
                background: 'linear-gradient(135deg, var(--success-color) 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {summary.correct}
              </span>
              <span className="stat-label">Correct Answers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value" style={{
                background: 'linear-gradient(135deg, var(--error-color) 0%, #dc2626 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {summary.incorrect}
              </span>
              <span className="stat-label">Incorrect Answers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{(summary.accuracy * 100).toFixed(1)}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            {summary.longestStreak !== undefined && (
              <div className="stat-card">
                <span className="stat-value">🔥 {summary.longestStreak}</span>
                <span className="stat-label">Best Streak</span>
              </div>
            )}
          </div>

          <div className="progress-bar" style={{ marginTop: '1.5rem' }}>
            <div
              className="progress-fill"
              style={{ width: `${(summary.accuracy * 100).toFixed(1)}%` }}
            ></div>
          </div>
        </div>

        {report && report.questions && report.questions.length > 0 && (
          <div className="analytics-section mt-4">
            <h2>📝 Question-by-Question Breakdown</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Detailed analysis of your performance on each question
            </p>
            <ul className="question-list">
              {report.questions.map((q) => (
                <li key={q.questionId} className="question-item">
                  <strong>{q.questionText || `Question #${q.questionId}`}</strong>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    <span>
                      📊 <strong>{q.attempts}</strong> attempts
                    </span>
                    <span>
                      ✓ <strong>{q.correct}</strong> correct
                    </span>
                    <span style={{
                      color: q.accuracy >= 0.7 ? 'var(--success-color)' :
                             q.accuracy >= 0.5 ? 'var(--warning-color)' :
                             'var(--error-color)'
                    }}>
                      🎯 <strong>{(q.accuracy * 100).toFixed(1)}%</strong> accuracy
                    </span>
                  </div>

                  {q.topMistakes && q.topMistakes.length > 0 && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '0.5rem',
                      borderLeft: '3px solid var(--error-color)'
                    }}>
                      <strong style={{ color: 'var(--error-color)' }}>⚠️ Common Mistakes:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {q.topMistakes.map((m, idx) => (
                          <div key={idx} style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            marginTop: '0.25rem'
                          }}>
                            • {m.text} <span style={{ color: 'var(--text-muted)' }}>({m.count}x)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="progress-bar" style={{ marginTop: '0.75rem', height: '6px' }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${(q.accuracy * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

