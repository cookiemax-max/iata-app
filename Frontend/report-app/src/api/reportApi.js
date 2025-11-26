// src/api/reportApi.js
import axios from 'axios';

// Ensures correct backend target in Docker/production
const BASEURL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Fetch reports with (optional) pagination and search.
 * Returns: { reports: [], ... }
 */
export const fetchReports = ({ page = 1, search = '' } = {}) =>
  axios.get(`${BASEURL}/api/reports?page=${page}&search=${encodeURIComponent(search)}`);

/**
 * Fetch a single report by ID.
 * Returns: { report: { ... } }
 */
export const fetchReportById = (id) =>
  axios.get(`${BASEURL}/api/reports/${id}`);

/**
 * Fetch dashboard statistics (if used).
 */
export const fetchReportStats = () =>
  axios.get(`${BASEURL}/api/reports/stats`);

/**
 * Create a new report (POST).
 */
export const createReport = (reportData) =>
  axios.post(`${BASEURL}/api/reports`, reportData);

/**
 * Update a report by ID (PUT).
 */
export const updateReport = (id, reportData) =>
  axios.put(`${BASEURL}/api/reports/${id}`, reportData);

/**
 * Delete a report by ID (DELETE).
 */
export const deleteReport = (id) =>
  axios.delete(`${BASEURL}/api/reports/${id}`);

/**
 * (Optional) Refetch a report after summarizing to sync the UI.
 * Returns: { report: { ... } }
 */
export const refetchReportAfterSummarize = (id) =>
  fetchReportById(id);
