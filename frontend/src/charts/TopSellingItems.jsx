import React from 'react';
import { useAdminTheme } from "../context/AdminThemeContext";
import { useAuthContext } from '../hooks/useAuthContext';

const TopSellingItems = ({topSellingItems}) => {
    const { darkMode } = useAdminTheme();
    const { user } = useAuthContext();

  return (
    <div className={`${user.role === "super-admin" ? 'w-[40%]' : 'w-[60%]'} h-full flex gap-4`}>
      <div className={`border ${darkMode ? 'border-light-border' : 'border-dark-border'} rounded-lg shadow-lg w-full h-full ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
        <div className={`w-full px-4 py-6 flex items-center justify-start h-[10%]`}>
          <h2 className={`font-semibold text-lg ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`}>Top selling items</h2>
        </div>
        <div className={`w-full p-2 flex items-center justify-center h-[90%] rounded-lg ${darkMode ? 'bg-light-container text-light-textPrimary' : 'bg-dark-container text-dark-textPrimary'}`}>
          <table className='h-[100%] w-[100%]'>
            <thead>
              <tr>
                <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>RANK</th>
                <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>Product Name</th>
                <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>Qty. Sold</th>
                <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {topSellingItems.map((item, index) => (
                <tr key={index}>
                  <td className={`text-center border-b ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>{index + 1}</td>
                  <td className={`text-center border-b ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>{item.name}</td>
                  <td className={`text-center border-b ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>{item.sales}</td>
                  <td className={`text-center border-b ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>{`₱ ${(item.sales * item.selling_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopSellingItems;
