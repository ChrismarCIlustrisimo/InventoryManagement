import React from 'react';

const SalesByProductReport = ({ product, setProduct, startDate, setStartDate, endDate, setEndDate }) => (
  <>
    <div className="flex flex-col mb-4">
      <label className="mb-2">Product</label>
      <input
        type="text"
        placeholder="Search Product"
        className="border border-gray-300 rounded p-1"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
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

export default SalesByProductReport;
