import React from 'react';
import { CiLight } from "react-icons/ci";
import { MdOutlineDarkMode } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { useAdminTheme } from '../context/AdminThemeContext';

const DashboardProfile = () => {
  const { darkMode, toggleTheme } = useAdminTheme();

  return (
    <div className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-4xl flex gap-2`}>
      <button onClick={toggleTheme}>
        {darkMode ? <CiLight /> : <MdOutlineDarkMode />}
      </button>
      <button className={`${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'}`}>
        <BsPersonCircle />
      </button>
    </div>
  );
};

export default DashboardProfile;
