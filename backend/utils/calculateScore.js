// Compute basic score statistics from a list of attempts
module.exports = function calculateScore(attempts = []) {
  const total = attempts.length;
  const correct = attempts.filter((a) => !!a.isCorrect).length;
  const incorrect = total - correct;
  const accuracy = total ? correct / total : 0;

  // Calculate current and longest correct streaks based on attemptedAt order (assumed DESC in consumers)
  let currentStreak = 0;
  let longestStreak = 0;
  // Sort ascending by attemptedAt for streak calculation
  const ordered = [...attempts].sort((a, b) => new Date(a.attemptedAt) - new Date(b.attemptedAt));
  for (const at of ordered) {
    if (at.isCorrect) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return { total, correct, incorrect, accuracy, longestStreak };
};

