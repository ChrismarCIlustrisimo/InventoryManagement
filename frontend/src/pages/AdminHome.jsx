import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { GrRefresh } from "react-icons/gr";
import PieChartComponent from '../charts/PieChartComponent'

const AdminHome = () => {
  const { darkMode } = useAdminTheme();

  return (
    <div className={`${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG'} h-auto flex gap-1`}>
      <DashboardNavbar />
      <div className='h-[100vh] w-[100vw] pt-[70px] px-4 flex flex-col'>

         <div className='w-full h-auto flex justify-between items-center mt-2'>
           <p className={`font-bold text-3xl ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Dashboard</p>
           <button className={`${darkMode ? 'text-light-ACCENT border-light-ACCENT' : 'text-dark-ACCENT border-dark-ACCENT'} text-2xl border px-2 py-2 rounded-lg `}>
            <GrRefresh />
           </button>
         </div>

         <div className='flex gap-2 w-full h-[45%] py-2'>
            <div className={`${darkMode ? 'bg-light-CARD text-light-TEXT' : 'bg-dark-CARD text-dark-TEXT'} w-[60%] rounded-lg px-4 py-2`}>
              <p>Stock Level</p>
              <PieChartComponent />
            </div>
            <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[40%] rounded-lg`}></div>
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
