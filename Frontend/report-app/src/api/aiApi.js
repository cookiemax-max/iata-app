// src/api/aiApi.js
import axios from 'axios';

/**
 * Summarize all daily inputs for the given report and save the summary on the backend.
 * 
 * @param {string} reportId - The ID of the report to summarize
 * @returns {Promise<Object>} API response with { summary } and possibly { reportId }
 */
export const summarizeReportAndSave = (reportId) => {
  // POST request; backend will collect inputs and save the summary
  return axios.post(`/api/ai/summarize/${reportId}`);
};

// (Optional) Keep your original export for stateless summarization if needed elsewhere:
// export const summarizeInputs = (inputs) =>
//   axios.post('/api/ai/summarize', { inputs });
