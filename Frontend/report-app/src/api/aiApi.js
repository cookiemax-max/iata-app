// src/api/aiApi.js
import axios from 'axios';

// Ensures correct backend target in Docker/production
const BASEURL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Summarize all daily inputs for the given report and save the summary on the backend.
 * @param {string} reportId - The ID of the report to summarize
 * @returns {Promise<Object>} API response with { summary } and possibly { reportId }
 */
export const summarizeReportAndSave = (reportId) => {
  // POST request; backend will collect inputs and save the summary
  return axios.post(`${BASEURL}/api/ai/summarize/${reportId}`);
};

// (Optional) stateless summarization endpoint
export const summarizeInputs = (inputs) =>
  axios.post(`${BASEURL}/api/ai/summarize`, { inputs });

/**
 * Send a message to the AI concierge chat endpoint.
 * @param {{ message: string, history?: Array<{ role: 'user'|'assistant', content: string }> }} payload
 * @returns {Promise<Object>} API response with { reply }
 */
export const sendChatMessage = (payload) =>
  axios.post(`${BASEURL}/api/ai/chat`, payload);
