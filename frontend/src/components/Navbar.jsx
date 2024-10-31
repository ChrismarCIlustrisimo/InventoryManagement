import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import light from '../assets/iControlLoginLogo.png';
import dark from '../assets/iControlLight.png';
import { useTheme } from '../context/ThemeContext';
import { BsFileText } from "react-icons/bs";
import { AiOutlineTag } from "react-icons/ai";
import { BiCalendarCheck } from "react-icons/bi";
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { BiSolidReport } from "react-icons/bi"; // Import report icon
import { GoTriangleDown } from "react-icons/go"; // Import triangle down icon
import { BsArrowRepeat } from "react-icons/bs";

const Navbar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const [isTransactionDropdownOpen, setIsTransactionDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for reporting dropdown
  const { darkMode } = useTheme();

  useEffect(() => {
    if (location.pathname === '/transaction') {
      setSelected('Transaction');
    } else if (location.pathname === '/cashier') {
      setSelected('New Sales');
    } else if (location.pathname === '/orders') {
      setSelected('Orders');
    } else if (location.pathname === '/cashier-rma') {
      setSelected('RMA');
    } else if (location.pathname.includes('/cashier-SalesReport')) {
      setSelected('Reporting');
    } else {
      setSelected('');
    }
  }, [location.pathname]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={`${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'} text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={`${darkMode ? dark : light}`} alt="Login" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-auto gap-4  pl-24">

        <Link to="/cashier" className="flex-1">
          <button
            className={`text-sm p-2 px-3 ${selected === 'New Sales' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('New Sales')}
          >
            <AiOutlineTag className='text-lg' />
            <div className='flex gap-1'>
              <span>New</span>
              <span>Sales</span>
            </div>
          </button>
        </Link>




        {/* Transaction Dropdown */}
        <div className="relative flex-1">
          <button
            className={`text-sm p-2 px-3 rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50 ${
              selected === 'Transaction'
                ? `bg-dark-activeLink ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`
                : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`
            }`}
            onClick={() => {
              setSelected('Transaction');
              setIsTransactionDropdownOpen(!isTransactionDropdownOpen);
            }}
          >
            <BsFileText className="text-lg" />
            <span>Transaction</span>
            {isTransactionDropdownOpen ? (
              <TiArrowSortedUp className="text-lg ml-2" />
            ) : (
              <TiArrowSortedDown className="text-lg ml-2" />
            )}
          </button>

          {isTransactionDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-full border-none outline-none ${darkMode ? 'bg-white text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'} border border-opacity-50 rounded-lg`}>
              <Link to="/transaction" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`}>Transactions</Link>
              <Link to="/refund" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`}>Refund</Link>
            </div>
          )}
        </div>

        <Link to="/orders" className="flex-1">
          <button
            className={`text-sm p-2 px-3 ${selected === 'Orders' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Orders')}
          >
            <BiCalendarCheck className='text-lg' />
            <span>Reservations</span>
          </button>
        </Link>

        {/* RMA Button */}
        <Link to="/cashier-rma" className="flex-1">
          <button
            className={`text-sm p-2 px-3 ${selected === 'RMA' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('RMA')}
          >
            <BsArrowRepeat className='text-lg' />
            <span>RMA</span>
          </button>
        </Link>



        {/* RMA Button */}
        <Link to="/cashier-SalesReport" className="flex-1">
          <button
            className={`text-sm p-2 px-3 ${selected === 'Reporting' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Reporting')}
          >
            <BsArrowRepeat className='text-lg' />
            <span>Reports</span>
          </button>
        </Link>

      </div>
      <ProfileInfo />
    </div>
  );
};

export default Navbar;
