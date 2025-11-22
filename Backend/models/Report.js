const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  content: { type: String, default: '' }, // Holds the weekly summary text
  periodStart: { type: Date, required: true }, // Start of the reporting period (e.g., week)
  periodEnd: { type: Date, required: true },   // End of the reporting period (e.g., week)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update 'updatedAt' before each save
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);
