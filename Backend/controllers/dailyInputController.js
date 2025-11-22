const DailyInput = require('../models/DailyInput');

exports.createDailyInput = async (req, res) => {
  try {
    const { reportId, input, date } = req.body;
    if (!reportId || !input || !date) {
      return res.status(400).json({ message: "reportId, input, and date are required." });
    }
    const newInput = new DailyInput({ reportId, input, date, user: req.body.user });
    const saved = await newInput.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getInputsByReport = async (req, res) => {
  try {
    const inputs = await DailyInput.find({ reportId: req.params.reportId })
      .sort({ date: 1 });
    res.json(inputs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
