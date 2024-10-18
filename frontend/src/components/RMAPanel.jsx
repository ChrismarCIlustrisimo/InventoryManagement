import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext'; // Using theme context for dark mode support
import { BsArrowRepeat } from "react-icons/bs";

const RMAPanel = ({ transaction, onClose }) => {
  const { darkMode } = useAdminTheme();
  const [otherReason, setOtherReason] = useState(''); // To manage input for "Other" reason
  const [notes, setNotes] = useState(''); // To manage additional notes

  if (!transaction) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/^(.*?), (.*), (.*)$/, (match, month, day, year) => {
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
    });
  };
  


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50">
          <div className={`py-6 max-w-xl w-full h-full p-4 border border-blue-400 rounded-md shadow-md relative overflow-y-auto ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-light-bg'}`}>
          {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <div className={`pb-8 flex items-center justify-center w-full`}>
          <h2 className={`text-3xl font-bold py-2 border-b w-full text-center ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
            <span className="flex items-center justify-center">
              <BsArrowRepeat className="mr-2" />
              RMA Request Form
            </span>
          </h2>        
        </div>   

        <div className='w-full flex flex-col items-center justify-center gap-8 px-6'>
          <div className='w-full h-auto flex flex-col gap-4'>
              <div className="text-md w-full flex items-center justify-between">
              <span className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>TRANSACTION ID</span>
                  <span className='font-semibold w-[50%]'>{transaction.transaction_id || 'N/A'}</span>
                </div>
                <div className="text-md w-full flex items-center justify-between">
                  <span className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>SALE DATE</span>
                  <span className='font-semibold w-[50%]'>{formatDate(transaction.transaction_date) || 'N/A'}</span>
                </div>
                <div className="text-md w-full flex items-center justify-between">
                  <span className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>CUSTOMER NAME</span>
                  <span className='font-semibold w-[50%]'>{transaction.customer?.name || 'N/A'}</span>
                </div>
                <div className="text-md w-full flex items-center justify-between">
                  <span className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>PRODUCT NAME</span>
                  <span className='font-semibold w-[50%]'>{transaction.product.product?.name|| 'Unknown Product'}</span>
                </div>
                <div className="text-md w-full flex items-center justify-between">
                  <span className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>SERIAL NUMBER</span>
                  <span className='font-semibold w-[50%]'>{transaction.product.serial_number.length > 0 ? transaction.product.serial_number.join(', ') : 'N/A'}</span>
                </div>
          </div>


          <div className='w-full h-auto flex flex-col gap-4'>
          <span className="font-semibold text-xl">Reason for refund</span>
              <div className="mt-2 flex flex-col gap-2">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    value="Defective Product"
                  />
                  Defective Product
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    value="Other"
                    onChange={(e) => setOtherReason(e.target.checked ? '' : '')}
                  />
                  Other (Please specify)
                </label>
                {otherReason && (
                  <input
                    type="text"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Please specify"
                    className="mt-2 w-full border border-gray-300 p-2 rounded"
                  />
                )}
              </div>

            {/* Additional Notes */}
            <div className="mb-4 flex flex-col gap-4">
              <span className="font-semibold">Additional Notes:</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full border border-gray-300 p-2 rounded"
                rows="3"
              />
            </div>
         </div>
        </div>



        {/* Buttons */}
        <div className="mt-4 w-full flex items-center justify-between gap-2 text-xl py-4 px-6">
        <button
              className={`text-white px-4 py-4 rounded-md w-[50%] flex items-center justify-center gap-2 ${darkMode ? 'bg-light-primary' : 'bg-light-primary'}`}
              onClick={() => {
              // Handle submit logic here
              alert('RMA Request Submitted');
            }}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className={`text-white px-4 py-4 rounded-md w-[50%] flex items-center justify-center gap-2 ${darkMode ? 'bg-light-primary' : 'bg-light-primary'}`}
            >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RMAPanel;
