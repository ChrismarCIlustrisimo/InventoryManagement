import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { GrRefresh } from "react-icons/gr";
import PieChartComponent from '../charts/PieChartComponent';
import { GoTriangleRight } from "react-icons/go";
import demoImage from '../assets/Demo.png'
import { FaCircle } from "react-icons/fa";

const AdminHome = () => {
  const { darkMode } = useAdminTheme();

  const handleRefresh = () => {
    window.location.reload();
  };

  const stockColors = {
    high: '#28a745', // Green
    nearLow: '#fd7e14', // Orange
    low: '#ffc107', // Yellow
    outOfStock: '#dc3545' // Red
  };
  
  const items = [
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'high', stock: 30 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'low', stock: 10 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'nearLow', stock: 5 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'high', stock: 28 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'outOfStock', stock: 0 },

    // Add more items as needed with different statuses
  ];


  return (
    <div className={`${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG'} h-auto flex gap-1`}>
      <DashboardNavbar />
      <div className='h-[100vh] w-[100vw] pt-[70px] px-4 flex flex-col'>

         <div className='w-full h-auto flex justify-between items-center mt-2'>
           <p className={`font-bold text-3xl ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Dashboard</p>
           <button
             onClick={handleRefresh}
             className={`${darkMode ? 'text-light-ACCENT border-light-ACCENT' : 'text-dark-ACCENT border-dark-ACCENT'} text-2xl border px-2 py-2 rounded-lg `}
           >
             <GrRefresh />
           </button>
         </div>

         <div className='flex gap-2 w-full h-[45%] py-2 '>
            <div className={`${darkMode ? 'bg-light-CARD text-light-TEXT' : 'bg-dark-CARD text-dark-TEXT'} w-[60%] rounded-lg px-4 py-2`}>
              <p>Stock Level</p>
              <PieChartComponent />
            </div>
            <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[40%] rounded-lg px-2`}>
              <div className='w-full h-[15%] flex items-center justify-between px-2'>
                  <p className={`text-xl ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>Top 5 selling product</p>
                  <button className={`text-xs flex gap-1 items-center justify-center ${darkMode ? 'text-dark-ACCENT' : 'text-light-ACCENT'}`}>VEIW MORE <GoTriangleRight /></button>
              </div>

              
              <div className='w-full h-[82%] flex flex-col gap-3 overflow-y-auto'>
      {items.map((item, index) => {
        // Determine the color based on the stock status
        const statusColor = stockColors[item.status];

        return (
          <div key={index} className={`flex items-center justify-start w-full h-[70px] px-2 py-4 gap-4 ${darkMode ? 'bg-light-CARD1 border-light-ACCENT' : 'bg-dark-CARD1 border-dark-ACCENT'} rounded-md border-b-2`}>
            <img src={demoImage} className='w-14 h-14 object-cover rounded-lg'/>
            <div className='flex flex-col gap-2'>
              <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.name}</p>
              <div className='flex items-center gap-2'>
                <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>Component</p>
                <FaCircle className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-[0.65rem]`} />
                <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.stock} in stock</p>
                <FaCircle className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-[0.65rem]`} />
                <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`} style={{ color: statusColor }}>
                  {item.status === 'outOfStock' ? 'Out of stock' :
                   item.status === 'low' ? 'Low stock' :
                   item.status === 'nearLow' ? 'Near low stock' : 'High stock'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>

            </div>
         </div>

         <div className='flex gap-2 w-full h-[25%] py-2'>
            <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[35%] rounded-lg`}></div>
            <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[35%] rounded-lg`}></div>
            <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[35%] rounded-lg`}></div>
         </div>

         <div className='flex gap-2 w-full h-[45%] py-2'>
            <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[50%] rounded-lg`}></div>
            <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[50%] rounded-lg`}></div>
         </div>

      </div>
    </div>
  );
};

export default AdminHome;
