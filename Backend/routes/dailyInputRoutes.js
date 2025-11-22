const express = require('express');
const router = express.Router();
const c = require('../controllers/dailyInputController');
const validateInput = require('../middleware/validateInput');

// Define required fields for daily input
const dailyInputRequiredFields = { reportId: true, date: true, input: true };

router.post('/', validateInput(dailyInputRequiredFields), c.createDailyInput);

router.get('/:reportId', c.getInputsByReport);

module.exports = router;
