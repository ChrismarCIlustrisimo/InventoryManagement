import React from 'react';

const SalesReport = ({ period, setPeriod, startDate, setStartDate, endDate, setEndDate }) => (
  <>
    <div className="flex flex-col mb-4">
      <label className="mb-2">Period</label>
      <select
        className="border border-gray-300 rounded p-1"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        <option value="">Select Period</option>
        <option value="today">Today</option>
        <option value="this-week">This Week</option>
        <option value="this-month">This Month</option>
        <option value="this-year">This Year</option>
      </select>
    </div>
    <div className="flex flex-col mb-4">
      <label className="mb-2">Date Range</label>
      <div className='flex items-center justify-center gap-6'>
        <input
          type="date"
          className="border border-gray-300 rounded p-1"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 rounded p-1"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  </>
);

export default SalesReport;
