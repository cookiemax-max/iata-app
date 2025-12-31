// src/controllers/emissionsController.js
const EmissionEstimate = require('../models/EmissionEstimate');
const Flight = require('../models/Flight');
const Report = require('../models/Report');
const timService = require('../utils/timService');

/**
 * GET /api/emissions/flight/:flightId - Get emissions for a single flight
 */
exports.getFlightEmissions = async (req, res) => {
  try {
    const { flightId } = req.params;

    const estimate = await EmissionEstimate.findOne({ flightId }).populate(
      'flightId',
      'origin destination carrierCode flightNumber passengers cabinClass departureDateString'
    );

    if (!estimate) {
      return res
        .status(404)
        .json({ message: 'No emissions found for this flight' });
    }

    return res.json({
      estimate,
      summary: {
        co2PerPax: estimate.co2GramsPerPax,
        co2Total: estimate.co2TotalGrams,
        cabinClass: estimate.cabinClassUsed,
        modelVersion: estimate.timModelVersion,
      },
    });
  } catch (err) {
    console.error('getFlightEmissions error:', err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/emissions/report/:reportId - Get report emissions summary
 */
exports.getReportEmissions = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId)
      .select('title emissionsSummary flights')
      .populate(
        'flights',
        'origin destination carrierCode flightNumber passengers cabinClass'
      );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (
      !report.emissionsSummary ||
      report.emissionsSummary.totalCo2Grams === 0
    ) {
      return res.status(404).json({
        message:
          'No emissions computed for this report. Run POST /api/emissions/report/:reportId first.',
      });
    }

    return res.json({
      report: {
        id: report._id,
        title: report.title,
        emissionsSummary: report.emissionsSummary,
        flightCount: report.flights?.length || 0,
      },
    });
  } catch (err) {
    console.error('getReportEmissions error:', err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/emissions/report/:reportId/flights - Get detailed emissions for all flights in report
 */
exports.getReportFlightEmissions = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId).populate('flights');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const flightEstimates = await EmissionEstimate.find({
      flightId: { $in: report.flights.map((f) => f._id) },
    }).populate(
      'flightId',
      'origin destination carrierCode flightNumber passengers cabinClass'
    );

    return res.json({
      reportId,
      totalFlights: report.flights.length,
      flightsWithEmissions: flightEstimates.length,
      flightEstimates,
    });
  } catch (err) {
    console.error('getReportFlightEmissions error:', err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Compute and save emissions for a specific flight
 * POST /api/emissions/flight/:flightId
 */
exports.computeFlightEmissionsForFlight = async (req, res) => {
  try {
    const { flightId } = req.params;
    console.log('HIT computeFlightEmissionsForFlight, flightId =', flightId);

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const segments = [
      {
        origin: flight.origin,
        destination: flight.destination,
        operatingCarrierCode: flight.carrierCode,
        flightNumber: String(flight.flightNumber),
        departureDate: flight.departureDateString,
      },
    ];

    const passengers = flight.passengers || 1;
    const cabinClass = flight.cabinClass || 'economy';

    const timResponse = await timService.computeFlightEmissions({
      segments,
      passengers,
      cabinClass,
    });

    const perPax = timResponse.perPax;
    const perCabinValue = timResponse.perCabinValue;
    const modelVersion = timResponse.modelVersion;

    if (!perPax) {
      return res
        .status(502)
        .json({ message: 'No emissions data returned from TIM' });
    }

    const co2GramsPerPax =
      perCabinValue || perPax.economy || perPax.business || 0;
    const co2TotalGrams = co2GramsPerPax * passengers;

    const modelVersionString = modelVersion
      ? `${modelVersion.major}.${modelVersion.minor}.${modelVersion.patch}`
      : 'unknown';

    const estimate = await EmissionEstimate.findOneAndUpdate(
      {
        flightId: flight._id,
        timModelVersion: modelVersionString,
      },
      {
        flightId: flight._id,
        co2GramsPerPax,
        co2TotalGrams,
        cabinClassUsed: cabinClass,
        allCabinEmissions: perPax,
        calculationType: 'actual',
        timModelVersion: modelVersionString,
      },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      message: 'Emissions computed and saved',
      estimate,
      timModelVersion: modelVersion,
    });
  } catch (err) {
    console.error('computeFlightEmissionsForFlight error:', err);
    return res
      .status(500)
      .json({ message: err.message || 'Failed to compute emissions' });
  }
};

/**
 * Compute emissions for ALL flights in a report and update report summary
 * POST /api/emissions/report/:reportId
 */
exports.computeReportEmissions = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId).populate('flights');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const flights = report.flights || [];
    if (flights.length === 0) {
      return res.status(400).json({ message: 'No flights in this report' });
    }

    let totalCo2Grams = 0;
    let totalPassengers = 0;
    let flightsWithEmissions = 0;
    let latestModelVersion = null;

    console.log(`Processing ${flights.length} flights for report ${reportId}...`);

    for (const flight of flights) {
      try {
        const segments = [
          {
            origin: flight.origin,
            destination: flight.destination,
            operatingCarrierCode: flight.carrierCode,
            flightNumber: String(flight.flightNumber),
            departureDate: flight.departureDateString,
          },
        ];

        const timResponse = await timService.computeFlightEmissions({
          segments,
          passengers: flight.passengers || 1,
          cabinClass: flight.cabinClass || 'economy',
        });

        if (timResponse.perPax) {
          const co2GramsPerPax =
            timResponse.perCabinValue || timResponse.perPax.economy || 0;
          const co2TotalGramsFlight =
            co2GramsPerPax * (flight.passengers || 1);

          const modelVersionString = timResponse.modelVersion
            ? `${timResponse.modelVersion.major}.${timResponse.modelVersion.minor}.${timResponse.modelVersion.patch}`
            : 'unknown';

          await EmissionEstimate.findOneAndUpdate(
            { flightId: flight._id, timModelVersion: modelVersionString },
            {
              flightId: flight._id,
              co2GramsPerPax,
              co2TotalGrams: co2TotalGramsFlight,
              cabinClassUsed: flight.cabinClass || 'economy',
              allCabinEmissions: timResponse.perPax,
              calculationType: 'actual',
              timModelVersion: modelVersionString,
            },
            { new: true, upsert: true }
          );

          totalCo2Grams += co2TotalGramsFlight;
          totalPassengers += flight.passengers || 1;
          flightsWithEmissions++;
          latestModelVersion = timResponse.modelVersion;
        }
      } catch (flightErr) {
        console.warn(`Skipping flight ${flight._id}:`, flightErr.message);
      }
    }

    const co2GramsPerPax =
      totalPassengers > 0
        ? Math.round(totalCo2Grams / totalPassengers)
        : 0;
    const modelVersionString = latestModelVersion
      ? `${latestModelVersion.major}.${latestModelVersion.minor}.${latestModelVersion.patch}`
      : 'unknown';

    report.emissionsSummary = {
      totalCo2Grams,
      totalPassengers,
      co2GramsPerPax,
      flightsWithEmissions,
      flightsTotal: flights.length,
      timModelVersion: modelVersionString,
      lastComputed: new Date(),
    };

    await report.save();

    return res.status(201).json({
      message: `Processed ${flightsWithEmissions}/${flights.length} flights`,
      emissionsSummary: report.emissionsSummary,
    });
  } catch (err) {
    console.error('computeReportEmissions error:', err);
    return res
      .status(500)
      .json({ message: err.message || 'Failed to compute report emissions' });
  }
};
