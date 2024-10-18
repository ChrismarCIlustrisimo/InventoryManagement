import React from 'react';

const LowStockReport = ({ stockStatus, setStockStatus }) => (
  <div className="flex flex-col mb-4">
    <label className="mb-2">Product Category</label>
    <select
      className="border border-gray-300 rounded p-1"
      value={stockStatus}
      onChange={(e) => setStockStatus(e.target.value)}
    >
      <option value="">Select Category</option>
    </select>
  </div>
);

export default LowStockReport;
