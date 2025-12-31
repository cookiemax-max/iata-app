import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import DailyInputs from './DailyInputs';
import FlightsForReport from './FlightsForReport';
import SummarizeButton from './SummarizeButton';
import { getReportEmissions, computeReportEmissions } from '../api/emissionsApi'; // Create this

export default function ReportDetail() {
  const { selectedReport, refreshReports, refreshInputs } = useContext(AppContext);
  const [emissionsSummary, setEmissionsSummary] = React.useState(null);
  const [loadingEmissions, setLoadingEmissions] = React.useState(false);

  useEffect(() => {
    if (selectedReport?._id) {
      refreshInputs(selectedReport._id);
      loadEmissions(selectedReport._id);
    }
  }, [selectedReport]);

  const loadEmissions = async (reportId) => {
    try {
      const data = await getReportEmissions(reportId);
      setEmissionsSummary(data.report?.emissionsSummary);
    } catch (e) {
      console.error('Failed to load emissions', e);
    }
  };

  const handleComputeAllEmissions = async () => {
    setLoadingEmissions(true);
    try {
      await computeReportEmissions(selectedReport._id);
      await loadEmissions(selectedReport._id);
    } catch (e) {
      console.error('Failed to compute emissions', e);
    }
    setLoadingEmissions(false);
  };

  if (!selectedReport) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Report Header */}
      <div className="bg-white rounded-lg shadow p-6 border">
        <h1 className="text-2xl font-bold">{selectedReport.title}</h1>
        <p className="text-slate-600">
          {new Date(selectedReport.periodStart).toLocaleDateString()} – {new Date(selectedReport.periodEnd).toLocaleDateString()}
        </p>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${selectedReport.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {selectedReport.status}
        </span>
      </div>

      {/* Emissions Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Emissions Summary</h2>
          <button 
            onClick={handleComputeAllEmissions} 
            disabled={loadingEmissions}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingEmissions ? 'Computing...' : 'Compute All'}
          </button>
        </div>
        {emissionsSummary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div><strong>{emissionsSummary.totalCo2Grams?.toLocaleString()}</strong> g CO₂</div>
            <div><strong>{emissionsSummary.totalPassengers}</strong> passengers</div>
            <div><strong>{Math.round(emissionsSummary.co2GramsPerPax || 0)}</strong> g/pax</div>
            <div>{emissionsSummary.flightsWithEmissions}/{emissionsSummary.flightsTotal} flights</div>
          </div>
        ) : (
          <p className="text-slate-500">No emissions computed yet</p>
        )}
      </div>

      {/* Daily Inputs */}
      <DailyInputs reportId={selectedReport._id} />

      {/* Flights */}
      <FlightsForReport reportId={selectedReport._id} />

      {/* AI Summary */}
      {selectedReport.content && (
        <div className="bg-white rounded-lg shadow p-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">AI Weekly Summary</h2>
            <SummarizeButton reportId={selectedReport._id} onSummarySaved={refreshReports} />
          </div>
          <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded font-mono text-sm">
            {selectedReport.content}
          </pre>
        </div>
      )}
    </div>
  );
}
