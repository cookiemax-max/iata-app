const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const validateInput = require('../middleware/validateInput');

// Input validation schema for stateless summarization
const summarizeRequiredFields = { inputs: true };

// Input validation schema for concierge chat
const chatRequiredFields = { message: true };

/**
 * POST /api/ai/summarize
 * Stateless summarization: summarizes a provided array of inputs (no saving)
 * Body: { inputs: [...] }
 */
router.post(
  '/summarize',
  validateInput(summarizeRequiredFields),
  aiController.summarizeInputs
);

/**
 * POST /api/ai/summarize/:reportId
 * Summarize all daily inputs for a report, save, and return summary
 * No input body necessary, just reportId in URL
 */
router.post(
  '/summarize/:reportId',
  aiController.summarizeAndSaveReport
);

/**
 * POST /api/ai/chat
 * Concierge chat endpoint
 * Body: { message, history? }
 */
router.post(
  '/chat',
  validateInput(chatRequiredFields),
  aiController.chatConcierge
);

module.exports = router;
