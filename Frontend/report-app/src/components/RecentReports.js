import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function RecentReports() {
  const { reports, refreshReports, setSelectedReport } = useContext(AppContext); // ✅ REMOVED unused: totalReports, currentPage, pages
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [page, setPage] = useState(1);

  // Refresh reports whenever page or searchTerm changes
  useEffect(() => {
    refreshReports(page, searchTerm);
  }, [refreshReports, page, searchTerm]);

  useEffect(() => {
    setFilteredReports(
      reports.filter((report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, reports]);

  if (!reports) return <div>Loading recent reports...</div>;
  if (reports.length === 0) return <div>No reports yet.</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border"> {/* ✅ Enhanced styling */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Reports</h2>
      <input
        type="text"
        placeholder="🔍 Search reports..."
        className="w-full p-4 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="space-y-3 max-h-96 overflow-y-auto"> {/* ✅ Better height */}
        {filteredReports.map((report) => (
          <li
            key={report._id}
            className="p-4 bg-slate-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer border border-slate-100"
            onClick={() => setSelectedReport(report)}
          >
            <div className="font-semibold text-slate-900 text-lg mb-1 truncate">{report.title}</div>
            {/* Display the new period fields */}
            <div className="text-sm text-emerald-600 mb-1">
              {report.periodStart && report.periodEnd &&
                `📅 ${new Date(report.periodStart).toLocaleDateString()} — ${new Date(report.periodEnd).toLocaleDateString()}`}
            </div>
            <div className="text-xs text-gray-500 mb-1">
              🕒 Created: {new Date(report.createdAt).toLocaleDateString()}
            </div>
            <div className="text-xs font-medium capitalize px-2 py-1 bg-gray-100 rounded-full inline-block text-slate-700">
              {report.status}
            </div>
          </li>
        ))}
      </ul>
      {/* Pagination controls - Simplified (local pagination works fine) */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-200">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          ← Previous
        </button>
        <div className="text-sm font-semibold text-slate-700">
          Page {page}
        </div>
        <button
          disabled={page >= Math.ceil(filteredReports.length / 10) || filteredReports.length === 0} // ✅ Local pagination logic
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
