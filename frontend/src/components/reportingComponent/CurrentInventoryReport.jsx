import React from 'react';

const CurrentInventoryReport = ({ stockStatus, setStockStatus }) => (
  <div className="flex flex-col mb-4">
    <label className="mb-2">Stock Status</label>
    <select
      className="border border-gray-300 rounded p-1"
      value={stockStatus}
      onChange={(e) => setStockStatus(e.target.value)}
    >
      <option value="">Select Stock Status</option>
      <option value="in-stock">In Stock</option>
      <option value="out-of-stock">Out of Stock</option>
    </select>
  </div>
);

export default CurrentInventoryReport;
