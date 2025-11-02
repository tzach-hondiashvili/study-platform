import { api } from './api';

export const questionService = {
  getAll: () => api.get('/api/questions'),
  add: ({ text, answers, createdBy }) =>
    api.post('/api/questions/add', { text, answers, createdBy }),
  delete: (id) => api.delete(`/api/questions/${id}`),
  update: (id, { text, answers }) =>
    api.put(`/api/questions/${id}`, { text, answers }),
};

