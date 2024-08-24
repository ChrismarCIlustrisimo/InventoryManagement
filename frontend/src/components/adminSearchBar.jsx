import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useAdminTheme } from '../context/AdminThemeContext';

const adminSearchBar = ({ query, onQueryChange }) => {
  const { darkMode } = useAdminTheme(); // Access darkMode from context

  const handleChange = (event) => {
    onQueryChange(event.target.value); // Call the function to update query in parent
  };

  const handleClear = () => {
    onQueryChange(''); // Clear the query in parent
  };

  return (
    <div className={`w-[480px] flex items-center px-4 rounded-md ${darkMode ? 'bg-light-CARD text-light-TEXT' : 'dark:bg-dark-CARD dark:text-dark-TEXT'}`}>
      <input 
        type="text"
        placeholder='Search Products'
        className='w-full text-xs bg-transparent py-[11px] outline-none'
        value={query}
        onChange={handleChange}       
      />
      {query ? (
        <IoMdClose className={`${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'} hover:text-white cursor-pointer`} onClick={handleClear} />
      ) : (
        <FaSearch className={`${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'} hover:text-white cursor-pointer`} />
      )}
    </div>
  );
};

export default adminSearchBar;
