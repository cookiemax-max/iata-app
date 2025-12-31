// controllers/flightController.js
const Flight = require('../models/Flight');
const Report = require('../models/Report');

exports.createFlightForReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const flightData = req.body;

    // Verify report exists
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Create flight with reportId link
    const flight = new Flight({ ...flightData, reportId });
    const savedFlight = await flight.save();

    // Add to report.flights array
    report.flights = report.flights || [];
    report.flights.push(savedFlight._id);
    await report.save();

    res.status(201).json(savedFlight);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getFlightsByReport = async (req, res) => {
  try {
    const flights = await Flight.find({ reportId: req.params.reportId })
      .sort({ departureDateString: 1 });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFlightForReport = async (req, res) => {
  try {
    const { reportId, flightId } = req.params;
    
    // Delete flight
    await Flight.findByIdAndDelete(flightId);
    
    // Remove from report.flights array
    const report = await Report.findById(reportId);
    report.flights = report.flights.filter(id => id.toString() !== flightId);
    await report.save();
    
    res.json({ message: 'Flight deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
