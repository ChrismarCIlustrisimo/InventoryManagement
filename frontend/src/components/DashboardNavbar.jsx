import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import light from '../assets/iControlLoginLogo.png';
import dark from '../assets/iControlLight.png';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoMdListBox } from "react-icons/io";
import { PiCashRegisterFill } from "react-icons/pi";
import { IoBagHandle, IoHome } from "react-icons/io5";
import DashboardProfile from './DashboardProfile';

const DashboardNavbar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const { darkMode } = useAdminTheme(); // Access darkMode from context

  useEffect(() => {
    // Update selected state based on current pathname
    if (location.pathname === '/transaction') {
      setSelected('Transaction');
    } else if (location.pathname === '/AdminTransaction') {
      setSelected('Cashier');
    } else if (location.pathname === '/orders') {
      setSelected('Orders');
    } else if (location.pathname === '/dashboard') {
      setSelected('Dashboard');
    } else if (location.pathname === '/sales') {
      setSelected('Sales');
    } else {
      setSelected('');
    }
  }, [location.pathname]);

  return (
    <div className={` ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG' } text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={`${darkMode ? dark : light }`} alt="Logo" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-[50%] gap-4">

        {/* Dashboard Button */}
        <Link to="/dashboard" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Dashboard' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
            onClick={() => setSelected('Dashboard')}
          >
            <IoHome className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Dashboard</span>
          </button>
        </Link>

        {/* Inventory Dropdown */}
        <div className="relative flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Inventory' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
            onClick={() => setSelected('Inventory')}
          >
            <PiCashRegisterFill className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Inventory</span>
          </button>
          {/* Inventory Dropdown Menu */}
          {selected === 'Inventory' && (
            <div className={`absolute top-full left-0 mt-2 w-full bg-${darkMode ? 'light-CARD' : 'dark-CARD'} border border-opacity-50 rounded-lg`}>
              <Link to="/inventory/add" className={`block px-4 py-2 text-sm ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'} hover:bg-gray-200`}>Add Item</Link>
              <Link to="/inventory/view" className={`block px-4 py-2 text-sm ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'} hover:bg-gray-200`}>View Items</Link>
            </div>
          )}
        </div>

        {/* Transaction Button */}
        <Link to="/transaction" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Transaction' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
            onClick={() => setSelected('Transaction')}
          >
            <IoMdListBox className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Transaction</span>
          </button>
        </Link>

        {/* Sales Dropdown */}
        <div className="relative flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Sales' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
            onClick={() => {
              setSelected('Sales');
              setIsSalesDropdownOpen(!isSalesDropdownOpen); // Toggle dropdown visibility
            }}
          >
            <IoBagHandle className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Sales</span>
          </button>
          {/* Sales Dropdown Menu */}
          {isSalesDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-full bg-${darkMode ? 'light-CARD' : 'dark-CARD'} border border-opacity-50 rounded-lg`}>
              <Link to="/sales/report" className={`block px-4 py-2 text-sm ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'} hover:bg-gray-200`}>Sales Report</Link>
              <Link to="/sales/analytics" className={`block px-4 py-2 text-sm ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'} hover:bg-gray-200`}>Sales Analytics</Link>
            </div>
          )}
        </div>

      </div>
      <DashboardProfile className="h-full" />
    </div>
  );
};

export default DashboardNavbar;
