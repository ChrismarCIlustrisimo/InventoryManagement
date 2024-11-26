import React from 'react';
import { useAdminTheme } from "../context/AdminThemeContext";
import { useAuthContext } from '../hooks/useAuthContext';

const LowStockItems = ({ lowStockItems }) => {
  const { darkMode } = useAdminTheme();
  const { user } = useAuthContext();

  const shortenString = (str) => {
    if (typeof str === 'string') {
      const trimmedStr = str.trim(); 
      if (trimmedStr.length > 36) {
        return trimmedStr.slice(0, 36) + '...'; 
      }
      return trimmedStr; 
    }
    return 'N/A';
  };

  return (
    <div className={`${user.role === "super-admin" ? 'w-[40%]' : 'w-[40%]'} h-full flex gap-4`}>
      <div className={`border border-gray-200 rounded-lg shadow-lg w-full h-full ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
        <div className='w-full px-4 py-2 flex items-center justify-start'>
          <h2 className={`font-semibold text-lg ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`}>Low Stock Items</h2>
        </div>
        <div className={`w-full p-2 flex items-center justify-center h-[90%] rounded-lg ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
          <table className='h-[100%] w-[100%] table-fixed'>
            <thead>
              <tr>
                <th className={`text-left border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`} style={{ width: '80%' }}>
                  Product Name
                </th>
                <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`} style={{ width: '20%' }}>
                  Current Stock Level
                </th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item, index) => (
                <tr key={index}>
                  <td className={`text-left border-b ${darkMode ? 'border-light-border' : 'border-dark-border'}`} style={{ width: '80%' }}>
                    {shortenString(item.name)}
                  </td>
                  <td className={`text-center border-b ${darkMode ? 'border-light-border' : 'border-dark-border'} bg-[#FDD3D0]`} style={{ width: '20%' }}>
                    {item.units.filter(unit => unit.status === 'in_stock').length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LowStockItems;
