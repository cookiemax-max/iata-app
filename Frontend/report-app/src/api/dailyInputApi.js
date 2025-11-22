// src/api/dailyInputApi.js
import axios from 'axios';

/**
 * Create a new daily input for a report.
 * @param {Object} data - Must include { reportId, date, input, ... }
 * @returns {Promise} Axios POST response
 */
export const createDailyInput = (data) =>
  axios.post('/api/daily-inputs', data);

/**
 * Fetches all daily inputs for a given report.
 * @param {string} reportId
 * @returns {Promise} Axios GET response with array of inputs
 */
export const fetchInputsByReport = (reportId) =>
  axios.get(`/api/daily-inputs/${reportId}`);
