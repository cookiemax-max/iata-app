// src/api/flightApi.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export async function createFlight(flight) {
  const res = await fetch(`${API_BASE_URL}/api/flights/report/${flight.reportId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flight),
  });
  if (!res.ok) throw new Error('Failed to create flight');
  return res.json();
}

export async function getFlightsByReport(reportId) {
  const res = await fetch(`${API_BASE_URL}/api/flights/report/${reportId}`);
  if (!res.ok) throw new Error('Failed to load flights');
  return res.json();
}

// ✅ Emissions functions are already CORRECT
export async function computeFlightEmissions(flightId) {
  const res = await fetch(`${API_BASE_URL}/api/emissions/flight/${flightId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to compute flight emissions');
  return res.json();
}

export async function getFlightEmissions(flightId) {
  const res = await fetch(`${API_BASE_URL}/api/emissions/flight/${flightId}`);
  if (!res.ok) throw new Error('Failed to get flight emissions');
  return res.json();
}
