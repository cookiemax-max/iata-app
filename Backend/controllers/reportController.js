const Report = require('../models/Report');
const DailyInput = require('../models/DailyInput');
const EmissionEstimate = require('../models/EmissionEstimate'); // NEW
const aiService = require('../utils/aiService');


// Create a new report (now requires periodStart, periodEnd)
exports.createReport = async (req, res) => {
  try {
    const { title, periodStart, periodEnd, status = 'pending' } = req.body;

    if (!title || !periodStart || !periodEnd) {
      return res
        .status(400)
        .json({ message: 'Title, periodStart, and periodEnd are required.' });
    }

    const report = new Report({ title, periodStart, periodEnd, status });
    const savedReport = await report.save();

    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Get all reports (with pagination + search)
exports.getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const reports = await Report.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      reports,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get a single report by ID (with daily inputs + emissions)
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).lean();
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Include daily inputs
    const dailyInputs = await DailyInput.find({ reportId: req.params.id });

    // NEW: include all emissions estimates for this report (latest first)
    const emissions = await EmissionEstimate.find({ reportId: req.params.id })
      .sort({ createdAt: -1 });

    res.json({ ...report, dailyInputs, emissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update report
exports.updateReport = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Report stats for dashboard
exports.getReportStats = async (req, res) => {
  try {
    const total = await Report.countDocuments();
    const inProgress = await Report.countDocuments({ status: 'in-progress' });
    const completed = await Report.countDocuments({ status: 'completed' });

    res.json({ total, inProgress, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Summarize a week's daily inputs and save to report content
// NOW: emissions-aware (uses latest EmissionEstimate if available)
exports.summarizeWeeklyInputs = async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Fetch all daily inputs for this report
    const dailyInputs = await DailyInput.find({ reportId });
    const inputTexts = dailyInputs.map((input) => input.input);

    if (!inputTexts.length) {
      return res
        .status(400)
        .json({ message: 'No daily inputs found for this report.' });
    }

    // NEW: fetch latest emissions estimate for this report (if any)
    const [latestEmission] = await EmissionEstimate.find({ reportId })
      .sort({ createdAt: -1 })
      .limit(1);

    // Get summary using AI service, with period + emissions context
    const summary = await aiService.getSummary(inputTexts, {
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      emissions: latestEmission
        ? {
            co2GramsPerPax: latestEmission.co2GramsPerPax,
            co2TotalGrams: latestEmission.co2TotalGrams,
            timModelVersion: latestEmission.timModelVersion,
          }
        : null,
    });

    // Save summary back to report
    report.content = summary;
    await report.save();

    res.json({ message: 'Weekly summary updated.', summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
