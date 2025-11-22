import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardStats() {
  const { reportStats, refreshReports } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const filteredStats = () => {
    if (statusFilter === 'all') return reportStats;
    return reportStats;
  };

  if (!reportStats) return <div className="text-slate-500">Loading...</div>;

  return (
    <section className="mb-8">
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-600">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Reports"
          value={filteredStats().total ?? 0}
          icon={<ClipboardDocumentListIcon className="w-8 h-8 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="In Progress"
          value={filteredStats().inProgress ?? 0}
          icon={<ClockIcon className="w-8 h-8 text-yellow-500" />}
          color="bg-yellow-50"
        />
        <StatCard
          title="Completed"
          value={filteredStats().completed ?? 0}
          icon={<CheckCircleIcon className="w-8 h-8 text-green-600" />}
          color="bg-green-50"
        />
      </div>
    </section>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`flex items-center justify-between p-6 rounded-lg shadow-sm border border-slate-200 ${color}`}
    >
      <div>
        <p className="text-sm text-slate-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className="flex-shrink-0">{icon}</div>
    </div>
  );
}