import axios from 'axios';

const BASE_URL = '/api/reports';

/**
 * Fetch reports with (optional) pagination and search.
 * Returns: { reports: [], ... }
 */
export const fetchReports = ({ page = 1, search = '' } = {}) =>
  axios.get(`${BASE_URL}?page=${page}&search=${encodeURIComponent(search)}`);

/**
 * Fetch a single report by ID.
 * Returns: { report: { ... } }
 */
export const fetchReportById = (id) =>
  axios.get(`${BASE_URL}/${id}`);

/**
 * Fetch dashboard statistics (if used).
 */
export const fetchReportStats = () =>
  axios.get(`${BASE_URL}/stats`);

/**
 * Create a new report (POST).
 */
export const createReport = (reportData) =>
  axios.post(BASE_URL, reportData);

/**
 * Update a report by ID (PUT).
 */
export const updateReport = (id, reportData) =>
  axios.put(`${BASE_URL}/${id}`, reportData);

/**
 * Delete a report by ID (DELETE).
 */
export const deleteReport = (id) =>
  axios.delete(`${BASE_URL}/${id}`);

/**
 * (Optional) Refetch a report after summarizing to sync the UI.
 * Returns: { report: { ... } }
 */
export const refetchReportAfterSummarize = (id) =>
  fetchReportById(id);
