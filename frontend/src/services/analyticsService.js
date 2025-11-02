import { api } from './api';

export const analyticsService = {
  getSummary: (userId) => api.get(`/api/analytics/summary/${userId}`),
  getReport: (userId) => api.get(`/api/analytics/report/${userId}`),
  clearData: (userId) => api.delete(`/api/analytics/clear/${userId}`),
};

