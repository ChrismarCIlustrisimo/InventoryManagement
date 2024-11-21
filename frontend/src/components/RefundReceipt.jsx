import React, { useRef, useEffect, useState } from 'react';
import { RiRefundLine } from "react-icons/ri";
import { useTheme } from '../context/ThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import ReactToPrint from 'react-to-print';
import axios from 'axios';
import { API_DOMAIN } from "../utils/constants";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RefundReceipt = ({ onClose, refundData, rma }) => {
  const { darkMode } = useTheme();
  const componentRef = useRef();
  const [customer, setCustomer] = useState(null); // State for customer data
  const baseURL = API_DOMAIN;
  const navigate = useNavigate(); // Initialize the navigate function

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short', // Abbreviated month (e.g., Nov)
      day: 'numeric', // Day (e.g., 18)
      year: 'numeric', // Full year (e.g., 2024)
      hour: '2-digit', // Hour in 12-hour format (e.g., 09)
      minute: '2-digit', // Minute (e.g., 41)
      hour12: true, // Use 12-hour time format with AM/PM
    }).replace(/, /g, ' '); // Remove the comma and space after month, day, and year
  };
  
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${baseURL}/customer/${rma.customerID}`); // Adjust the URL as needed
        setCustomer(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomer();
  }, [rma.customerID]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-100">
      <div className={`h-full w-full rounded-md flex items-end justify-center shadow-md ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`}>
        {/* Header */}


        <style>
          {`
            @media print {
              .print-flex {
                display: flex;
                width: 100%;
              }
              
              .print-label {
                width: 30%;
                font-weight: bold;
              }
              
              .print-value {
                width: 70%;
                font-weight: normal;
              }

              .no-print {
                display: none !important; /* Hide elements marked as no-print */
              }
            }
          `}
        </style>
        <div className='flex items-center justify-between w-full h-[10%] top-0 py-4 fixed z-50 px-6 bg-white'>
          <button className={`flex gap-2 items-center rounded-md hover:underline`} onClick={() => navigate(-1)}>
            <IoCaretBackOutline /> Back to RMA
          </button>
          <div className='flex gap-4 items-end justify-center '>
            <ReactToPrint
              trigger={() => (
                <button className={`py-2 px-4 rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-light-primary'}`}>
                  Print Receipt
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>
          
        </div>

        {/* Transaction Details */}
        <div className={`w-full h-[90%] flex items-center justify-center overflow-y-auto ${darkMode ? 'text-light-textPrimary border-light-border bg-light-container' : 'text-light-textPrimary border-gray-600 bg-dark-container'}`}>
          <div className={`w-full h-full items-center flex flex-col justify-start p-4 rounded-md`}>
            <div ref={componentRef} className={`flex flex-col w-full h-full justify-start gap-4 rounded-lg px-6`}>
              {/* Company Information */}
              <div className='flex w-full items-center justify-between border-b-2 border-black py-4'>
                <p className='text-4xl font-semibold text-center w-full'>Refund Receipt</p>
              </div>

              <div className='flex w-full items-center justify-between border-b-2 border-black'>
                <div className='text-left mb-6'>
                  <h2 className='font-bold'>Irig Computer Trading</h2>
                  <p>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
                  <p>Tel. No. 8-364-6039</p>
                  <p>CP. No. 0923-444-1030</p>
                  <p>irigcomputers@gmail.com</p>
                </div>

                <div className='text-right mb-6'>
                  <h2 className='text-2xl font-bold'>Invoice No:</h2>
                  <p className='text-xl font-bold'>{refundData?.refund_id}</p>
                  <p>Issued date:</p>
                  <p className='font-bold'>{new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className='w-full flex justify-start items-center border-b-2 border-black pb-4'>
                <div>
                  <h4 className='font-bold'>Billed to</h4>
                  <p>{customer?.name || 'N/A'}</p> {/* Display customer name */}
                  <p>{customer?.address || 'N/A'}</p> {/* Display customer address */}
                  <p>{customer?.email || 'N/A'}</p> {/* Display customer email */}
                  <p>{customer?.phone || 'N/A'}</p> {/* Display customer phone */}
                </div>
              </div>

              <div className='w-full flex flex-col justify-start items-center pb-4'>
                <h2 className='text-2xl font-bold w-full text-start pb-4'>Refund Info</h2>


                <div className={`w-full flex flex-col border-b-2 border-black pb-4 gap-1`}>
                 <div className='flex w-[60%]'>
                     <p className={`print-label font-bold w-[24%]  ${darkMode ? 'text-light-texPrimary' : 'text-dark-texPrimary'}`}>Transaction ID:</p>
                    <p className='print-value font-semibold text-start w-[60%]'>{refundData?.transaction_id}</p>
                  </div>
                  <div className='flex w-[60%]'>
                    <p className={`print-label font-bold w-[24%]  ${darkMode ? 'text-light-texPrimary' : 'text-dark-texPrimary'}`}>Transaction Date:</p>
                    <p className='print-value font-semibold text-start w-[60%]'>{formatDate(rma.transaction_date)}</p>
                  </div>
                  <div className='flex w-[60%]'>
                    <p className={`print-label font-bold w-[24%]  ${darkMode ? 'text-light-texPrimary' : 'text-dark-texPrimary'}`}>Product:</p>
                    <p className='print-value font-semibold text-start w-[60%]'>{refundData?.product_name}</p>
                  </div>
                  <div className='flex w-[60%]'>
                    <p className={`print-label font-bold w-[24%]  ${darkMode ? 'text-light-texPrimary' : 'text-dark-texPrimary'}`}>Refund Amount:</p>
                    <p className='print-value font-semibold text-start w-[60%]'>₱ {refundData?.refund_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className='flex w-[60%]'>
                    <p className={`print-label font-bold w-[24%] ${darkMode ? 'text-light-texPrimary' : 'text-dark-texPrimary'}`}>Refund Method:</p>
                    <p className='print-value font-semibold text-start w-[60%]'>{refundData?.refund_method}</p>
                  </div>
                </div>



                <div className='w-full flex items-center justify-start pt-12'>
                  <div className='w-[80%] h-[120px] flex flex-col'>
                      <span className='text-xl font-semibold'>Payment method:</span>
                      <div className='flex flex-col justify-between py-2'>
                          <div className='flex items-center justify-start gap-4'>
                              <p className='text-light-textSecondary mr-4'>PAYMENT METHOD</p>
                              <p className='uppercase font-semibold'>{refundData?.refund_method}</p>
                              <p className='bg-[#EBFFEE] p-1 rounded-md text-[#14AE5C] italic px-4 font-semibold'>Paid</p>
                          </div>
                          {refundData?.payment_method !== 'Cash' ? (
                              <div className='flex items-center justify-start gap-4'>
                                  <p className='text-light-textSecondary mr-4'>REFERENCE NUMBER</p>
                                  <p className='uppercase font-semibold'>{refundData?.reference_number}</p>
                              </div>
                          ) : ''}
                      </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundReceipt;
