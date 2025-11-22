const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const validateInput = require('../middleware/validateInput');

// Define required fields for creating a report
const reportRequiredFields = { title: true, periodStart: true, periodEnd: true };

// Require all fields on report creation
router.post('/', validateInput(reportRequiredFields), reportController.createReport);

router.get('/', reportController.getReports);
router.get('/stats', reportController.getReportStats);
router.get('/:id', reportController.getReportById);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);

// New endpoint: summarize daily inputs for the given report and save the summary to content
router.post('/:id/summarize', reportController.summarizeWeeklyInputs);

module.exports = router;
