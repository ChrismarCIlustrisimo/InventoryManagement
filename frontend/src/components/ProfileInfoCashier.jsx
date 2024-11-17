import React, { useState, useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';
import { useTheme } from '../context/ThemeContext';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { IoSunnyOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useAuthContext } from '../hooks/useAuthContext';

const ProfileInfoCashier = () => {
  const [currentDate, setCurrentDate] = useState('');
  const { toggleTheme } = useTheme();
  const [showButtons, setShowButtons] = useState(false);
  const { darkMode } = useTheme();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [showModal, setShowModal] = useState(false);

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
    logout();
    setShowModal(false); // Close the modal after logout
  };

  const handleThemeChange = () => {
    toggleTheme();
  };

  const handleToggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const handleLogoutClick = () => {
    setShowModal(true); // Show confirmation dialog
  };

  const handleCancelLogout = () => {
    setShowModal(false); // Close the confirmation dialog
  };

  const handleConfirmLogout = () => {
    onLogout();
  };

  return (
    <div className='flex items-center gap-3'>
      <p className='text-[#7f8284] min-w-max'>{currentDate}</p>
      <div className='flex items-center justify-center'>
        <p className={`text-m font-medium ${darkMode ? 'text-light-primary' : 'dark:text-dark-primary'}`} style={{ textTransform: 'uppercase' }}>
          {user.role === 'admin' ? 'ADMIN' : 'CASHIER'}
        </p>
        <button
          className={`text-sm p-2 mr-2 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}
          onClick={handleToggleButtons}
        >
          {showButtons ? <GoTriangleUp /> : <GoTriangleDown />}
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
              onClick={handleLogoutClick}
            >
              <MdLogout />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showModal && (
        <div className="h-screen fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'text-dark-textPrimary bg-dark-container'}`}>
            <p className="text-lg mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirmLogout}
                className={`w-[46%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
              >
                Confirm
              </button>
              <button
                onClick={handleCancelLogout}
                className={`w-[46%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCashier;
