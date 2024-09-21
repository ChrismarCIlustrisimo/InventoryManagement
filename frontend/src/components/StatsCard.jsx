import { IoMdArrowDropdown } from 'react-icons/io';
import React from 'react';

const StatsCard = (
    {
    title,
    value,
    icon: Icon, // Rename the icon prop to Icon for clarity
    optionLabel,
    options,
    onOptionSelect,
    selectedOption,
    darkMode,
    toggleDropdown,
    isDropdownOpen,
}) => {

    return (
      <div className={`w-[35%] rounded-lg py-4 flex flex-col gap-2 ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'}`}>
        <div className='flex items-center justify-between relative w-full px-4'>
          <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-ACCENT bg-light-CARD1' : 'text-dark-ACCENT bg-dark-CARD1'}`}>
            {Icon && <Icon className='text-2xl' />} {/* Correctly render the icon */}
            
            <div className={`absolute left-0 top-0 h-10 w-2 ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'} rounded-md`}></div>
          </div>
          {options && options.length > 0 && (
            <div className='relative'>
              <button
                onClick={toggleDropdown}
                className={`flex items-center space-x-2 px-2 py-1 rounded-md ${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'} bg-transparent border border-transparent`}
              >
                <span>{selectedOption || optionLabel}</span>
                <IoMdArrowDropdown className={`text-lg ${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'}`} />
              </button>
              {isDropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-48 border rounded-md shadow-lg`}>
                  <ul>
                    {options.map((option) => (
                      <li
                        key={option}
                        className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-light-TEXT hover:bg-dark-ACCENT hover:text-white' : 'dark:text-dark-TEXT hover:bg-light-ACCENT hover:text-white'}`}
                        onClick={() => onOptionSelect(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={`px-4 ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>
          <p className="text-sm py-2">{title}</p>
          <p className="text-4xl">{value}</p>
        </div>
      </div>
    );
};

export default StatsCard;
