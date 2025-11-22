import React, { useState } from 'react';
import { summarizeReportAndSave } from '../api/aiApi';

export default function SummarizeButton({ reportId, onSummarySaved }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await summarizeReportAndSave(reportId);
      setSummary(res.data.summary);
      if (onSummarySaved) onSummarySaved(res.data.summary); // Optional: For parent to refresh reports
    } catch (err) {
      setSummary('Error getting summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={handleSummarize}
        className="bg-green-600 px-4 py-2 rounded text-white"
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Summarize Inputs'}
      </button>
      {summary && (
        <div className="mt-4 bg-yellow-100 p-3 rounded border">
          <strong>Summary:</strong> {summary}
        </div>
      )}
    </div>
  );
}
