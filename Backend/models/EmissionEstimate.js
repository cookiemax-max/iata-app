const mongoose = require('mongoose');

const emissionEstimateSchema = new mongoose.Schema({
  // Link to flight (required for current controllers)
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },

  // Optional link to report (keep if you want aggregated summaries later)
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
  },

  co2GramsPerPax: { type: Number, required: true },
  co2TotalGrams: { type: Number, required: true },

  cabinClassUsed: {
    type: String,
    enum: ['first', 'business', 'premiumEconomy', 'economy'],
    default: 'economy',
  },

  // Store full per-cabin emissions from TIM (first, business, premiumEconomy, economy)
  allCabinEmissions: {
    type: mongoose.Schema.Types.Mixed,
  },

  calculationType: {
    type: String,
    enum: ['actual', 'typical'],
    default: 'actual',
  },

  timModelVersion: { type: String, required: true },

  rawTimResponse: { type: Object }, // optional, for audit/debug

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmissionEstimate', emissionEstimateSchema);
