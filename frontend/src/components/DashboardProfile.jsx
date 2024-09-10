import React from 'react';
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { useAdminTheme } from '../context/AdminThemeContext';
import { Link, useLocation } from 'react-router-dom';

const DashboardProfile = () => {
  const { darkMode, toggleTheme } = useAdminTheme();

  return (
    <div className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-4xl `}>
      <button onClick={toggleTheme} className='m-2'>
        {darkMode ? <CiLight c/> : <MdOutlineDarkMode />} 
      </button>
      
      <Link to="/profile">
        <button className={`${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'} m-2`}>
          <BsPersonCircle/>
        </button>
      </Link>
    </div>
  );
};

export default DashboardProfile;
