import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createDailyInput } from '../api/dailyInputApi';
import { AppContext } from '../context/AppContext';
import SummarizeButton from './SummarizeButton';
import { CalendarIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function DailyInputs({ reportId }) {
  const { inputs, refreshInputs } = useContext(AppContext);

  const [input, setInput] = useState('');
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState('');

  useEffect(() => {
    refreshInputs(reportId);
  }, [reportId, refreshInputs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Input is required.');
      return;
    }
    setError('');
    await createDailyInput({ reportId, date, input });
    setInput('');
    refreshInputs(reportId);
  };

  // (Optional) Refresh summaries/reports after summarize
  const handleSummarySaved = () => {
    refreshInputs(reportId);
    // If you also want to refresh overall report data, call that here as well (e.g., props.refreshReports())
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <PencilSquareIcon className="w-6 h-6 text-blue-600" />
          <span>Daily Input</span>
        </h2>
        {/* Only pass reportId now */}
        <SummarizeButton reportId={reportId} onSummarySaved={handleSummarySaved} />
      </div>

      {/* Input Form: stacked for focus */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-6">
        <div>
          <label className="text-sm font-semibold flex items-center mb-1">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Date
          </label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-semibold flex items-center mb-2">
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            Daily Note or Activity
          </label>
          <textarea
            className="w-full min-h-[120px] md:min-h-[180px] border border-slate-300 rounded-md p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your daily note or activity..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-2 rounded text-lg font-semibold hover:bg-blue-700 transition"
        >
          Save
        </button>
        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}
      </form>

      {/* Daily Inputs List */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Saved Entries</h3>
        <ul className="max-h-56 overflow-y-auto space-y-2 pr-1">
          {(inputs[reportId] || []).length === 0 && (
            <li className="text-slate-400 text-sm italic">No entries yet.</li>
          )}
          {(inputs[reportId] || []).map((item) => (
            <li
              key={item._id}
              className="bg-slate-50 border border-slate-200 rounded-md p-3 hover:bg-blue-50 transition"
            >
              <div className="text-xs text-slate-500 mb-1">
                {new Date(item.date).toLocaleDateString()}
              </div>
              <div className="text-slate-800 text-sm leading-snug">{item.input}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
