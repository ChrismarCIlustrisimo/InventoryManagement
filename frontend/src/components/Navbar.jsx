import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import loginLogo from '../assets/iControlLoginLogo.png';
import { useTheme } from '../context/ThemeContext';
import { AiFillDashboard } from "react-icons/ai";
import { PiCashRegisterFill } from "react-icons/pi";
import { IoBagHandle } from "react-icons/io5";

const Navbar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const { darkMode } = useTheme(); // Access darkMode from context

  useEffect(() => {
    // Update selected state based on current pathname
    if (location.pathname === '/dashboard') {
      setSelected('Dashboard');
    } else if (location.pathname === '/cashier') {
      setSelected('Cashier');
    } else if (location.pathname === '/orders') {
      setSelected('Orders');
    } else {
      setSelected('');
    }
  }, [location.pathname]);

  return (
    <div className={` ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG' } text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={loginLogo} alt="Login" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-[30%] gap-4">
        <Link to="/dashboard" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Dashboard' ? 'border-dark-ACCENT' : 'border-dark-TABLE'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border ${selected === 'Dashboard' ? 'border-primary' : 'border-transparent'} border-opacity-50`}
            onClick={() => setSelected('Dashboard')}
          >
            <AiFillDashboard className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Dashboard</span>
          </button>
        </Link>

        <Link to="/cashier" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Cashier' ? 'border-dark-ACCENT' : 'border-dark-TABLE'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border ${selected === 'Cashier' ? 'border-primary' : 'border-transparent'} border-opacity-50`}
            onClick={() => setSelected('Cashier')}
          >
            <PiCashRegisterFill className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Cashier</span>
          </button>
        </Link>

        <Link to="/orders" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Orders' ? 'border-dark-ACCENT' : 'border-dark-TABLE'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border ${selected === 'Orders' ? 'border-primary' : 'border-transparent'} border-opacity-50`}
            onClick={() => setSelected('Orders')}
          >
            <IoBagHandle className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Order</span>
          </button>
        </Link>

      </div>
      <ProfileInfo />
    </div>
  );
};

export default Navbar;
