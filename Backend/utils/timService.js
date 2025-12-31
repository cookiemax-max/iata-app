// utils/timService.js
const axios = require('axios');

const TIM_BASE_URL =
  process.env.TIM_BASE_URL || 'https://travelimpactmodel.googleapis.com/v1';
const TIM_API_KEY = process.env.TIM_API_KEY;

if (!TIM_API_KEY) {
  console.warn('WARN: TIM_API_KEY is not set. TIM calls will fail in production.');
}

/**
 * Call Travel Impact Model flights.computeFlightEmissions
 * @param {Object} params
 * @param {Array} params.segments - [{ origin, destination, operatingCarrierCode, flightNumber, departureDate }]
 * @param {number} [params.passengers=1]
 * @param {string} [params.cabinClass] - 'first' | 'business' | 'premiumEconomy' | 'economy'
 * @returns {Promise<{ perPax: Object, perCabinValue: number|null, modelVersion: Object, raw: Object }>}
 */
async function computeFlightEmissions({ segments, passengers = 1, cabinClass }) {
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new Error('TIM computeFlightEmissions: segments array is required.');
  }

  if (!TIM_API_KEY) {
    throw new Error('TIM_API_KEY not configured');
  }

  const url = `${TIM_BASE_URL}/flights:computeFlightEmissions?key=${TIM_API_KEY}`;

  // For now, send a *single* flight built from the first segment,
  // matching the structure that worked in your curl test.
  const s = segments[0];

  const body = {
    flights: [
      {
        origin: s.origin,
        destination: s.destination,
        operatingCarrierCode: s.operatingCarrierCode,
        flightNumber: s.flightNumber,
        // departureDate as object {year, month, day}
        departureDate: {
          year: Number(s.departureDate.slice(0, 4)),
          month: Number(s.departureDate.slice(5, 7)),
          day: Number(s.departureDate.slice(8, 10)),
        },
      },
    ],
  };

  try {
    const res = await axios.post(url, body, { timeout: 10000 });
    const data = res.data; // flightEmissions[], modelVersion, etc.

    // TEMP DEBUG LOG – see exactly what TIM returns
    console.log('TIM raw response:', JSON.stringify(data, null, 2));

    const timFlight = data.flightEmissions?.[0];
    const perPax = timFlight?.emissionsGramsPerPax || null;
    const modelVersion = data.modelVersion || null;

    let perCabinValue = null;
    if (perPax && cabinClass && perPax[cabinClass] != null) {
      perCabinValue = perPax[cabinClass];
    }

    return {
      perPax,
      perCabinValue,
      modelVersion,
      raw: data,
    };
  } catch (err) {
    console.error(
      'Error calling TIM flights.computeFlightEmissions:',
      err.response?.data || err.message
    );
    throw new Error('TIM computeFlightEmissions failed');
  }
}

module.exports = {
  computeFlightEmissions,
};
