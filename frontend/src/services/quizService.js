import { api } from './api';

export const quizService = {
  getQuestion: (excludeIds = []) => {
    const query = excludeIds.length > 0 ? `?exclude=${excludeIds.join(',')}` : '';
    return api.get(`/api/quiz/question${query}`);
  },
  submitAnswer: ({ userId, questionId, answerId }) =>
    api.post('/api/quiz/answer', { userId, questionId, answerId }),
};

