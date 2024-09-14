import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Spinner = () => {
  const { darkMode } = useTheme();

  return (
    <div className='w-[80%] h-[76vh] flex flex-col gap-4 overflow-y-auto scrollbar-custom'>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`rounded-lg p-4 flex gap-4 ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} animate-pulse`}
        >
          <div
            className={`flex items-center justify-center p-4 w-[15%] border-r-2 ${darkMode ? 'border-dark-ACCENT' : 'border-dark-ACCENT'}`}
          >
            <div className={`w-1/2 h-4 ${darkMode ? 'bg-light-TABLE' : 'bg-dark-TABLE'} rounded`}></div>
          </div>
          <div className='flex justify-between items-center w-[85%]'>
            <div className='p-4 w-[70%] flex flex-col gap-1'>
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className={`w-3/4 h-4 ${darkMode ? 'bg-dark-TEXT' : 'bg-light-TABLE'} rounded`}></div>
              ))}
            </div>
            <div className={`flex gap-6 w-[50%] justify-between ${darkMode ? 'text-light-TABLE' : 'text-dark-TABLE'}`}>
              <div className='flex flex-col gap-1'>
                <div className={`w-24 h-4 ${darkMode ? 'bg-dark-TEXT' : 'bg-light-TABLE'} rounded`}></div>
                <div className={`w-24 h-4 ${darkMode ? 'bg-dark-TEXT' : 'bg-light-TABLE'} rounded`}></div>
                <div className={`w-24 h-4 ${darkMode ? 'bg-dark-TEXT' : 'bg-light-TABLE'} rounded`}></div>
              </div>
              <div className='flex flex-col gap-1'>
                <div className={`w-24 h-4 ${darkMode ? 'bg-dark-TEXT' : 'bg-light-TABLE'} rounded`}></div>
                <div className={`w-24 h-4 ${darkMode ? 'bg-dark-TEXT' : 'bg-light-TABLE'} rounded`}></div>
                <div className={`w-24 h-4 ${darkMode ? 'bg-dark-TEXT' : 'bg-light-TABLE'} rounded`}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Spinner;
