import React, { useState, useEffect, useCallback } from 'react';
import { fetchReports } from '../api/reportApi';
import jsPDF from 'jspdf';

export default function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Memoized loadReports to safely use in useEffect
  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchReports({ search });
      setReports(data.reports || []);
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await loadReports();
  };

  // PDF Export with Times font for general text, Courier for ASCII tables
  function downloadPDF(report) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    doc.setFont('times', 'normal');
    doc.setFontSize(18);
    doc.text(report.title, 10, 20);
    doc.setFontSize(12);

    doc.text(
      `Period: ${new Date(report.periodStart).toLocaleDateString()} — ${new Date(report.periodEnd).toLocaleDateString()}`,
      10, 30
    );
    doc.text(`Status: ${report.status}`, 10, 40);

    let yStart = 50;
    if (report.content) {
      // Find Stakeholder Engagement table for font switching
      const summaryStr = typeof report.content === "string" ? report.content : JSON.stringify(report.content);
      const tableRegex = /(Date\s+\|\s+Stakeholder.*?)(\n?-+\|[-+\s]+\n?.*)/s;
      const match = summaryStr.match(tableRegex);

      if (match) {
        const beforeTable = summaryStr.substring(0, match.index + match[1].length);
        doc.setFont('times', 'normal');
        const beforeLines = doc.splitTextToSize(beforeTable, 180);
        doc.text(beforeLines, 10, yStart);

        doc.setFont('courier', 'normal');
        const tableSection = match[2];
        const tableLines = doc.splitTextToSize(tableSection, 180);
        doc.text(tableLines, 10, yStart + beforeLines.length * 7);

        const afterTable = summaryStr.substring(match.index + match[0].length);
        if (afterTable && afterTable.trim().length > 0) {
          doc.setFont('times', 'normal');
          const afterLines = doc.splitTextToSize(afterTable, 180);
          doc.text(afterLines, 10, yStart + (beforeLines.length + tableLines.length) * 7);
        }
      } else {
        doc.setFont('times', 'normal');
        const lines = doc.splitTextToSize(summaryStr, 180);
        doc.text(lines, 10, yStart);
      }
    }
    doc.save(`${report.title.replace(/\s+/g, "_")}-summary.pdf`);
  }

  return (
    <div className="bg-white rounded shadow p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-2xl">All Reports</h2>
        <button
          onClick={loadReports}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          disabled={loading}
          title="Refresh report list"
        >Refresh</button>
      </div>
      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-64"
          placeholder="Search reports..."
          value={search}
          onChange={handleSearchChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-800"
        >
          Search
        </button>
      </form>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      {loading ? (
        <div className="p-10 text-center text-slate-500">Loading reports...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-3 py-2 border">Title</th>
                <th className="px-3 py-2 border">Period</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Created</th>
                <th className="px-3 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td className="border p-2 font-semibold">{report.title}</td>
                    <td className="border p-2 text-xs">
                      {new Date(report.periodStart).toLocaleDateString()} – {new Date(report.periodEnd).toLocaleDateString()}
                    </td>
                    <td className="border p-2 capitalize">{report.status}</td>
                    <td className="border p-2">{new Date(report.createdAt).toLocaleDateString()}</td>
                    <td className="border p-2">
                      {report.content ? (
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800"
                          onClick={() => downloadPDF(report)}
                        >
                          Download PDF
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No summary</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">AI Summary Preview:</h3>
            {reports.map(report => (
              report.content &&
              <pre
                key={report._id}
                style={{
                  fontFamily: "Times New Roman, Times, serif",
                  background: "#F7F7F7",
                  padding: "14px",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                  marginBottom: "24px"
                }}
              >
                {report.content}
              </pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
