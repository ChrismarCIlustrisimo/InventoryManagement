import React, { useState, useEffect } from 'react';
import { getInitials } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useTheme } from '../context/ThemeContext';
import { GoTriangleDown } from "react-icons/go";


const ProfileInfo = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [selected, setSelected] = useState('');
  const { toggleTheme } = useTheme();
  const [showButtons, setShowButtons] = useState(false);
  const { darkMode } = useTheme(); // Access darkMode from context

  const handleSelect = (option) => {
    setSelected(option);
  };
  useEffect(() => {
    const formatDate = (date) => {
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      };
      return date.toLocaleString('en-US', options).replace(',', ',').toUpperCase();
    };

    const today = new Date();
    setCurrentDate(formatDate(today));
  }, []);

  const navigate = useNavigate(); // Call useNavigate as a function
  const { logout } = useLogout(); // Import the logout hook from useLogout.js file

  const onLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    logout();
    navigate('/login'); // Redirect to login page
  };
  const handleThemeChange = () => {
    toggleTheme(); // Toggle theme using the context function
  };

  const handleToggleButtons = () => {
    setShowButtons(!showButtons);
  };
  return (
    <div className='flex items-center gap-3'>
      <p className='text-[#7f8284] min-w-max'>{currentDate}</p>
      <div className='flex items-center justify-center'>
      <p className={`text-m font-medium ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`} style={{ textTransform: 'uppercase' }}>John William</p>
        <button
          className={`text-sm p-2 mr-2 ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}
          onClick={handleToggleButtons}
        >
          <GoTriangleDown/>
        </button>
        {showButtons && (
          <div className={`absolute right-0 mt-2 w-36 rounded-md shadow-lg mt-[100px] mr-[42px] ${darkMode ? 'bg-light-CARD text-light-TEXT' : 'dark:bg-dark-CARD dark:text-dark-TEXT'}`}>
            <button className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-light-TABLE' : 'hover:bg-dark-TABLE'} w-full text-left`}
              onClick={onLogout}
            >
              Logout
            </button>
            <button className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-light-TABLE' : 'hover:bg-dark-TABLE'} w-full text-left`}
              onClick={handleThemeChange}
            >
              Theme
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
