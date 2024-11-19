import React, { useEffect, useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { RiRefundLine } from "react-icons/ri";
import { BsArrowRepeat } from "react-icons/bs";
import { IoCaretBackOutline } from "react-icons/io5";
import axios from 'axios';
import { API_DOMAIN } from "../utils/constants";

const ViewTransaction = ({ transaction, onClose }) => {
  const { darkMode } = useAdminTheme();
  const baseURL = API_DOMAIN;


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Get date in the desired format
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
    
    // Format the date and time
    const formattedDate = date.toLocaleString('en-US', options);
  
    return formattedDate;
  };
  
  
  


  if (!transaction) return null; // If no transaction is passed, return nothing

  // Extract product and status from the transaction
  const product = transaction.product || {};

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return {
          textClass: 'text-[#14AE5C]',
          bgClass: 'bg-[#CFF7D3]', 
        };
      case 'Refunded':
        return {
          textClass: 'text-[#EC221F]',
          bgClass: 'bg-[#FEE9E7]',
        };
        case 'RMA':
          return {
            textClass: 'text-[#BF6A02]',
            bgClass: 'bg-[#FFF1C2]',
          };
          case 'Replaced':
            return {
              textClass: 'text-[#007BFF]',
              bgClass: 'bg-[#C2D7FF]',
            };
      default:
        return {
          textClass: 'text-[#8E8E93]',
          bgClass: 'bg-[#E5E5EA]',
        };
    }
  };

  const statusStyles = getStatusStyles(transaction.status);


  const [refundData, setRefundData] = useState([]);
  const [rmaData, setRMAData] = useState([]);

  useEffect(() => {
    if (!transaction.transaction_id) {
        console.error('No transaction ID available');
        return;
    }

    const fetchRefundAndRMA = async () => {
        try {
            const refundResponse = await axios.get(`${baseURL}/refund/check/${transaction.transaction_id}`);
            setRefundData(refundResponse.data.refundData);

            const rmaResponse = await axios.get(`${baseURL}/rma/check/${transaction.transaction_id}`);
            setRMAData(rmaResponse.data.RMAData);  // Ensure RMAData matches the backend response
        } catch (error) {
            console.error('Error fetching refund or RMA data:', error);
        }
    };

    fetchRefundAndRMA();
}, [transaction.transaction_id]);


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
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                  STATUS
                </div>
                <div className={`font-semibold w-[50%] ${statusStyles.textClass}`}>
                  <span className={`${statusStyles.bgClass} p-2 rounded-md`}>
                    {transaction.status || 'N/A'}
                  </span>
                </div>
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
                <div className='font-semibold w-[50%]'>₱ {product.product?.selling_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}</div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>TOTAL PRICE</div>
                <div className='font-semibold w-[50%]'>₱{transaction.total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>

              <h3 className="text-xl font-bold py-4">Payment Information</h3>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>PAYMENT METHOD</div>
                <div className='font-semibold w-[50%]'>{transaction.payment_method}</div>
              </div>

              {transaction.payment_method !== 'Cash' ? (
                  <div className="text-md w-full flex items-center justify-between">
                    <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>
                       REFERENCE NO.
                    </div>
                    <div className='font-semibold w-[50%]'>
                      {transaction.reference_number}
                    </div>
                  </div>
                ) : null}


              <h3 className="text-xl font-bold py-4">Refund/RMA Information</h3>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>REFUND STATUS</div>
                <div className='font-semibold w-[50%]'>
                {refundData?.length > 0 ? (
                  `${refundData.map(refund => refund.refund_id).join(', ')}`
                ) : (
                  'Not Requested'
                )}
                </div>
              </div>
              <div className="text-md w-full flex items-center justify-between">
                <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} `}>RMA STATUS</div>
                <div className='font-semibold w-[50%]'>
                {rmaData?.length > 0 ? (
                    `${rmaData.map(rma => rma.rma_id).join(', ')}`
                  ) : (
                    'Not Requested'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default ViewTransaction;
