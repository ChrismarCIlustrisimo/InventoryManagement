import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar'; // Assuming SearchBar is in the same directory

const UnitSelectionModal = ({ isOpen, onClose, product, onSelectUnit, image }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useTheme(); // Get darkMode from context
  const baseURL = 'http://localhost:5555';

  if (!isOpen) return null;

  const filteredUnits = product.units.filter(
    (unit) =>
      unit.status === 'in_stock' &&
      unit.serial_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`w-[50%] h-[60%] p-5 rounded-lg shadow-lg ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
        <div className="flex justify-between items-center gap-4">
          {/* Use the SearchBar component */}
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            placeholderMessage="Search Serial Number"
          />
          
          <button onClick={onClose} className={`font-bold text-lg text-white w-[120px] p-2 rounded-lg ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>
            Close
          </button>
        </div>

        <div className="mt-4 w-full h-[90%] flex">
          {/* Left side: product image */}
          <div className="flex flex-col items-center justify-center gap-4 w-[50%] mb-4">
           <h2 className="text-lg font-bold">{product.name}</h2>
           <img src={`${baseURL}/${image}`} alt={product.name} className="w-64 h-64 object-cover rounded-lg" />
          </div>

          {/* Right side: filtered serial numbers */}
          <div className="flex flex-col gap-4 overflow-auto w-[50%] h-[94%]">
            <h2 className="text-lg font-bold w-full text-center">Serial Number</h2>
            {filteredUnits.map((unit) => (
              <div key={unit._id} className={`flex justify-between h-[15%] items-center p-4 rounded-lg shadow-sm ${darkMode ? 'bg-gray-100 text-black' : 'bg-gray-500 text-white'}`}>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm">{unit.serial_number}</p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectUnit(unit)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitSelectionModal;
