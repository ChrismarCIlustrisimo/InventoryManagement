// src/pages/ReportPage.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';

const ReportPage = () => {
    const location = useLocation();
    const { products } = location.state || { products: [] };
    const [reportTimeFrame, setReportTimeFrame] = useState('');
    const [showReport, setShowReport] = useState(false); // New state to control report visibility
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";

    const handleTimeFrameChange = (e) => {
        setReportTimeFrame(e.target.value);
    };

    const handleGenerateReport = () => {
        if (reportTimeFrame) {
            setShowReport(true); // Show the report after selecting a time frame
        }
    };

    return (
        <div className={`w-full h-full flex items-center justify-center flex-col ${darkMode ? 'bg-light-BG' : 'bg-dark-BG'}`}>
                {!showReport ? (
                    <div className='p-4 flex flex-col items-center justify-centers'>
                    <div className="mb-4 w-full flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-bold mb-4">Generate Report</h1>
                        <label htmlFor="timeFrame" className="text-lg mb-2 text-center">Select Report Time Frame</label>
                        <select
                            id="timeFrame"
                            value={reportTimeFrame}
                            onChange={handleTimeFrameChange}
                            className={`block px-6 py-4 text-sm rounded-lg w-full border ${darkMode ? 'text-light-TEXT border-light-ACCENT bg-light-CARD' : 'text-dark-TEXT border-light-ACCENT bg-dark-CARD'}`}
                        >
                            <option value="">Select Time Frame</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                            <option value="last_week">Last Week</option>
                        </select>
                        <button
                            onClick={handleGenerateReport}
                            className={`mt-4 px-8 py-4 rounded-lg ${darkMode ? 'bg-dark-ACCENT text-light-TEXT' : 'bg-light-ACCENT text-dark-TEXT'}`}
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
                ) : (
                    <div className="p-8 w-full h-full border flex flex-col items-center">
                        <p className="text-4xl font-medium mb-4">Sales Report</p>

                    </div>
                )}
        </div>
    );
};

export default ReportPage;
