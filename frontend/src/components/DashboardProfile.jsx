import React from 'react';
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { useAdminTheme } from '../context/AdminThemeContext';
import { Link } from 'react-router-dom';

const DashboardProfile = () => {
  const { darkMode, toggleTheme } = useAdminTheme();

  return (
    <div className={`${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} text-4xl`}>
      <button onClick={toggleTheme} className='m-2'>
        {darkMode ? (
          <CiLight className={darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} />
        ) : (
          <MdOutlineDarkMode className={darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} />
        )}
      </button>
      
      <Link to="/profile">
        <button className={`${darkMode ? 'text-light-primary' : 'text-dark-primary'} m-2`}>
          <BsPersonCircle />
        </button>
      </Link>
    </div>
  );
};

export default DashboardProfile;
