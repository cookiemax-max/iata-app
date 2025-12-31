// src/api/emissionsApi.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const getReportEmissions = (reportId) => 
  fetch(`${API_BASE_URL}/api/emissions/report/${reportId}`)
    .then(r => r.json());

export const computeReportEmissions = (reportId) => 
  fetch(`${API_BASE_URL}/api/emissions/report/${reportId}`, { 
    method: 'POST' 
  }).then(r => r.json());

export const getReportFlightEmissions = (reportId) => 
  fetch(`${API_BASE_URL}/api/emissions/report/${reportId}/flights`)
    .then(r => r.json());
