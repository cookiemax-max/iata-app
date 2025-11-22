// src/hooks/useReports.js
import { useState, useCallback } from 'react';
import {
  fetchReports,
  fetchReportById,
  createReport,
  updateReport,
  deleteReport,
  fetchReportStats,
  // If you added it:
  // summarizeReport,
} from '../api/reportApi';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all reports (supports pagination & search)
  const loadReports = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchReports(params);
      setReports(data.reports);
      // Optionally manage paging: data.total, data.page, data.pages
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single report by ID (with details)
  const loadReportById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchReportById(id);
      setReport(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create report
  const addReport = useCallback(async (reportData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await createReport(reportData);
      setReports(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update report
  const modifyReport = useCallback(async (id, reportData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await updateReport(id, reportData);
      setReports(prev =>
        prev.map(r => (r._id === data._id ? data : r))
      );
      setReport(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete report
  const removeReport = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteReport(id);
      setReports(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch report dashboard stats
  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchReportStats();
      setStats(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reports,
    report,
    stats,
    loading,
    error,
    loadReports,
    loadReportById,
    addReport,
    modifyReport,
    removeReport,
    loadStats,
    setError, // Expose if you want to manually clear errors
  };
}
