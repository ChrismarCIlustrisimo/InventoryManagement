import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import light from '../assets/iControlLoginLogo.png';
import dark from '../assets/iControlLight.png';
import { useTheme } from '../context/ThemeContext';
import { IoMdListBox } from "react-icons/io";
import { PiCashRegisterFill } from "react-icons/pi";
import { IoBagHandle } from "react-icons/io5";
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';

const Navbar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const [isTransactionDropdownOpen, setIsTransactionDropdownOpen] = useState(false); // New state for transaction dropdown
  const { darkMode } = useTheme();

  useEffect(() => {
    if (location.pathname === '/transaction') {
      setSelected('Transaction');
    } else if (location.pathname === '/cashier') {
      setSelected('Cashier');
    } else if (location.pathname === '/orders') {
      setSelected('Orders');
    } else {
      setSelected('');
    }
  }, [location.pathname]);

  return (
    <div className={` ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container' } text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={`${darkMode ? dark : light }`} alt="Login" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-[30%] gap-4">

        <Link to="/cashier" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Cashier' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` }  rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Cashier')}
          >
            <PiCashRegisterFill className='text-lg' />
            <span>Cashier</span>
          </button>
        </Link>

        <Link to="/orders" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Orders' ? `bg-light-activeLink border-none ${darkMode ? 'text-light-primary' : 'text-dark-primary'}` : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}` }  rounded-[24px] w-full flex items-center justify-center gap-2 border`}
            onClick={() => setSelected('Orders')}
          >
            <IoBagHandle className='text-lg' />
            <span>Order</span>
          </button>
        </Link>

        {/* Transaction Dropdown */}
        <div className="relative flex-1">
        <button
            className={`text-sm p-2 rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50 ${
              selected === 'Transaction'
                ? `bg-dark-activeLink ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`
                : `bg-transparent ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`
            }`}
            onClick={() => {
              setSelected('Transaction');
              setIsTransactionDropdownOpen(!isTransactionDropdownOpen);
            }}
          >
            <IoMdListBox className="text-lg" />
            <span>Transaction</span>
            {isTransactionDropdownOpen ? (
              <TiArrowSortedUp className="text-lg ml-2" />
            ) : (
              <TiArrowSortedDown className="text-lg ml-2" />
            )}
          </button>


          {isTransactionDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-full border-none outline-none ${darkMode ? 'bg-white text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'} border border-opacity-50 rounded-lg`}>
              <Link to="/transaction" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`}>Transaction List</Link>
              <Link to="/transaction/warranty" className={`block px-4 py-2 text-sm hover:text-white ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary' : 'dark:text-dark-textPrimary hover:bg-blue-600'}`}>Warranty</Link>
            </div>
          )}
        </div>

      </div>
      <ProfileInfo />
    </div>
  );
};

export default Navbar;
