import React from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { useAdminTheme } from '../context/AdminThemeContext';

const ViewSupplier = ({ supplier, onClose }) => {
    const { darkMode } = useAdminTheme();

  return (
    <div className="w-full h-full bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
      <div className={`rounded-lg w-[36%] h-[60%] p-6 ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
        <div className="flex justify-between items-center mb-4 border-b border-gray-400 py-2">
        <p className='w-full font-bold text-3xl'>{supplier.supplier_name}</p>
        <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            <IoCloseOutline size={30} />
          </button>
        </div>
        <div className="space-y-4 py-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className={`text-md font-semibold w-[45%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SUPPLIER ID</span>
            <span className='w-[55%] font-semibold'>{supplier.supplier_id}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-md font-semibold w-[45%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CONTACT NUMBER</span>
            <span className='w-[55%] font-semibold'>{supplier.phone_number}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-md font-semibold w-[45%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CONTACT PERSON</span>
            <span className='w-[55%] font-semibold'>{supplier.contact_person}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-md font-semibold w-[45%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>EMAIL ADDRESS</span>
            <span className='w-[55%] font-semibold'>{supplier.contact_person}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-md font-semibold w-[45%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT CATEGORIES</span>
            <span className='w-[55%] font-semibold'>
                {supplier.categories && Array.isArray(supplier.categories) 
                    ? supplier.categories.reduce((acc, category, index) => {
                        // Every two categories, create a new array for the next line
                        if (index % 2 === 0) acc.push([]);
                        acc[acc.length - 1].push(category);
                        return acc;
                    }, []).map((pair, index) => (
                        <div key={index}>
                        {pair.join(', ')} {/* Join two categories with a separator */}
                        </div>
                    ))
                    : supplier.categories}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-md font-semibold w-[45%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REMARKS</span>
            <span className='w-[55%] font-semibold'>{supplier.remarks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSupplier;
