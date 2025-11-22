const mongoose = require('mongoose');

const dailyInputSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  date: { type: Date, required: true },                // Date of the daily input
  input: { type: String, required: true },             // Main content for that day
  user: { type: String },                              // Optional: username or user ID of submitter
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyInput', dailyInputSchema);
