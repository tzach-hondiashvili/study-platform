import React from 'react';

export default function QuizQuestion({ question, answers, loading, submitting, result, error, onAnswer, onNext }) {
  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error" role="alert">
          ❌ {error}
        </div>
        <button onClick={onNext} className="btn w-full mt-3">
          Try Again
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="card">
        <div className="empty-state">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <h3>No questions available</h3>
          <p>Add some questions to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-question">
      <div className="card-header">
        <h2>{question.text}</h2>
      </div>

      <div className="answers">
        {answers.map((a, index) => (
          <button
            key={a.id}
            onClick={() => onAnswer(a.id)}
            disabled={!!result || submitting}
            className="answer-btn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>
              <strong>{String.fromCharCode(65 + index)}.</strong> {a.text}
            </span>
          </button>
        ))}
      </div>

      {result && (
        <div className={`result ${result.correct ? 'correct' : 'incorrect'}`}>
          {result.correct ? (
            <>
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>✓</span>
              Correct! Well done! 🎉
            </>
          ) : (
            <>
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>✗</span>
              Incorrect. Keep practicing! 💪
            </>
          )}
        </div>
      )}

      <div className="actions">
        <button
          onClick={onNext}
          disabled={loading || submitting}
          className={result ? 'btn btn-success' : 'btn btn-secondary'}
        >
          {result ? '➡️ Next Question' : '⏭️ Skip Question'}
        </button>
      </div>
    </div>
  );
}

