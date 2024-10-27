import React from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;
  const { darkMode } = useAdminTheme();

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50`}>
      <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'text-dark-textPrimary bg-dark-container'} `}>
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className={`w-[46%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
            >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className={`w-[46%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
