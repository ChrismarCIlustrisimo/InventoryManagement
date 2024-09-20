import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import light from '../assets/iControlLoginLogo.png';
import dark from '../assets/iControlLight.png';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoMdListBox } from "react-icons/io";
import { PiCashRegisterFill } from "react-icons/pi";
import { IoBagHandle, IoHome } from "react-icons/io5";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import DashboardProfile from './DashboardProfile';
import { useAuthContext } from '../hooks/useAuthContext';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

// Styled Badge components with custom colors
const LowStockBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: 'yellow', // Custom color for LOW STOCK
  },
}));

const OutOfStockBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: '#dc3545', // Custom color for OUT OF STOCK
  },
}));

const DashboardNavbar = () => {
  const { user } = useAuthContext();
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const baseURL = 'http://localhost:5555';
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const { darkMode } = useAdminTheme();

  useEffect(() => {
    if (location.pathname === '/transaction') {
      setSelected('Transaction');
    } else if (location.pathname === '/transaction-list') {
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

  const fetchUpdatedProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const productData = response.data.data;

      const lowStockProducts = productData.filter(product => product.current_stock_status === "LOW").length;
      const outOfStockProducts = productData.filter(product => product.current_stock_status === "OUT OF STOCK").length;

      setLowStockCount(lowStockProducts);
      setOutOfStockCount(outOfStockProducts);
    } catch (error) {
      console.error('Error fetching updated products:', error);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchUpdatedProducts();
    }
  }, [user]);

  return (
    <div className={` ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG' } text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={`${darkMode ? dark : light }`} alt="Logo" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-[50%] gap-4 items-center">

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
          <Tooltip title="Inventory" arrow>
            <button
              className={`text-sm p-2 px-4 relative ${selected === 'Inventory' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
              onClick={() => {
                setSelected('Inventory');
                setIsInventoryDropdownOpen(!isInventoryDropdownOpen);
              }}
            >
              <PiCashRegisterFill className='text-dark-ACCENT text-lg' />
              <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Inventory</span>
              {isInventoryDropdownOpen ? (
                <TiArrowSortedUp className='text-dark-ACCENT text-lg ml-2' />
              ) : (
                <TiArrowSortedDown className='text-dark-ACCENT text-lg ml-2' />
              )}
              {/* Badges for stock status */}
              <div className="flex gap-5 absolute top-0 right-[10px]">
                {lowStockCount > 0 && (
                  <LowStockBadge badgeContent={lowStockCount} color="warning" />
                )}
                {outOfStockCount > 0 && (
                  <OutOfStockBadge badgeContent={outOfStockCount} color="error" />
                )}
              </div>
            </button>
          </Tooltip>
          {isInventoryDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-full border-none outline-none ${darkMode ? 'bg-white text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'} border border-opacity-50 rounded-lg`}>
              <Link to="/inventory/product" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-TEXT hover:bg-dark-ACCENT' : 'dark:text-dark-TEXT hover:bg-blue-600'}`}>
                Product List 
                <div className="flex gap-5 absolute top-0 right-[10px]">
                  {lowStockCount > 0 && (
                    <LowStockBadge badgeContent={lowStockCount} color="warning" />
                  )}
                  {outOfStockCount > 0 && (
                    <OutOfStockBadge badgeContent={outOfStockCount} color="error" />
                  )}
              </div>
              </Link>
              <Link to="/inventory/supplier" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-TEXT hover:bg-dark-ACCENT' : 'dark:text-dark-TEXT hover:bg-blue-600'}`}>Supplier List</Link>
            </div>
          )}
        </div>

        {/* Transaction Button */}
        <Link to="/transaction-list" className="flex-1">
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
              setIsSalesDropdownOpen(!isSalesDropdownOpen);
            }}
          >
            <IoBagHandle className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Sales</span>
            {isSalesDropdownOpen ? (
              <TiArrowSortedUp className='text-dark-ACCENT text-lg ml-2' />
            ) : (
              <TiArrowSortedDown className='text-dark-ACCENT text-lg ml-2' />
            )}
          </button>
          {isSalesDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-full border-none outline-none ${darkMode ? 'bg-white text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'} border border-opacity-50 rounded-lg`}>
              <Link to="/sales" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-TEXT hover:bg-dark-ACCENT' : 'dark:text-dark-TEXT hover:bg-blue-600'}`}>Sales</Link>
              <Link to="/customer" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-TEXT hover:bg-dark-ACCENT' : 'dark:text-dark-TEXT hover:bg-blue-600'}`}>Customer</Link>
            </div>
          )}
        </div>

      </div>
      {/* DashboardProfile wrapped in Link */}
        <DashboardProfile />
    </div>
  );
};

export default DashboardNavbar;
