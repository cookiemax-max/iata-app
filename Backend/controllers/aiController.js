const aiService = require('../utils/aiService');
const Report = require('../models/Report');
const DailyInput = require('../models/DailyInput');

/**
 * Stateless: Summarize any provided list of inputs (does not save)
 * POST /api/ai/summarize
 * Body: { inputs: [string] }
 */
exports.summarizeInputs = async (req, res) => {
  try {
    const { inputs } = req.body;
    if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
      return res.status(400).json({ error: 'Must provide non-empty array of inputs.' });
    }
    const summary = await aiService.getSummary(inputs);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message || 'AI summarization failed.' });
  }
};

/**
 * RESTful: Summarize all daily inputs for a report, save to report, and return
 * POST /api/ai/summarize/:reportId
 */
exports.summarizeAndSaveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    if (!reportId) {
      return res.status(400).json({ error: 'Missing reportId parameter.' });
    }

    // 1. Fetch report
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // 2. Fetch daily inputs for report
    const dailyInputs = await DailyInput.find({ reportId });
    if (!dailyInputs.length) {
      return res.status(400).json({ error: 'No daily inputs to summarize for this report.' });
    }

    // 3. Prepare input text array
    const inputTexts = dailyInputs.map(di => di.input);

    // 4. AI summarize -- PASS periodStart & periodEnd for better formatting!
    const summary = await aiService.getSummary(inputTexts, {
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
    });
    if (!summary) {
      return res.status(500).json({ error: 'AI summarization failed.' });
    }

    // 5. Save summary to report
    report.content = summary; // Or { summary } for nested object style if preferred
    await report.save();

    // 6. Response
    res.json({
      summary,
      reportId: report._id,
      updated: true,
    });
  } catch (err) {
    console.error('Error summarizing and saving report summary:', err);
    res.status(500).json({ error: err.message || 'Server error while summarizing report.' });
  }
};
