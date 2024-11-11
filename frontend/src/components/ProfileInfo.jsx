import React, { useState, useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useTheme } from '../context/ThemeContext';
import { GoTriangleDown } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useAuthContext } from '../hooks/useAuthContext';

const ProfileInfo = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [selected, setSelected] = useState('');
  const { toggleTheme } = useTheme();
  const [showButtons, setShowButtons] = useState(false);
  const { darkMode } = useTheme();
  const { user } = useAuthContext();
  const { logout } = useLogout();

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

    const updateDateTime = () => {
      const today = new Date();
      setCurrentDate(formatDate(today));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const onLogout = () => {
    console.log('Logging out...');
    logout();
  };

  const handleThemeChange = () => {
    toggleTheme();
  };

  const handleToggleButtons = () => {
    setShowButtons(!showButtons);
  };

  return (
    <div className='flex items-center gap-3'>
      <p className='text-[#7f8284] min-w-max'>{currentDate}</p>
      <div className='flex items-center justify-center'>
        <p className={`text-m font-medium ${darkMode ? 'text-light-primary' : 'dark:text-dark-primary'}`} style={{ textTransform: 'uppercase' }}>{user.name}</p>
        <button
          className={`text-sm p-2 mr-2 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}
          onClick={handleToggleButtons}
        >
          <GoTriangleDown />
        </button>
        {showButtons && (
          <div className={`absolute right-0 w-36 rounded-md shadow-lg mt-[100px] mr-[42px] ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container dark:text-dark-textPrimary'}`}>
            <button className={`flex items-center justify-start gap-2 px-4 py-2 text-sm ${darkMode ? 'hover:bg-light-border' : 'hover:bg-dark-border'} w-full text-left`}
              onClick={handleThemeChange}
            >
              <IoSunnyOutline />
              Theme
            </button>
            <button className={`flex items-center justify-start gap-2 px-4 py-2 text-sm ${darkMode ? 'hover:bg-light-border' : 'hover:bg-dark-border'} w-full text-left`}
              onClick={onLogout}
            >
              <MdLogout />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
