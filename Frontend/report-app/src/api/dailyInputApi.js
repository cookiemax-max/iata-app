// src/api/dailyInputApi.js
import axios from 'axios';

// Ensures correct backend target in Docker/production
const BASEURL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Create a new daily input for a report.
 * @param {Object} data - Must include { reportId, date, input, ... }
 * @returns {Promise} Axios POST response
 */
export const createDailyInput = (data) =>
  axios.post(`${BASEURL}/api/daily-inputs`, data);

/**
 * Fetches all daily inputs for a given report.
 * @param {string} reportId
 * @returns {Promise} Axios GET response with array of inputs
 */
export const fetchInputsByReport = (reportId) =>
  axios.get(`${BASEURL}/api/daily-inputs/${reportId}`);
