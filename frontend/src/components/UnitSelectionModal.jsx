import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const UnitSelectionModal = ({ isOpen, onClose, product, onSelectUnit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useTheme(); // Get darkMode from context

  if (!isOpen) return null;

  const filteredUnits = product.units
    .filter(unit => unit.status === 'in_stock' && 
      unit.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[60%] h-[60%] p-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <IoCloseCircle className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="mt-4 w-full h-[90%] overflow-auto">
          <div className='w-full flex items-center justify-end'>
            <div className={`w-[480px] flex items-center px-4 rounded-md border-2 ${darkMode ? 'bg-light-container text-light-textPrimary border-border' : 'dark:bg-dark-container dark:text-dark-textPrimary border-border'}`}>
              <input
                type="text"
                placeholder="Search by serial number"
                className="w-full text-xs bg-transparent py-[11px] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <IoMdClose className={`${darkMode ? 'text-light-primary' : 'text-dark-primary'} hover:text-white cursor-pointer`} onClick={() => setSearchQuery('')} />
              ) : (
                <FaSearch className={`${darkMode ? 'text-light-primary' : 'text-dark-primary'} hover:text-white cursor-pointer`} />
              )}
            </div>
          </div>


          <h3 className="font-semibold mt-4">Available Units:</h3>
          <ul className="mt-2 grid grid-cols-6 gap-2">
            {filteredUnits.map(unit => (
              <li
                key={unit._id}
                className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded bg-gray-100"
                onClick={() => onSelectUnit(unit)}
              >
                <span>Serial Number: {unit.serial_number}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnitSelectionModal;
