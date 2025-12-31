// models/Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  origin: { type: String, required: true },           // e.g. 'NBO'
  destination: { type: String, required: true },      // e.g. 'JFK'
  carrierCode: { type: String, required: true },      // e.g. 'KQ'
  flightNumber: { type: String, required: true },     // e.g. '100'
  departureDateString: { type: String, required: true }, // '2025-12-23'
  passengers: { type: Number, default: 1 },
  cabinClass: { 
    type: String, 
    enum: ['first', 'business', 'premiumEconomy', 'economy'],
    default: 'economy'
  },
  reportId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Report' 
  }, // Link to parent report
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flight', flightSchema);
