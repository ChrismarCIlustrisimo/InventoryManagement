import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import light from '../assets/iControlLoginLogo.png';
import dark from '../assets/iControlLight.png';
import { useAdminTheme } from '../context/AdminThemeContext';
import { PiCubeBold } from "react-icons/pi";
import { RiDashboard2Line } from "react-icons/ri";
import { BiSolidReport } from "react-icons/bi";
import { BsArrowRepeat } from "react-icons/bs";
import DashboardProfile from './DashboardProfile';
import { useAuthContext } from '../hooks/useAuthContext';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { BiReceipt } from "react-icons/bi";
import { GoTriangleDown } from "react-icons/go";

// Styled Badge components with custom colors
const LowStockBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: '#d39e00', // Darker Yellow for LOW STOCK
  },
}));

const OutOfStockBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: '#c82333', // Darker Red for OUT OF STOCK
  },
}));

const DashboardNavbar = () => {
  const { user } = useAuthContext();
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [products, setProducts] = useState([]); // Define products state
  const baseURL = 'http://localhost:5555';
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const { darkMode } = useAdminTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/sales') || path.startsWith('/customer')) {
      setSelected('Sales');
    } else if (path === '/transaction-list') {
      setSelected('Transaction');
    } else if (path === '/orders') {
      setSelected('Orders');
    } else if (path === '/dashboard') {
      setSelected('Dashboard');
    } else if (path === '/inventory/product') {
      setSelected('Inventory');
    } else if (path === '/rma') {
      setSelected('RMA');
    } else if (path === '/SalesReport' || path === '/InventoryReport' || path === '/RMAReport' ) {
      setSelected('Reports');
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
      if (!Array.isArray(productData)) {
        console.error('Expected product data to be an array');
        return; // Exit if the product data is not an array
      }

      // Update stock status based on available units using product-specific thresholds
      const updatedProducts = productData.map(product => {
        const availableUnits = product.units.filter(unit => unit.status === 'in_stock').length;
        const { low_stock_threshold, near_low_stock_threshold } = product;

        let stockStatus = 'IN STOCK';
        if (availableUnits === 0) {
          stockStatus = 'OUT OF STOCK';
        } else if (availableUnits <= low_stock_threshold) {
          stockStatus = 'LOW';
        } else if (availableUnits <= near_low_stock_threshold) {
          stockStatus = 'NEAR LOW';
        }

        return {
          ...product,
          current_stock_status: stockStatus,
        };
      });

      // Count low and out of stock products
      const lowStockProducts = updatedProducts.filter(product => product.current_stock_status === "LOW").length;
      const outOfStockProducts = updatedProducts.filter(product => product.current_stock_status === "OUT OF STOCK").length;

      setLowStockCount(lowStockProducts);
      setOutOfStockCount(outOfStockProducts);
      setProducts(updatedProducts); // Update the state with the new products

    } catch (error) {
      console.error('Error fetching updated products:', error);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchUpdatedProducts();
    }
  }, [user, location.pathname]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown visibility
  };

  return (
    <div className={` ${darkMode ? 'bg-light-bg' : 'dark:bg-dark-bg'} text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={`${darkMode ? dark : light}`} alt="Logo" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-[50%] gap-4 items-center">
        {/* Dashboard Button */}
        <Link to="/dashboard" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Dashboard' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` } rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Dashboard')}
          >
            <RiDashboard2Line className='text-lg' />
            <span>Dashboard</span>
          </button>
        </Link>

        {/* Inventory Link */}
        <Link to="/inventory/product" className="flex-1 relative">
          <button
            className={`text-sm p-2 ${selected === 'Inventory' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` } rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Inventory')}
          >
            <PiCubeBold className='text-lg' />
            <span>Inventory</span>
            {/* Badges for stock status */}
            <div className="flex gap-6 absolute top-0 right-2">
              {lowStockCount > 0 && (
                <LowStockBadge badgeContent={lowStockCount} color="error" />
              )}
              
              {/*{outOfStockCount > 0 && (
                <OutOfStockBadge badgeContent={outOfStockCount} color="error" />
              )}*/}

            </div>
          </button>
        </Link>

        {/* Sales Button */}
        <Link to="/sales" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Sales' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` } rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Sales')}
          >
            <BiReceipt className='text-lg' />
            <span>Sales</span>
          </button>
        </Link>

        {/* RMA Button */}
        <Link to="/rma" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'RMA' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` } rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('RMA')}
          >
            <BsArrowRepeat className='text-lg' />
            <span>RMA</span>
          </button>
        </Link>

        {/* Reports Button (Dropdown) */}
        <div className="relative flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Reports' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` } rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={toggleDropdown}
          >
            <BiSolidReport className='text-lg' />
            <span>Reports</span>
            <GoTriangleDown className={`text-lg transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>
          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className={`absolute z-100 bg-white rounded-md shadow-lg mt-1 w-full ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
              <Link to="/SalesReport">
                <div className={`text-sm p-2 z-100 ${selected === 'Reports' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'} ` } w-full flex items-center justify-center gap-2 border  ${darkMode ? 'hover:bg-light-primary hover:text-dark-textPrimary' : 'hover:bg-dark-primary hover:text-light-textPrimary'}`}>
                  Sales Report
                </div>
              </Link>
              <Link to="/InventoryReport">
              <div className={`text-sm p-2 z-50 ${selected === 'Reports' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'} ` } w-full flex items-center justify-center gap-2 border  ${darkMode ? 'hover:bg-light-primary hover:text-dark-textPrimary' : 'hover:bg-dark-primary hover:text-light-textPrimary'}`}>
              Inventory Report
                </div>
              </Link>
              <Link to="/RMAReport">
              <div className={`text-sm p-2 z-50 ${selected === 'Reports' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'} ` } w-full flex items-center justify-center gap-2 border  ${darkMode ? 'hover:bg-light-primary hover:text-dark-textPrimary' : 'hover:bg-dark-primary hover:text-light-textPrimary'}`}>
              RMA Report
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <DashboardProfile />
    </div>
  );
};

export default DashboardNavbar;
