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
  const [isSalesDropdownOpen, setSalesDropdownOpen] = useState(false); // New state for dropdown visibility
  const { darkMode } = useAdminTheme();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/sales') || path.startsWith('/customer')) { // Update this line
      setSelected('Sales');
    } else if (path === '/transaction-list') {
      setSelected('Transaction');
    } else if (path === '/orders') {
      setSelected('Orders');
    } else if (path === '/dashboard') {
      setSelected('Dashboard');
    } else if (path === '/inventory/product') {
      setSelected('Inventory');
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
    <div className={` ${darkMode ? 'bg-light-bg' : 'dark:bg-dark-bg'} text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={`${darkMode ? dark : light}`} alt="Logo" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-[50%] gap-4 items-center">

        {/* Dashboard Button */}
        <Link to="/dashboard" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Dashboard' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` }  rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Dashboard')}
          >
            <IoHome className='text-lg' />
            <span>Dashboard</span>
          </button>
        </Link>

        {/* Inventory Link */}
        <Link to="/inventory/product" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Inventory' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` }  rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Inventory')}
          >
            <PiCashRegisterFill className='text-lg' />
            <span>Inventory</span>
            {/* Badges for stock status */}
            <div className="flex gap-2 absolute top-0 right-4">
              {lowStockCount > 0 && (
                <LowStockBadge badgeContent={lowStockCount} />
              )}
              {outOfStockCount > 0 && (
                <OutOfStockBadge badgeContent={outOfStockCount} />
              )}
            </div>
          </button>
        </Link>

        {/* Transaction Button */}
        <Link to="/transaction-list" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Transaction' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` }  rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Transaction')}
          >
            <IoMdListBox className='text-lg' />
            <span>Transaction</span>
          </button>
        </Link>

        {/* Sales Dropdown */}
        <div className="relative flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Sales' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` }  rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSalesDropdownOpen(prev => !prev)} // Toggle dropdown
          >
            <IoBagHandle className='text-lg' />
            <span>Sales</span>
            {location.pathname.startsWith('/sales') ? (
              <TiArrowSortedUp className='text-lg ml-2' />
            ) : (
              <TiArrowSortedDown className='text-lg ml-2' />
            )}
          </button>
          {isSalesDropdownOpen && ( // Show dropdown based on state
            <div className={`absolute top-full left-0 mt-2 w-full border-none outline-none ${darkMode ? 'bg-white text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'} border border-opacity-50 rounded-lg`}>
              <Link to="/sales" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`} onClick={() => setSalesDropdownOpen(false)}>Sales</Link>
              <Link to="/customer" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`} onClick={() => setSalesDropdownOpen(false)}>Customer</Link>
            </div>
          )}
        </div>
      </div>
      {/* DashboardProfile wrapped in Link */}
      <DashboardProfile />
    </div>
  );
}

export default DashboardNavbar;
