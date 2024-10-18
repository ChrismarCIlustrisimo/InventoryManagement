import React from 'react';

const WarrantyClaimsReport = ({ customer, setCustomer, startDate, setStartDate, endDate, setEndDate }) => (
  <>
    <div className="flex flex-col mb-4">
      <label className="mb-2">Customer Name</label>
      <input
        type="text"
        placeholder="Enter Customer Name"
        className="border border-gray-300 rounded p-1"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />
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

export default WarrantyClaimsReport;
