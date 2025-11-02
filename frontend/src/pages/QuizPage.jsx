import React, { useEffect, useState } from 'react';
import QuizQuestion from '../components/quiz/QuizQuestion';
import { useQuiz } from '../hooks/useQuiz';
import { useAnalytics } from '../hooks/useAnalytics';

export default function QuizPage() {
  const { question, answers, loading, submitting, error, result, loadQuestion, submitAnswer, nextQuestion, stats, isComplete, resetQuiz } = useQuiz({ userId: 0 });
  const { summary, report, loading: analyticsLoading } = useAnalytics(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  useEffect(() => {
    if (isComplete) {
      setShowAnalytics(true);
    }
  }, [isComplete]);

  const accuracy = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;

  const handleTryAgain = () => {
    setShowAnalytics(false);
    resetQuiz();
  };

  // Show completion screen with analytics
  if (showAnalytics && isComplete) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="text-center mb-4">
            <h1>🎉 Quiz Complete!</h1>
            <p>Great job! Review your performance below</p>
          </div>

          {/* Session Stats */}
          <div className="card mb-4" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>📊 Your Session Results</h2>
            <div className="stats">
              <div className="stat-card">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Questions Answered</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" style={{ color: 'var(--success-color)' }}>{stats.correct}</span>
                <span className="stat-label">Correct Answers</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" style={{ color: 'var(--error-color)' }}>{stats.total - stats.correct}</span>
                <span className="stat-label">Incorrect Answers</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{accuracy}%</span>
                <span className="stat-label">Session Accuracy</span>
              </div>
            </div>
            <div className="progress-bar" style={{ marginTop: '1.5rem' }}>
              <div className="progress-fill" style={{ width: `${accuracy}%` }}></div>
            </div>
          </div>

          {/* Overall Analytics */}
          {!analyticsLoading && summary && (
            <div className="card mb-4">
              <h2 style={{ marginBottom: '1.5rem' }}>📈 Overall Performance</h2>
              <div className="stats">
                <div className="stat-card">
                  <span className="stat-value">{summary.total}</span>
                  <span className="stat-label">Total Attempts</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value" style={{ color: 'var(--success-color)' }}>{summary.correct}</span>
                  <span className="stat-label">Total Correct</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{(summary.accuracy * 100).toFixed(1)}%</span>
                  <span className="stat-label">Overall Accuracy</span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Report */}
          {!analyticsLoading && report && report.questions && report.questions.length > 0 && (
            <div className="card mb-4">
              <h2 style={{ marginBottom: '1.5rem' }}>📝 Learn From Your Mistakes</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Review the questions you struggled with to improve your understanding
              </p>
              <ul className="question-list">
                {report.questions
                  .filter(q => q.accuracy < 1) // Show only questions with mistakes
                  .map((q) => (
                    <li key={q.questionId} className="question-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <strong style={{ flex: 1 }}>{q.questionText || `Question #${q.questionId}`}</strong>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          background: q.accuracy >= 0.7 ? 'rgba(16, 185, 129, 0.15)' :
                                     q.accuracy >= 0.5 ? 'rgba(245, 158, 11, 0.15)' :
                                     'rgba(239, 68, 68, 0.15)',
                          color: q.accuracy >= 0.7 ? 'var(--success-color)' :
                                 q.accuracy >= 0.5 ? 'var(--warning-color)' :
                                 'var(--error-color)'
                        }}>
                          {(q.accuracy * 100).toFixed(0)}% accuracy
                        </span>
                      </div>
                      <div style={{ marginTop: '0.75rem', fontSize: '0.95rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Answered {q.attempts} time{q.attempts !== 1 ? 's' : ''} •
                          Got {q.correct} correct •
                          Made {q.attempts - q.correct} mistake{q.attempts - q.correct !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
              {report.questions.filter(q => q.accuracy < 1).length === 0 && (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                  <h3>Perfect Score!</h3>
                  <p>You answered all questions correctly. Excellent work!</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handleTryAgain} className="btn btn-success">
              🔄 Try Again
            </button>
            <button
              onClick={() => window.location.href = '/analytics'}
              className="btn btn-secondary"
            >
              📊 View Full Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-4">
          <h1>📝 Practice Quiz</h1>
          <p>Test your knowledge and track your progress</p>
        </div>

        <QuizQuestion
          question={question}
          answers={answers}
          loading={loading}
          submitting={submitting}
          result={result}
          error={error}
          onAnswer={submitAnswer}
          onNext={nextQuestion}
        />

        <div className="stats mt-4">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Questions Answered</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.correct}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>

        {stats.total > 0 && (
          <div className="progress-bar mt-4">
            <div
              className="progress-fill"
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

