import React, { useState, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import RecentReports from './components/RecentReports';
import DailyInputs from './components/DailyInputs';
import ChatSidebar from './components/ChatSidebar';
import AllReports from './components/AllReports'; // You’ll create this soon
import './index.css';
import { AppContext } from './context/AppContext';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const { selectedReport } = useContext(AppContext);

  return (
    <div className="flex min-h-screen h-screen bg-slate-100 text-slate-800">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex flex-col flex-1 min-h-screen h-screen">
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
            {activePage === 'dashboard' && (
              <>
                <section className="mb-8">
                  <DashboardStats />
                </section>
                <div className="flex flex-col gap-8 w-full">
                  <div>
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 flex-1 min-h-[420px]">
                      {selectedReport ? (
                        <DailyInputs reportId={selectedReport._id} />
                      ) : (
                        <div className="text-gray-400 text-center py-20">
                          Please select a report from the list to view details and add daily inputs.
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex-1 overflow-y-auto">
                      <RecentReports />
                    </div>
                  </div>
                </div>
              </>
            )}
            {activePage === 'reports' && (
              <AllReports />
            )}
            {/* Add other routes/pages (e.g., AI) as needed */}
          </main>
          <ChatSidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
