import React, { useState, useEffect } from 'react';
import ReportForm from './ReportForm';

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [showModal]);

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left Section: Logo + Title */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
          I
        </div>
        <span className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
          IATA Weekly Report App
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => handleNavClick('reports')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          Reports
        </button>

        {/* New Report Button */}
        <button
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          + New Report
        </button>

        {/* User Profile */}
        <div className="relative ml-6">
          <button
            className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold hover:ring-2 hover:ring-blue-500 transition"
            title="User Profile"
          >
            U
          </button>
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden flex items-center text-slate-700 hover:text-blue-600 transition"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-4 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg md:hidden z-30 overflow-hidden">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`block w-full text-left px-5 py-3 text-sm font-medium ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavClick('reports')}
            className={`block w-full text-left px-5 py-3 text-sm font-medium ${
              activeTab === 'reports'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            Reports
          </button>
          <button
            className="block w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => setShowModal(true)}
          >
            + New Report
          </button>
          <div className="border-t border-slate-200">
            <button className="block w-full text-left px-5 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600">
              Profile
            </button>
          </div>
        </div>
      )}

      {/* Modal for New Report */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-400 text-3xl font-bold"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <ReportForm
              onSuccess={() => {
                setShowModal(false);
                // Optionally: trigger refresh, notification, etc.
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
