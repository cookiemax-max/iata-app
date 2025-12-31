// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController'); // You'll create this next
const validateInput = require('../middleware/validateInput');

// Required fields for flight creation
const flightRequiredFields = {
  origin: true, destination: true, carrierCode: true, 
  flightNumber: true, departureDateString: true
};

router.post('/report/:reportId', validateInput(flightRequiredFields), flightController.createFlightForReport);
router.get('/report/:reportId', flightController.getFlightsByReport);
router.delete('/report/:reportId/:flightId', flightController.deleteFlightForReport);

module.exports = router;
