import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ProductLoading = () => {
  const { darkMode } = useTheme();

  return (
  <div className={`rounded-lg h-[260px] w-full flex flex-col ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD'} animate-pulse cursor-pointer mr-4`}>
   <div className='w-full'>
        <div className={`w-full h-[120px] bg-gray-300 rounded-lg`} />
      </div>
      <div className={`w-full h-auto p-2 flex-grow ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
        <div className='w-full h-4 bg-gray-300 rounded mb-2' />
      </div>
      <div className={`w-full h-auto p-2 ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
        <div className='flex justify-between items-center'>
          <div className='w-[40%] h-4 bg-gray-300 rounded' />
          <div className='w-[40%] h-4 bg-gray-300 rounded' />
        </div>
      </div>
    </div>
  );
};

export default ProductLoading;
