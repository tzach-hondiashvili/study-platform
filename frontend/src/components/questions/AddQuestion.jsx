import React, { useState } from 'react';
import { questionService } from '../../services/questionService';

export default function AddQuestion() {
  const [text, setText] = useState('');
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleAnswerChange = (idx, value) => {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? { ...a, text: value } : a)));
  };

  const handleCorrectChange = (idx) => {
    setAnswers((prev) => prev.map((a, i) => ({ ...a, isCorrect: i === idx })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      if (!text.trim() || answers.some((a) => !a.text.trim())) {
        throw new Error('Please fill question and all answers.');
      }
      if (!answers.some((a) => a.isCorrect)) {
        throw new Error('Please select the correct answer.');
      }
      await questionService.add({ text, answers, createdBy: 0 });
      setMessage('Question added successfully.');
      setText('');
      setAnswers([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } catch (e) {
      setError(e.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <h1>➕ Add Question</h1>
          <p>Contribute to the question pool and help others learn</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="question-text">
                <strong>Question Text</strong>
              </label>
              <textarea
                id="question-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder="Enter your question here..."
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Answers</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                  (Select the correct answer)
                </span>
              </label>
              {answers.map((a, idx) => (
                <div key={idx} className="answer-input-group">
                  <input
                    type="radio"
                    name="correct"
                    checked={a.isCorrect}
                    onChange={() => handleCorrectChange(idx)}
                    aria-label={`Mark answer ${idx + 1} as correct`}
                  />
                  <input
                    type="text"
                    value={a.text}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder={`Answer ${String.fromCharCode(65 + idx)}`}
                  />
                  {a.isCorrect && (
                    <span style={{ color: 'var(--success-color)', fontSize: '1.25rem' }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" disabled={submitting} className="btn w-full">
              {submitting ? '💾 Saving...' : '💾 Save Question'}
            </button>
          </form>

          {message && (
            <div className="alert alert-success mt-3">
              ✓ {message}
            </div>
          )}
          {error && (
            <div className="alert alert-error mt-3">
              ✗ {error}
            </div>
          )}
        </div>

        <div className="card mt-4">
          <h3>💡 Tips for Creating Good Questions</h3>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.5rem' }}>
            <li>Make questions clear and unambiguous</li>
            <li>Ensure only one answer is definitively correct</li>
            <li>Create plausible wrong answers to challenge learners</li>
            <li>Avoid trick questions or overly complex wording</li>
            <li>Test important concepts, not trivial details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

