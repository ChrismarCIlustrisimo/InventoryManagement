import React from 'react';

const RMASummaryReport = ({ stockStatus, setStockStatus, startDate, setStartDate, endDate, setEndDate, rmaStatus, setRmaStatus }) => (
  <>
    <div className="flex flex-col mb-4">
      <label className="mb-2">Warranty Status</label>
      <select
        className="border border-gray-300 rounded p-1"
        value={stockStatus}
        onChange={(e) => setStockStatus(e.target.value)}
      >
        <option value="">Select Warranty Status</option>
        <option value="under-warranty">Under Warranty</option>
        <option value="expired">Expired</option>
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
    <div className="flex flex-col mb-4">
      <label className="mb-2">RMA Status</label>
      <select
        className="border border-gray-300 rounded p-1"
        value={rmaStatus}
        onChange={(e) => setRmaStatus(e.target.value)}
      >
        <option value="">Select RMA Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  </>
);

export default RMASummaryReport;
