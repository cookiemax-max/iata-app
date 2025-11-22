import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function RecentReports() {
  const { reports, refreshReports, setSelectedReport, totalReports, currentPage, pages } = useContext(AppContext);

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
    <div className="bg-white rounded shadow p-6">
      <h2 className="font-bold text-lg mb-2">Recent Reports</h2>
      <input
        type="text"
        placeholder="Search reports..."
        className="border p-2 mb-4 w-full rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {filteredReports.map((report) => (
          <li
            key={report._id}
            className="p-2 border-b cursor-pointer hover:bg-blue-50"
            onClick={() => setSelectedReport(report)}
          >
            <div className="font-semibold">{report.title}</div>
            {/* Display the new period fields */}
            <div className="text-xs text-gray-500">
              {report.periodStart && report.periodEnd &&
                `Period: ${new Date(report.periodStart).toLocaleDateString()} — ${new Date(report.periodEnd).toLocaleDateString()}`}
            </div>
            <div className="text-xs text-gray-500">
              Created: {new Date(report.createdAt).toLocaleDateString()}
            </div>
            <div className="text-xs capitalize text-gray-600">{report.status}</div>
          </li>
        ))}
      </ul>
      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <div>
          Page {page} of {pages}
        </div>
        <button
          disabled={page >= pages}
          onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
