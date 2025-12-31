// routes/emissionsRoutes.js
const express = require('express');
const router = express.Router();
const emissionsController = require('../controllers/emissionsController');
const validateInput = require('../middleware/validateInput');

// Optional validation if you want to enforce segments in the body (for future use)
const emissionsRequiredFields = { segments: true };

// ==================== GET ROUTES (NEW) ====================
// Single flight emissions
router.get('/flight/:flightId', emissionsController.getFlightEmissions);

// Report emissions summary
router.get('/report/:reportId', emissionsController.getReportEmissions);

// Detailed emissions for all flights in a report
router.get('/report/:reportId/flights', emissionsController.getReportFlightEmissions);

// ==================== POST ROUTES (EXISTING) ====================
// MANUAL: compute emissions for a single flight (uses flightId path param)
router.post(
  '/flight/:flightId',
  // no validateInput here because data comes from DB via flightId
  emissionsController.computeFlightEmissionsForFlight
);

// REPORT-LEVEL: compute emissions for all flights in a report
router.post(
  '/report/:reportId',
  // validateInput(emissionsRequiredFields), // keep commented until UI sends segments
  emissionsController.computeReportEmissions
);

module.exports = router;
