import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import light from '../assets/iControlLoginLogo.png';
import dark from '../assets/iControlLight.png';
import { useTheme } from '../context/ThemeContext';
import { BsFileText } from "react-icons/bs";
import { AiOutlineTag } from "react-icons/ai";
import { BiCalendarCheck } from "react-icons/bi";
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { BsArrowRepeat } from "react-icons/bs";
import ProfileInfoCashier from './ProfileInfoCashier';

const Navbar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const [isTransactionDropdownOpen, setIsTransactionDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for reporting dropdown
  const { darkMode } = useTheme();

  useEffect(() => {
    if (location.pathname === '/transaction' || location.pathname === `/refund`) {
      setSelected('Transaction');
    } else if (location.pathname === '/cashier') {
      setSelected('New Sales');
    } else if (location.pathname === '/orders') {
      setSelected('Orders');
    } else if (location.pathname === '/cashier-rma') {
      setSelected('RMA');
    } else if (location.pathname.includes('/cashier-sales-report')) {
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
      <img src={`${darkMode ? dark : light}`} alt="Login" className='w-[10%] my-2 ml-8' id="navbar-logo"/>
      <div className="flex rounded w-auto gap-4 pl-24">

        <Link to="/cashier" className="flex-1" id="new-sales-link">
          <button
            className={`text-sm p-2 px-3 ${selected === 'New Sales' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('New Sales')}
            id="new-sales-button"
          >
            <AiOutlineTag className='text-lg' id="new-sales-icon"/>
            <div className='flex gap-1'>
              <span>New</span>
              <span>Sales</span>
            </div>
          </button>
        </Link>

        {/* Transaction Dropdown */}
        <div className="relative flex-1" id="transaction-dropdown">
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
            id="transaction-button"
          >
            <BsFileText className="text-lg" id="transaction-icon"/>
            <span>Transaction</span>
            {isTransactionDropdownOpen ? (
              <TiArrowSortedUp className="text-lg ml-2" id="dropdown-up"/>
            ) : (
              <TiArrowSortedDown className="text-lg ml-2" id="dropdown-down"/>
            )}
          </button>

          {isTransactionDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-full border-none outline-none ${darkMode ? 'bg-white text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'} border border-opacity-50 rounded-lg`} id="transaction-dropdown-options">
              <Link to="/transaction" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`} id="transaction-option">Transactions</Link>
              <Link to="/refund" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`} id="refund-option">Refund</Link>
            </div>
          )}
        </div>

        <Link to="/orders" className="flex-1" id="orders-link">
          <button
            className={`text-sm p-2 px-3 ${selected === 'Orders' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Orders')}
            id="orders-button"
          >
            <BiCalendarCheck className='text-lg' id="orders-icon"/>
            <span>Reservations</span>
          </button>
        </Link>

        {/* RMA Button */}
        <Link to="/cashier-rma" className="flex-1" id="rma-link">
          <button
            className={`text-sm p-2 px-3 ${selected === 'RMA' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('RMA')}
            id="rma-button"
          >
            <BsArrowRepeat className='text-lg' id="rma-icon"/>
            <span>RMA</span>
          </button>
        </Link>

        {/* Reporting Button */}
        <Link to="/cashier-sales-report" className="flex-1" id="reporting-link">
          <button
            className={`text-sm p-2 px-3 ${selected === 'Reporting' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Reporting')}
            id="reporting-button"
          >
            <BsArrowRepeat className='text-lg' id="reporting-icon"/>
            <span>Reports</span>
          </button>
        </Link>

      </div>
      <ProfileInfoCashier />
    </div>
  );
};

export default Navbar;
