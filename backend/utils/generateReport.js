// Build a detailed analytics report from an array of attempts
module.exports = function generateReport(attempts = []) {
  const byQuestion = new Map();

  for (const a of attempts) {
    const qId = a.questionId;
    const entry = byQuestion.get(qId) || {
      questionId: qId,
      questionText: a.question?.text || '',
      attempts: 0,
      correct: 0,
      lastAttemptedAt: null,
      lastAnswer: a.answer ? { id: a.answer.id, text: a.answer.text, isCorrect: a.answer.isCorrect } : null,
      mistakes: {},
    };
    entry.attempts += 1;
    if (a.isCorrect) entry.correct += 1;
    if (!entry.lastAttemptedAt || new Date(a.attemptedAt) > new Date(entry.lastAttemptedAt)) {
      entry.lastAttemptedAt = a.attemptedAt;
      entry.lastAnswer = a.answer ? { id: a.answer.id, text: a.answer.text, isCorrect: a.answer.isCorrect } : entry.lastAnswer;
    }
    if (a.answer && !a.isCorrect) {
      entry.mistakes[a.answer.text] = (entry.mistakes[a.answer.text] || 0) + 1;
    }
    byQuestion.set(qId, entry);
  }

  const questions = Array.from(byQuestion.values()).map((q) => ({
    ...q,
    accuracy: q.attempts ? q.correct / q.attempts : 0,
    topMistakes: Object.entries(q.mistakes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([text, count]) => ({ text, count })),
  }));

  // Overall stats
  const total = attempts.length;
  const correct = attempts.filter((a) => a.isCorrect).length;
  const incorrect = total - correct;
  const accuracy = total ? correct / total : 0;

  return {
    total,
    correct,
    incorrect,
    accuracy,
    questions,
  };
};

