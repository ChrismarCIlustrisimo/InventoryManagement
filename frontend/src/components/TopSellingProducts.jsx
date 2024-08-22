// TopSellingProducts.js
import React from 'react';
import { FaCircle } from 'react-icons/fa';
import { GoTriangleRight } from 'react-icons/go';
import { AiFillProduct } from 'react-icons/ai';

const TopSellingProducts = ({ topProducts, darkMode, baseURL, stockColors }) => {
  return (
    <div className={`${darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[40%] rounded-lg px-2`}>
      <div className="w-full h-[15%] flex items-center justify-between px-2">
        <p className={`text-xl ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>Top 5 Selling Products</p>
        <button className={`text-xs flex gap-1 items-center justify-center ${darkMode ? "text-dark-ACCENT" : "text-light-ACCENT"}`}>
          VIEW MORE <GoTriangleRight />
        </button>
      </div>
      <div className="w-full h-[82%] flex flex-col gap-3 overflow-y-auto">
        {topProducts.map((item, index) => {
          const statusColor = stockColors[item.current_stock_status] || "#000000"; // Default to black if status is not found

          return (
            <div key={index} className={`flex items-center justify-start w-full h-[70px] px-2 py-4 gap-4 ${darkMode ? "bg-light-CARD1 border-light-ACCENT" : "bg-dark-CARD1 border-dark-ACCENT"} rounded-md border-b-2`}>
              <img src={`${baseURL}/images/${item.image.substring(14)}`} className="w-14 h-14 object-cover rounded-lg" alt={item.name} />
              <div className="flex flex-col w-[80%]">
                <p className={`text-sm ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.name} </p>
                <div className="flex items-center gap-2 text-sm">
                  <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.category}</p>
                  <FaCircle className={`text-[0.65rem] ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`} />
                  <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.quantity_in_stock} in stock</p>
                  <FaCircle className={`text-[0.65rem] ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`} />
                  <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`} style={{ color: statusColor }}>{item.current_stock_status}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-[10%]">
                <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.sales}</p>
                <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>Sales</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSellingProducts;
