import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { darkMode } = useTheme(); 

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center px-4 w-full border rounded-lg mt-2">
      <RiLockPasswordLine className="text-xl text-gray-500" />
      <input
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className={`w-full text-sm bg-transparent p-2 pl-3 outline-none ${darkMode ? 'text-light-textPrimary' : 'text-black'}`} // Adjusted text color
        value={value}
        onChange={onChange} 
      />
      {isShowPassword ? (
        <FaRegEyeSlash
          size={20}
          className="cursor-pointer text-gray-600"
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEye
          size={20}
          className="cursor-pointer text-gray-600"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;
