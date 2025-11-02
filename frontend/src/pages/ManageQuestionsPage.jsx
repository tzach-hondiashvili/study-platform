import React, { useState, useEffect } from 'react';
import { questionService } from '../services/questionService';

export default function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ text: '', answers: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await questionService.getAll();
      setQuestions(data);
    } catch (err) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await questionService.delete(id);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      alert('Failed to delete question: ' + err.message);
    }
  };

  const startEdit = (question) => {
    setEditingId(question.id);
    setEditForm({
      text: question.text,
      answers: question.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ text: '', answers: [] });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await questionService.update(editingId, editForm);
      // Immediately update the local state to reflect changes
      setQuestions(prev => prev.map(q =>
        q.id === editingId
          ? { ...q, text: editForm.text, answers: editForm.answers.map((a, i) => ({
              id: q.answers[i]?.id || i,
              text: a.text,
              isCorrect: a.isCorrect
            }))}
          : q
      ));
      cancelEdit();
    } catch (err) {
      alert('Failed to update question: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateEditAnswer = (index, field, value) => {
    setEditForm(prev => ({
      ...prev,
      answers: prev.answers.map((a, i) =>
        i === index
          ? { ...a, [field]: field === 'isCorrect' ? value : a.isCorrect, text: field === 'text' ? value : a.text }
          : { ...a, isCorrect: field === 'isCorrect' && value ? false : a.isCorrect }
      )
    }));
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

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="text-center mb-4">
          <h1>🗂️ Manage Questions</h1>
          <p>Edit or delete existing questions</p>
        </div>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {questions.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3>No questions yet</h3>
              <p>Add your first question to get started!</p>
              <button onClick={() => window.location.href = '/add'} className="btn mt-3">
                ➕ Add Question
              </button>
            </div>
          </div>
        ) : (
          <div>
            {questions.map((question) => (
              <div key={question.id} className="card mb-4">
                {editingId === question.id ? (
                  <form onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <label><strong>Question Text</strong></label>
                      <textarea
                        value={editForm.text}
                        onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label><strong>Answers</strong></label>
                      {editForm.answers.map((ans, idx) => (
                        <div key={idx} className="answer-input-group">
                          <input
                            type="radio"
                            name="correct-edit"
                            checked={ans.isCorrect}
                            onChange={() => updateEditAnswer(idx, 'isCorrect', true)}
                          />
                          <input
                            type="text"
                            value={ans.text}
                            onChange={(e) => updateEditAnswer(idx, 'text', e.target.value)}
                            placeholder={`Answer ${String.fromCharCode(65 + idx)}`}
                            required
                          />
                          {ans.isCorrect && (
                            <span style={{ color: 'var(--success-color)', fontSize: '1.25rem' }}>✓</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-success" disabled={submitting}>
                        {submitting ? '💾 Saving...' : '💾 Save Changes'}
                      </button>
                      <button type="button" onClick={cancelEdit} className="btn btn-secondary" disabled={submitting}>
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 style={{ marginBottom: '1rem' }}>{question.text}</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                      {question.answers.map((ans, idx) => (
                        <div
                          key={ans.id}
                          style={{
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            background: ans.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                            borderRadius: '0.5rem',
                            border: ans.isCorrect ? '2px solid var(--success-color)' : '1px solid var(--border-color)'
                          }}
                        >
                          <strong>{String.fromCharCode(65 + idx)}.</strong> {ans.text}
                          {ans.isCorrect && <span style={{ color: 'var(--success-color)', marginLeft: '0.5rem' }}>✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => startEdit(question)} className="btn btn-secondary">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(question.id)} className="btn btn-danger">
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

