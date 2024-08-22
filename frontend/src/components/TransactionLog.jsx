// src/components/TopSellingProducts.jsx

import React from 'react';
import { AiFillProduct } from 'react-icons/ai';
import { GoTriangleRight } from 'react-icons/go';

const TopSellingProducts = ({ topProducts, darkMode }) => {
  return (
    <div className={`${darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[40%] rounded-lg px-2`}>
      <div className="w-full h-[15%] flex items-center justify-between px-2">
        <p className={`text-xl ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>Top 5 Selling Products</p>
        <button className={`text-xs flex gap-1 items-center justify-center ${darkMode ? "text-dark-ACCENT" : "text-light-ACCENT"}`}>
          VIEW MORE <GoTriangleRight />
        </button>
      </div>
      <div className="w-full h-[82%] flex flex-col gap-3 overflow-y-auto">
        {topProducts.map((item, index) => (
          <div key={index} className="flex w-full justify-between items-center border-b py-2 px-2">
            <p className="flex items-center gap-2">
              <AiFillProduct />
              {item.name}
            </p>
            <p>{item.sales}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingProducts;
