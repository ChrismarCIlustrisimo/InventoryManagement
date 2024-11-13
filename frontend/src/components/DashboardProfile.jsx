import React from 'react';
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { useAdminTheme } from '../context/AdminThemeContext';
import { Link } from 'react-router-dom';

const DashboardProfile = () => {
  const { darkMode, toggleTheme } = useAdminTheme();

  return (
    <div className={`flex items-center justify-center ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} text-4xl`}>
      <button 
        onClick={toggleTheme} 
        className='m-2 transform transition-transform duration-200 hover:scale-125'
      >
        {darkMode ? (
          <CiLight className={darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} />
        ) : (
          <MdOutlineDarkMode className={darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} />
        )}
      </button>
      
      <Link 
        to="/profile" 
        className='flex items-center justify-center transform transition-transform duration-200 hover:scale-110'
      >
        <BsPersonCircle className={`${darkMode ? 'text-light-primary' : 'text-dark-primary'} m-2`} />
        <p 
          className={`text-2xl font-medium ${darkMode ? 'text-light-primary' : 'dark:text-dark-primary'}`} 
          style={{ textTransform: 'uppercase' }}
        >
          SUPER ADMIN
        </p>
      </Link>
    </div>
  );
};

export default DashboardProfile;
