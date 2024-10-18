import React, { useState } from 'react';
import { useAdminTheme } from "../context/AdminThemeContext";

const DateRangeModal = ({ isOpen, onClose, onConfirm }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { darkMode } = useAdminTheme();

  const handleConfirm = () => {
    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage('Start date cannot be later than end date');
      return;
    }

    // Clear error message
    setErrorMessage('');

    // Pass dates back to parent component
    onConfirm(startDate, endDate);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className={`rounded-lg p-6 w-[25%] ${darkMode ? 'bg-light-container text-light-primary' : 'dark:bg-dark-container text-dark-primary'}`}>
          <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>

          <div className="flex flex-col mb-4">
            <label className="mb-2">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
              max={new Date().toISOString().split('T')[0]} // Disable future dates
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-2">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
              min={startDate} // Ensure end date is after start date
              max={new Date().toISOString().split('T')[0]} // Disable future dates
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 mb-4">{errorMessage}</div>
          )}

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="bg-gray-400 text-white p-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="bg-blue-600 text-white p-2 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DateRangeModal;
