import { IoMdArrowDropdown } from 'react-icons/io';
import React from 'react';

const StatsCard = ({
    title,
    value,
    icon: Icon,
    optionLabel,
    options,
    onOptionSelect,
    selectedOption,
    darkMode,
    toggleDropdown,
    isDropdownOpen,
    onClick,
}) => {
    return (
        <div 
            className={`w-[35%] rounded-lg py-4 flex flex-col gap-2 ${darkMode ? 'bg-light-container' : 'bg-dark-container'} cursor-pointer`} 
            onClick={onClick} // Click handler for the entire card
        >
            <div className='flex items-center justify-between relative w-full px-4'>
                <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-primary bg-light-container1' : 'text-dark-primary bg-dark-container1'}`}>
                    {Icon && <Icon className='text-2xl' />}
                    <div className={`absolute left-0 top-0 h-10 w-2 ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'} rounded-md`}></div>
                </div>
                {options && options.length > 0 && (
                    <div className='relative'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent click event from bubbling up
                                toggleDropdown();
                            }}
                            className={`flex items-center space-x-2 px-2 py-1 rounded-md ${darkMode ? 'text-light-primary' : 'text-dark-primary'} bg-transparent border border-transparent`}
                        >
                            <span>{selectedOption || optionLabel}</span>
                            <IoMdArrowDropdown className={`text-lg ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`} />
                        </button>
                        {isDropdownOpen && (
                            <div className={`absolute right-0 top-full mt-2 w-48 border rounded-md shadow-lg`}>
                                <ul>
                                    {options.map((option) => (
                                        <li
                                            key={option}
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-light-textPrimary hover:bg-dark-primary hover:text-white' : 'dark:text-dark-textPrimary hover:bg-light-primary hover:text-white'}`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent click event from bubbling up
                                                onOptionSelect(option);
                                            }}
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
            <div className={`px-4 ${darkMode ? "text-light-textPrimary" : "text-dark-textPrimary"}`}>
                <p className="text-sm py-2">{title}</p>
                <p className="text-4xl">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;
