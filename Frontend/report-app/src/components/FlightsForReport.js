// src/components/FlightsForReport.js
import React, { useEffect, useState } from 'react';
import {
  createFlight,
  getFlightsByReport,
  computeFlightEmissions,
  getFlightEmissions,
} from '../api/flightApi';

function FlightsForReport({ reportId }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    carrierCode: '',
    flightNumber: '',
    departureDateString: '',
    passengers: 1,
    cabinClass: 'economy',
  });

  useEffect(() => {
    if (!reportId) return;
    (async () => {
      try {
        const data = await getFlightsByReport(reportId);
        setFlights(data);
      } catch (e) {
        console.error('Failed to load flights', e);
      }
    })();
  }, [reportId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!reportId) return;
    setLoading(true);
    try {
      const newFlight = await createFlight({ ...form, reportId });
      setFlights((prev) => [...prev, newFlight]);
      setForm({
        origin: '',
        destination: '',
        carrierCode: '',
        flightNumber: '',
        departureDateString: '',
        passengers: 1,
        cabinClass: 'economy',
      });
    } catch (e) {
      console.error('Failed to create flight', e);
    } finally {
      setLoading(false);
    }
  };

  const handleComputeEmissions = async (flightId) => {
    setLoading(true);
    try {
      await computeFlightEmissions(flightId);
      const { estimate } = await getFlightEmissions(flightId);
      setFlights((prev) =>
        prev.map((f) =>
          f._id === flightId ? { ...f, emissions: estimate } : f
        )
      );
    } catch (e) {
      console.error('Failed to compute emissions', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Flights for this report</h3>

      {/* Create flight form */}
      <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <input
          name="origin"
          value={form.origin}
          onChange={handleChange}
          placeholder="Origin (NBO)"
          className="border rounded px-2 py-1"
          required
        />
        <input
          name="destination"
          value={form.destination}
          onChange={handleChange}
          placeholder="Destination (JFK)"
          className="border rounded px-2 py-1"
          required
        />
        <input
          name="carrierCode"
          value={form.carrierCode}
          onChange={handleChange}
          placeholder="Carrier (KQ)"
          className="border rounded px-2 py-1"
          required
        />
        <input
          name="flightNumber"
          value={form.flightNumber}
          onChange={handleChange}
          placeholder="Flight # (100)"
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="date"
          name="departureDateString"
          value={form.departureDateString}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="number"
          name="passengers"
          min="1"
          value={form.passengers}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        />
        <select
          name="cabinClass"
          value={form.cabinClass}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        >
          <option value="economy">Economy</option>
          <option value="premiumEconomy">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white rounded px-3 py-1"
        >
          {loading ? 'Saving…' : 'Add flight'}
        </button>
      </form>

      {/* Flights list */}
      {flights.length === 0 ? (
        <p className="text-sm text-gray-500">No flights added yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Route</th>
              <th className="text-left py-1">Flight</th>
              <th className="text-left py-1">Date</th>
              <th className="text-left py-1">Pax</th>
              <th className="text-left py-1">Emissions</th>
              <th className="text-left py-1"></th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f._id} className="border-b">
                <td className="py-1">
                  {f.origin} → {f.destination}
                </td>
                <td className="py-1">
                  {f.carrierCode} {f.flightNumber}
                </td>
                <td className="py-1">{f.departureDateString}</td>
                <td className="py-1">{f.passengers}</td>
                <td className="py-1">
                  {f.emissions
                    ? `${(f.emissions.co2GramsPerPax / 1000).toFixed(1)} kg/pax`
                    : 'Not computed'}
                </td>
                <td className="py-1">
                  <button
                    onClick={() => handleComputeEmissions(f._id)}
                    disabled={loading}
                    className="text-sm bg-sky-600 text-white rounded px-2 py-1"
                  >
                    Compute emissions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FlightsForReport;
