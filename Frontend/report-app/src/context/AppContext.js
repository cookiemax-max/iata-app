import React, { createContext, useState, useCallback } from 'react';
import { fetchReports, fetchReportStats } from '../api/reportApi';
import { fetchInputsByReport } from '../api/dailyInputApi';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [reportStats, setReportStats] = useState({});
  const [inputs, setInputs] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);

  const [totalReports, setTotalReports] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);

  const refreshReports = useCallback(async (page = 1, search = '') => {
    const { data } = await fetchReports({ page, search });
    setReports(data.reports);
    setTotalReports(data.total);
    setCurrentPage(data.page);
    setPages(data.pages);
    const stats = await fetchReportStats();
    setReportStats(stats.data);
  }, []);

  const refreshInputs = useCallback(async (reportId) => {
    if (!reportId) return;
    const { data } = await fetchInputsByReport(reportId);
    setInputs(inputs => ({ ...inputs, [reportId]: data }));
  }, []);

  return (
    <AppContext.Provider value={{
      reports,
      reportStats,
      inputs,
      selectedReport,
      setSelectedReport,
      totalReports,
      currentPage,
      pages,
      refreshReports,
      refreshInputs,
      setCurrentPage,
      setPages,
      setTotalReports,
    }}>
      {children}
    </AppContext.Provider>
  );
}
