import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export function useAnalytics(userId, autoRefreshInterval = null) {
  const [summary, setSummary] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [summaryData, reportData] = await Promise.all([
        analyticsService.getSummary(userId),
        analyticsService.getReport(userId),
      ]);
      setSummary(summaryData);
      setReport(reportData);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-refresh if interval is provided
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const intervalId = setInterval(() => {
      fetchAnalytics(false); // Don't show loading spinner on auto-refresh
    }, autoRefreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefreshInterval, fetchAnalytics]);

  const reload = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    summary,
    report,
    loading,
    error,
    reload,
  };
}

