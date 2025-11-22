import React, { useState } from 'react';
import { createReport } from '../api/reportApi';

export default function ReportForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('pending');
  const [content, setContent] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!periodStart || !periodEnd) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(periodEnd) < new Date(periodStart)) {
      setError('End date cannot be before start date.');
      return;
    }
    try {
      await createReport({
        title,
        status,
        periodStart,
        periodEnd,
        content,
      });
      setTitle('');
      setStatus('pending');
      setContent('');
      setPeriodStart('');
      setPeriodEnd('');
      setError(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to create report');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 max-w-lg">
      <h2 className="font-bold mb-2">Create New Report</h2>
      {error && <div className="text-red-500">{error}</div>}
      <input
        type="text"
        placeholder="Report Title"
        className="block w-full mb-2 p-2 border rounded"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <select
        className="block w-full mb-2 p-2 border rounded"
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      {/* Date range fields for periodStart and periodEnd */}
      <div className="mb-2 flex gap-2">
        <div className="flex-1">
          <label className="block font-medium">Start Date</label>
          <input
            type="date"
            className="block w-full p-2 border rounded"
            value={periodStart}
            onChange={e => setPeriodStart(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            className="block w-full p-2 border rounded"
            value={periodEnd}
            onChange={e => setPeriodEnd(e.target.value)}
            required
          />
        </div>
      </div>
      <textarea
        placeholder="Summary (optional)"
        className="block w-full mb-2 p-2 border rounded"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Report
      </button>
    </form>
  );
}
