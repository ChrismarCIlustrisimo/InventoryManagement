import React from 'react';

const RefundReport = ({ refundReason, setRefundReason, startDate, setStartDate, endDate, setEndDate }) => (
  <>
    <div className="flex flex-col mb-4">
      <label className="mb-2">Reason for Refund</label>
      <select
        className="border border-gray-300 rounded p-1"
        value={refundReason}
        onChange={(e) => setRefundReason(e.target.value)}
      >
        <option value="">Select Refund Reason</option>
        {/* Add refund reasons here */}
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

export default RefundReport;
