import React from 'react';
import { HomeIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline'; // ✅ REMOVED BarChart3Icon

export default function Sidebar({ activePage, setActivePage }) {
  const periodStart = '2025-11-18';
  const periodEnd = '2025-11-24';
  const currentPeriodString = `Period: ${new Date(periodStart).toLocaleDateString()} – ${new Date(periodEnd).toLocaleDateString()}`;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'emissions', label: 'Emissions', icon: <ChartBarIcon className="w-5 h-5" /> }, // ✅ FIXED: ChartBarIcon
    { id: 'ai', label: 'AI Concierge', icon: <SparklesIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-slate-100 flex flex-col h-screen shadow-lg">
      {/* App Title */}
      <div className="flex items-center space-x-2 px-5 py-6 border-b border-slate-800">
        <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          I
        </div>
        <span className="text-lg font-semibold tracking-tight">IATA Reports</span>
      </div>

      {/* Current Reporting Week Indicator */}
      <div className="px-5 py-3 border-b border-slate-800">
        <span className="text-xs text-slate-400">{currentPeriodString}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 flex flex-col">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center w-full text-left px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
              activePage === item.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer / Version Info */}
      <div className="px-5 py-4 border-t border-slate-800 text-xs text-slate-400">
        <p>Version 1.0.0</p>
        <p className="mt-1">© 2025 IATA</p>
      </div>
    </aside>
  );
}
