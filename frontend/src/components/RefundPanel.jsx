import React from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { RiRefundLine } from "react-icons/ri";

const RefundPanel = ({ transaction, onClose }) => {
  const { darkMode } = useAdminTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/^(.*?), (.*), (.*)$/, (match, month, day, year) => {
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
    });
  };

  if (!transaction) return null; // If no transaction is passed, return nothing

  // Extracting transaction data
  const transactionData = {
    saleDate: formatDate(transaction.saleDate), // Assuming transaction has a saleDate
    customerName: transaction.customerName || 'N/A',
    productName: transaction.customer?.name || 'N/A', // Assuming transaction.product exists
    qtySold: transaction.product.quantity || 0,
    amount: transaction.total_price.toFixed(2) || 0,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50">
      <div className={`py-6 max-w-xl w-full h-full border border-blue-400 rounded-md shadow-md relative overflow-y-auto ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>✖</button>
        <div className={`pb-8 px-4 flex items-center justify-center w-full`}>
            <h2 className={`text-3xl font-bold py-2 border-b w-full text-center ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
              <span className="flex items-center justify-center">
                <RiRefundLine className="mr-2" />
                Refund Transaction
              </span>
            </h2>        
        </div>   
        <div className='w-full flex flex-col gap-3 px-10'>
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center text-md">
              <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>TRANSACTION ID</div>
              <div className={`font-semibold w-[50%] ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{transaction.transaction_id}</div>
            </div>

            <div className="flex justify-between items-center text-md">
              <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>SALE DATE</div>
              <div className="font-semibold w-[50%]">{transactionData.saleDate}</div>
            </div>

            <div className="flex justify-between items-center text-md">
              <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>CUSTOMER NAME</div>
              <div className="font-semibold w-[50%]">{transactionData.customerName}</div>
            </div>

            <div className="flex justify-between items-center text-md">
              <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>PRODUCT NAME</div>
              <div className="font-semibold w-[50%]">{transactionData.productName}</div>
            </div>


            <div className="flex justify-between items-center text-md">
              <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>QTY SOLD</div>
              <div className="font-semibold w-[50%]">{transactionData.qtySold}</div>
            </div>

            <div className="flex justify-between items-center text-md">
              <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>AMOUNT</div>
              <div className="font-semibold w-[50%]">{transactionData.amount}</div>
            </div>
          </div>

          {/* Reason for Refund */}
          <h3 className="text-xl font-bold py-4">Reason for Refund</h3>
          <div className="w-full flex flex-col gap-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Defective Product
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Incorrect Item
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Change Mind
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Other (Please specify)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 mt-2"
              placeholder="Specify other reason..."
            />
          </div>

          {/* Refund Amount and Confirmation */}
          <h3 className="text-xl font-bold py-4">Refund Details</h3>
          <div className="flex justify-between items-center text-md">
            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>REFUND AMOUNT</div>
            <div className="font-semibold w-[50%]">{transactionData.amount}</div>
          </div>
          <label className="flex items-center mt-2">
            <input type="checkbox" className="mr-2" />
            I confirm this refund
          </label>

          {/* Buttons */}
          <div className="mt-6 flex justify-between gap-2">
            <button
              className={`text-white px-4 py-4 rounded-md w-[50%] flex items-center justify-center gap-2 ${darkMode ? 'bg-light-primary' : 'bg-light-primary'}`}
              >
              Submit
            </button>
            <button
            className={`px-4 py-4 rounded-md  w-[50%] flex items-center justify-center gap-2 border ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-light-primary'}`}
            onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPanel;

