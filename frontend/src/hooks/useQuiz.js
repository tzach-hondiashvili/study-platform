import { useState, useCallback, useRef } from 'react';
import { quizService } from '../services/quizService';

export function useQuiz({ userId, onAnswerSubmitted }) {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ total: 0, correct: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const askedQuestionIds = useRef([]);
  const totalQuestions = useRef(null);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await quizService.getQuestion(askedQuestionIds.current);

      // Check if we got the total count from backend
      if (data.totalQuestions !== undefined) {
        totalQuestions.current = data.totalQuestions;
      }

      // Check if all questions completed
      if (data.allCompleted || (totalQuestions.current && askedQuestionIds.current.length >= totalQuestions.current)) {
        setIsComplete(true);
        setLoading(false);
        return;
      }

      setQuestion(data.question);
      setAnswers(data.answers);
      // Track this question as asked ONLY if it's not already tracked
      if (!askedQuestionIds.current.includes(data.question.id)) {
        askedQuestionIds.current.push(data.question.id);
      }
    } catch (err) {
      // Check if the error is about no more questions
      if (err.message.includes('No more questions') || err.message.includes('No questions found')) {
        setIsComplete(true);
      } else {
        setError(err.message || 'Failed to load question');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (answerId) => {
      if (!question) return;
      setSubmitting(true);
      setError(null);
      try {
        const data = await quizService.submitAnswer({
          userId,
          questionId: question.id,
          answerId,
        });
        setResult(data);
        setStats((prev) => ({
          total: prev.total + 1,
          correct: prev.correct + (data.correct ? 1 : 0),
        }));

        // Trigger analytics update callback if provided
        if (onAnswerSubmitted) {
          onAnswerSubmitted();
        }
      } catch (err) {
        setError(err.message || 'Failed to submit answer');
      } finally {
        setSubmitting(false);
      }
    },
    [userId, question, onAnswerSubmitted]
  );

  const nextQuestion = useCallback(() => {
    loadQuestion();
  }, [loadQuestion]);

  const resetQuiz = useCallback(() => {
    askedQuestionIds.current = [];
    setIsComplete(false);
    setStats({ total: 0, correct: 0 });
    setResult(null);
    setError(null);
    loadQuestion();
  }, [loadQuestion]);

  return {
    question,
    answers,
    loading,
    submitting,
    error,
    result,
    stats,
    isComplete,
    loadQuestion,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  };
}

