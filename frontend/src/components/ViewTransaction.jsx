import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { RiRefundLine } from "react-icons/ri";
import { BsArrowRepeat } from "react-icons/bs";
import { IoCaretBackOutline } from "react-icons/io5";

const ViewTransaction = ({ transaction, onClose }) => {
  const { darkMode } = useAdminTheme();


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/^(.*?), (.*), (.*)$/, (match, month, day, year) => {
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
    });
  };
  


  if (!transaction) return null; // If no transaction is passed, return nothing

  // Extract product and status from the transaction
  const product = transaction.product || {};
  const status = product.item_status; // Now extracting status from the product



  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50">
          <div className={`py-6  max-w-xl w-full h-full p-4 border border-blue-400 rounded-md shadow-md relative overflow-y-auto ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-light-bg'}`}>
            <button className={`flex gap-2 items-center outline-none pb-6 ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'} hover:underline`}  onClick={onClose}>
              <IoCaretBackOutline />
              Back to Sales
            </button>   
            <div className='w-full flex flex-col gap-3 px-10'>
              <h2 className="text-3xl font-bold py-2 ">Transaction ID: {transaction.transaction_id}</h2>
              <div className={`text-md w-full flex items-center justify-between`}>
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>STATUS</div>
                <div className="text-green-500 font-semibold w-[50%]"><span className='bg-[#CFF7D3] p-2 rounded-md'>{status || 'N/A' }</span></div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>SALE DATE</div>
                <div className='font-semibold w-[50%]'>{formatDate(transaction.transaction_date)}</div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>CASHIER</div>
                <div className='font-semibold w-[50%]'>{transaction.cashier || 'None' }</div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>CUSTOMER NAME</div>
                <div className='font-semibold w-[50%]'>{transaction.customer?.name || 'None'}</div>
              </div>

              <h3 className="text-xl font-bold py-4">Product Details</h3>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>PRODUCT NAME</div>
                <div className='font-semibold w-[50%]'>{product.product?.name || 'Unknown Product'}</div>
              </div>

              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>MODEL</div>
                <div className='font-semibold w-[50%]'>{product.product?.model || 'N/A'}</div>
              </div>

              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>SERIAL NUMBER</div>
                <div className='font-semibold w-[50%]'>{product.serial_number.length > 0 ? product.serial_number.join(', ') : 'N/A'}</div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>QTY. SOLD</div>
                <div className='font-semibold w-[50%]'>{product.quantity || 0}</div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>PRICE PER UNIT</div>
                <div className='font-semibold w-[50%]'>₱ {product.product?.selling_price || 0}</div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>TOTAL PRICE</div>
                <div className='font-semibold w-[50%]'>₱{transaction.total_price.toFixed(2)}</div>
              </div>

              <h3 className="text-xl font-bold py-4">Payment Information</h3>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>PAYMENT METHOD</div>
                <div className='font-semibold w-[50%]'>s</div>
              </div>

              <h3 className="text-xl font-bold py-4">Refund/RMA Information</h3>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>REFUND STATUS</div>
                <div className='font-semibold w-[50%]'>Not Requested</div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>RMA STATUS</div>
                <div className='font-semibold w-[50%]'>Not Requested</div>
              </div>
            </div>

            <div className="mt-4 w-full flex items-center justify-between gap-2 text-xl py-4 px-10">
              <button className="bg-blue-500 text-white px-4 py-4 rounded w-[50%] flex items-center justify-center gap-2">
                <RiRefundLine size={20}/>
                <p>Refund</p>
              </button>
              <button className="bg-blue-500 text-white px-4 py-4 rounded w-[50%] flex items-center justify-center gap-2">
                <BsArrowRepeat size={20}/>
                <p>RMA</p>  
              </button>
            </div>
          </div>
        </div>
    </>
  );
};

export default ViewTransaction;
