import React, { useState } from 'react';

const StockLevel = () => {
  const [totalStock, setTotalStock] = useState(12);
  const [lowStock, setLowStock] = useState(2);
  const [nearLowStock, setNearLowStock] = useState(8);

  return (
    <div className="border-2 border-dotted border-blue-400 p-4 rounded-lg w-64">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Stock Level</h2>
        <div className="bg-green-400 text-white px-2 py-1 rounded-full text-sm">
          Total stock {totalStock}
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className="text-gray-500 text-sm">LOW STOCK</h3>
        <input
          type="number"
          value={lowStock}
          onChange={(e) => setLowStock(Number(e.target.value))}
          className="w-full p-1 text-xl font-bold border border-gray-300 rounded"
        />
      </div>
      
      <div className="mb-2">
        <h3 className="text-gray-500 text-sm">NEAR LOW STOCK</h3>
        <input
          type="number"
          value={nearLowStock}
          onChange={(e) => setNearLowStock(Number(e.target.value))}
          className="w-full p-1 text-xl font-bold border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <h3 className="text-gray-500 text-sm">TOTAL STOCK</h3>
        <input
          type="number"
          value={totalStock}
          onChange={(e) => setTotalStock(Number(e.target.value))}
          className="w-full p-1 text-xl font-bold border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default StockLevel;
