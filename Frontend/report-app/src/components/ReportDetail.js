import React, { useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import DailyInputs from './DailyInputs';
import FlightsForReport from './FlightsForReport';
import SummarizeButton from './SummarizeButton';
import { getReportEmissions, computeReportEmissions } from '../api/emissionsApi';

export default function ReportDetail() {
  const { selectedReport, refreshReports, refreshInputs } = useContext(AppContext);
  const [emissionsSummary, setEmissionsSummary] = React.useState(null);
  const [loadingEmissions, setLoadingEmissions] = React.useState(false);

  // ✅ FIXED: Memoized functions to avoid useEffect dependency issues
  const loadEmissions = useCallback(async (reportId) => {
    try {
      setLoadingEmissions(true);
      const data = await getReportEmissions(reportId);
      setEmissionsSummary(data.report?.emissionsSummary);
    } catch (e) {
      console.error('Failed to load emissions', e);
    } finally {
      setLoadingEmissions(false);
    }
  }, []);

  const handleComputeAllEmissions = useCallback(async () => {
    if (!selectedReport?._id) return;
    setLoadingEmissions(true);
    try {
      await computeReportEmissions(selectedReport._id);
      await loadEmissions(selectedReport._id);
    } catch (e) {
      console.error('Failed to compute emissions', e);
    } finally {
      setLoadingEmissions(false);
    }
  }, [selectedReport?._id, loadEmissions]);

  // ✅ FIXED: Added refreshInputs dependency
  useEffect(() => {
    if (selectedReport?._id) {
      refreshInputs(selectedReport._id);
      loadEmissions(selectedReport._id);
    }
  }, [selectedReport, refreshInputs, loadEmissions]); // ✅ ESLint happy!

  if (!selectedReport) return null;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto"> {/* ✅ Enhanced layout */}
      {/* Report Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl shadow-lg p-8 border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedReport.title}</h1>
            <p className="text-xl text-slate-600 mb-4">
              📅 {new Date(selectedReport.periodStart).toLocaleDateString()} –{' '}
              {new Date(selectedReport.periodEnd).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize inline-flex items-center gap-2 ${
            selectedReport.status === 'completed' 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {selectedReport.status === 'completed' ? '✅ Completed' : '⏳ In Progress'}
          </span>
        </div>
      </div>

      {/* Emissions Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl shadow-lg p-8 border border-emerald-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-emerald-900">Emissions Summary</h2>
          </div>
          <button 
            onClick={handleComputeAllEmissions} 
            disabled={loadingEmissions}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {loadingEmissions ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Computing...
              </>
            ) : (
              '⚡ Compute All Emissions'
            )}
          </button>
        </div>
        
        {emissionsSummary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{emissionsSummary.totalCo2Grams?.toLocaleString()}</div>
              <div className="text-slate-600">Total CO₂ (grams)</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-blue-600 mb-1">{emissionsSummary.totalPassengers?.toLocaleString()}</div>
              <div className="text-slate-600">Passengers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-orange-600 mb-1">{Math.round(emissionsSummary.co2GramsPerPax || 0)}</div>
              <div className="text-slate-600">g CO₂ per Pax</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {emissionsSummary.flightsWithEmissions}/{emissionsSummary.flightsTotal}
              </div>
              <div className="text-slate-600">Flights w/ Emissions</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-slate-500 mb-4">No emissions computed yet</p>
            <p className="text-slate-400">Click "Compute All Emissions" to analyze your flights</p>
          </div>
        )}
      </div>

      {/* Daily Inputs */}
      <DailyInputs reportId={selectedReport._id} />

      {/* Flights */}
      <FlightsForReport reportId={selectedReport._id} />

      {/* AI Summary */}
      {selectedReport.content && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-purple-200">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-900">🤖 AI Weekly Summary</h2>
            </div>
            <SummarizeButton reportId={selectedReport._id} onSummarySaved={refreshReports} />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-inner border">
            <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-base max-h-96 overflow-y-auto">
              {selectedReport.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
