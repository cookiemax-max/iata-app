import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {
  BarChart3Icon, 
  ActivityIcon, 
  TrendingUpIcon 
} from '@heroicons/react/24/outline';

export default function EmissionsDashboard() {
  const { reports, refreshReports } = useContext(AppContext);
  const [emissionsData, setEmissionsData] = useState([]);
  const [totalCo2, setTotalCo2] = useState(0);
  const [avgPerPax, setAvgPerPax] = useState(0);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  useEffect(() => {
    const data = reports
      .filter(r => r.emissionsSummary?.totalCo2Grams > 0)
      .map(report => ({
        id: report._id,
        title: report.title.slice(0, 20) + '...',
        co2: report.emissionsSummary.totalCo2Grams / 1000, // kg
        passengers: report.emissionsSummary.totalPassengers,
        perPax: report.emissionsSummary.co2GramsPerPax,
        period: `${new Date(report.periodStart).toLocaleDateString('short')} - ${new Date(report.periodEnd).toLocaleDateString('short')}`
      }));

    setEmissionsData(data);
    setTotalCo2(data.reduce((sum, d) => sum + d.co2, 0));
    setAvgPerPax(data.reduce((sum, d) => sum + d.perPax, 0) / (data.length || 1));
  }, [reports]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Total Emissions Overview */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-lg p-8 border border-emerald-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-emerald-500 rounded-xl">
            <BarChart3Icon className="w-8 h-8 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-emerald-900">{totalCo2.toLocaleString()} kg CO₂</h3>
            <p className="text-emerald-700">Total across all reports</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Avg per passenger:</span>
            <span className="font-semibold">{Math.round(avgPerPax)}g</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-3">
            <div 
              className="bg-emerald-500 h-3 rounded-full transition-all duration-700" 
              style={{ width: `${Math.min((avgPerPax / 500) * 100, 100)}%` }}
              title={`${Math.round(avgPerPax)}g/pax`}
            />
          </div>
        </div>
      </div>

      {/* Top Reports Bar Chart (ASCII-style) */}
      <div className="bg-white rounded-xl shadow-lg p-8 border">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-500 rounded-xl">
            <ActivityIcon className="w-8 h-8 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-2xl font-bold text-slate-900">Top Emissions Reports</h3>
            <p className="text-slate-600">Recent reports by CO₂ (kg)</p>
          </div>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {emissionsData.slice(0, 8).map((report, i) => (
            <div key={report.id} className="flex items-end h-12 bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition">
              <div className="flex-1 flex items-end space-x-2">
                <div 
                  className="w-2 bg-gradient-to-t from-red-500 to-orange-500 rounded shadow-sm"
                  style={{ height: `${Math.min((report.co2 / Math.max(...emissionsData.map(d => d.co2)) * 100), 100)}%` }}
                  title={`${report.co2.toFixed(1)}kg`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-900 truncate">{report.title}</p>
                  <p className="text-xs text-slate-500">{report.period}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-900 ml-4">{report.co2.toFixed(1)}kg</span>
            </div>
          ))}
          {emissionsData.length === 0 && (
            <p className="text-center py-12 text-slate-500 text-lg">No emissions data yet</p>
          )}
        </div>
      </div>

      {/* Trends & Insights */}
      <div className="lg:col-span-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 border">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUpIcon className="w-10 h-10 text-purple-600 mr-3" />
          Emissions Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{emissionsData.length}</div>
            <div className="text-slate-600">Reports w/ Emissions</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{totalCo2.toFixed(0)}kg</div>
            <div className="text-slate-600">Total CO₂</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{Math.round(avgPerPax)}g</div>
            <div className="text-slate-600">Avg per Passenger</div>
          </div>
        </div>
      </div>
    </div>
  );
}
