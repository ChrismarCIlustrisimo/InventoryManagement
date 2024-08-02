import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileInfo from './ProfileInfo';
import light from '../assets/iControlLoginLogo.png';
import dark from '../assets/iControlLight.png';
import { useTheme } from '../context/ThemeContext';
import { IoMdListBox } from "react-icons/io";
import { PiCashRegisterFill } from "react-icons/pi";
import { IoBagHandle } from "react-icons/io5";

const Navbar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState('');
  const { darkMode } = useTheme(); // Access darkMode from context

  useEffect(() => {
    // Update selected state based on current pathname
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
    <div className={` ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG' } text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10`}>
      <img src={`${darkMode ? dark : light }`} alt="Login" className='w-[10%] my-2 ml-8' />
      <div className="flex rounded w-[30%] gap-4">


        <Link to="/cashier" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Cashier' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
            onClick={() => setSelected('Cashier')}
          >
            <PiCashRegisterFill className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Cashier</span>
          </button>
        </Link>

        <Link to="/orders" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Orders' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
            onClick={() => setSelected('Orders')}
          >
            <IoBagHandle className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Order</span>
          </button>
        </Link>

        <Link to="/transaction" className="flex-1">
          <button
            className={`text-sm p-2 ${selected === 'Transaction' ? 'border-dark-ACCENT' : 'border-none'} ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } rounded-[24px] w-full flex items-center justify-center gap-2 border border-opacity-50`}
            onClick={() => setSelected('Transaction')}
          >
            <IoMdListBox className='text-dark-ACCENT text-lg' />
            <span className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Transaction</span>
          </button>
        </Link>


      </div>
      <ProfileInfo />
    </div>
  );
};

export default Navbar;
