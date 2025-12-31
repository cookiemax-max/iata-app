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
  
  // Flights relationship - add this
  flights: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  }],
  
  // Emissions summary - add this
  emissionsSummary: {
    totalCo2Grams: { type: Number, default: 0 },
    totalPassengers: { type: Number, default: 0 },
    co2GramsPerPax: { type: Number, default: 0 }, // average per passenger
    flightsWithEmissions: { type: Number, default: 0 },
    flightsTotal: { type: Number, default: 0 },
    timModelVersion: { type: String }, // e.g. "3.0.0"
    lastComputed: { type: Date }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Automatically update 'updatedAt' before each save
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);
