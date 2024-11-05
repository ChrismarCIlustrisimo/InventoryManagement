import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCaretBackOutline } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';
import ReactToPrint from 'react-to-print';
import axios from 'axios';
import PrintableReceipt from './PrintableReceipt';
import '../App.css';
import RMARequestForm from '../pages/RMARequestForm';

const ViewTransactionCashier = ({ transaction, onClose }) => {
    const baseURL = "http://localhost:5555";
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const componentRef = useRef();
    const [customer, setCustomer] = useState(null);
    const [isRMARequestForm, setIsRMARequestForm ] = useState(false);


    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`${baseURL}/customer/${transaction.customer?._id}`);
                setCustomer(response.data);
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };
        fetchCustomer();
    }, [transaction]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      };
      

      const getStatusStyles = (status, warranty_status) => {
        let statusStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };
    
        switch (status) {
            case 'Completed':
                statusStyles = {
                    textClass: 'text-[#14AE5C]',
                    bgClass: 'bg-[#CFF7D3]',
                };
                break;
            case 'Pending':
                statusStyles = {
                    textClass: 'text-[#BF6A02]',
                    bgClass: 'bg-[#FFF1C2]',
                };
                break;
            case 'Refunded':
                statusStyles = {
                    textClass: 'text-[#EC221F]',
                    bgClass: 'bg-[#FEE9E7]',
                };
                break;
        }
    
        return statusStyles;
    };
    
    const statusStyles = getStatusStyles(transaction.status, transaction.warranty_status);

        // Handlers to open and close RMA request form
        const handleRMARequestFormOpen = () => {
            setIsRMARequestForm(true);
        };
    


        const handleRMARequestFormClose = () => {
            setIsRMARequestForm(false);
        };

    
        const shortenString = (str) => {
            // Log the input for debugging
            console.log('Input string:', str);
        
            // Check if the input is a valid string and trim it
            if (typeof str === 'string') {
                const trimmedStr = str.trim(); // Remove leading and trailing spaces
                if (trimmedStr.length > 15) {
                    return trimmedStr.slice(0, 25) + '...'; // Shorten and add ellipsis
                }
                return trimmedStr; // Return the original trimmed string if it's 10 characters or less
            }
            return 'N/A'; // Return 'N/A' if input is not a string
        };
        

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded shadow-lg h-full w-full max-h-[100vh] overflow-y-scroll">
                <div className='flex items-center justify-between w-full top-0 py-4 fixed z-50 px-6 bg-white'>
                    <button className={`flex gap-2 items-center rounded-md ${darkMode ? 'text-light-textPrimary' : 'text-light-textPrimary'} hover:underline`} onClick={onClose}>
                        <IoCaretBackOutline /> Back to Transaction
                    </button>
                    <div className='flex gap-4 items-center justify-center px-12'>
                        <ReactToPrint
                            trigger={() => (
                                <button className={`py-2 px-4 rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-light-primary'}`}>
                                    Print Receipt
                                </button>
                            )}
                            content={() => componentRef.current}
                        />
                        <button className='bg-[#E8B931] py-2 px-4 rounded-md text-white' onClick={handleRMARequestFormOpen}>RMA Request</button>
                    </div>
                </div>  

                <div className='w-full h-[90%] flex items-center justify-center mt-[14%]'>
                    <div className={`w-[60%] items-center flex flex-col justify-start border px-12  ${darkMode ? 'text-light-textPrimary border-light-border' : 'text-light-textPrimary border-light-border'} p-4 rounded-md`}>
                        <div className='flex flex-col w-full items-start justify-between gap-4'>
                            <div className='flex w-full py-6'>
                                <h2 className='text-2xl font-bold mr-2'>Transaction ID: </h2>
                                <p className='text-2xl font-bold'>{transaction.transaction_id}</p>
                            </div>
                            <div className='flex w-full items-start justify-start  '>
                                    <div className={`w-[20%] flex flex-col gap-2 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                                        <p className='w-full '>STATUS</p>
                                        <p className='w-full '>SALES DATE</p>
                                    </div>
                                    <div className={`w-[30%] flex flex-col gap-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                        <p className='w-full text-start'>
                                            <span className={`px-4 py-1 rounded-md ${statusStyles.textClass} ${statusStyles.bgClass}`}>{transaction.status}</span>
                                        </p>
                                        <p className='w-full text-start px-4 font-semibold'>{formatDate(transaction.transaction_date)}</p>
                                    </div>
                            </div>
                        </div>

                        <div className='w-full flex justify-start pt-8 '>
                            <div className='flex flex-col w-full items-start justify-start  '>
                                <p className='font-bold text-xl py-2'>Customer Information</p>
                                <div className='flex w-[60%] py-2'>
                                  <div className={`w-[40%] flex flex-col gap-2 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                                        <p className='w-full '>CUSTOMER NAME</p>
                                        <p className='w-full '>ADDRESS</p>
                                        <p className='w-full '>EMAIL</p>
                                        <p className='w-full '>PHONE NUMBER</p>
                                    </div>
                                    <div className={`w-[60%] flex flex-col gap-2 font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                       <p>{customer?.name || 'N/A'}</p>
                                        <p>{customer?.address || 'N/A'}</p>
                                        <p>{customer?.email || 'N/A'}</p>
                                        <p>{customer?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-full py-4'>
                            <p className='font-bold text-xl py-6'>Product Sold</p>
                            <table className='w-full text-left mb-6'>
                                <thead>
                                    <tr className={`${darkMode ? 'bg-dark-header' : 'bg-light-header'} border-y-2`}>
                                        <th className='p-2 text-left'>Product</th>
                                        <th className='p-2 text-center '>Price</th>
                                        <th className='p-2 text-center '>Quantity</th>
                                        <th className='p-2 text-center '>Serial Number</th>
                                        <th className='p-2 text-center '>Amount</th>
                                        <th className='p-2 text-center '>Unit Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaction.products.length > 0 ? (
                                        transaction.products.map((item, index) => {
                                        const productUnits = item.product?.units || [];
                                        const unitStatuses = item.serial_number.map(serial => {
                                            const matchedUnit = productUnits.find(unit => unit.serial_number === serial);
                                            return matchedUnit?.status || 'N/A';
                                        });
                                        return (
                                            <tr key={index} className="border-y-2">
                                            <td className="p-2 flex flex-col gap-2 text-left">
                                                     <p>{shortenString(item.product?.name)}</p>
                                            </td>
                                            <td className="p-2 text-center">₱ {item.product?.selling_price || 0}</td>
                                            <td className="p-2 text-center">{item.quantity}</td>
                                            <td className="p-2 text-center">{item.serial_number.length > 0 ? item.serial_number.join(', ') : 'N/A'}</td>
                                            <td className="p-2 text-center">₱ {item.quantity * item.product?.selling_price}</td>
                                            <td className="p-2 text-center">{unitStatuses.join(', ')}</td>
                                            </tr>
                                        );
                                        })
                                    ) : (
                                        <tr>
                                             <td colSpan={5} className="border p-2 text-center">No products found for this transaction.</td>
                                        </tr>
                                    )}
                                    </tbody>
                            </table>
                        </div>

                        <div className='w-full flex items-center justify-end'>
                            <div className='w-[40%] h-[120px]'>
                                <div className='flex justify-between py-2'>
                                    <span>Subtotal</span>
                                    <span>₱ {(transaction.total_price - transaction.vat).toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between py-2'>
                                    <span>VAT (12%)</span>
                                    <span>₱ {transaction.vat.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between py-2'>
                                    <span>Discount</span>
                                    <span>₱ {transaction.discount.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between border-t-2 border-black text-xl py-4 font-semibold'>
                                    <span>Total</span>
                                    <span>₱ {(transaction.total_price - transaction.discount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className='w-full flex items-center justify-start pt-12'>
                            <div className='w-[40%] h-[120px] flex flex-col'>
                                <span className='text-xl font-semibold'>Payment method:</span>
                                <div className='flex flex-col justify-between py-2'>
                                    <div className='flex items-center justify-start gap-4'>
                                        <p className='text-light-textSecondary mr-4'>PAYMENT METHOD</p>
                                        <p className='uppercase font-semibold'>{transaction.payment_method}</p>
                                        <p className='bg-[#EBFFEE] p-1 rounded-md text-[#14AE5C] italic px-4 font-semibold'>Paid</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {isRMARequestForm && (
                  <RMARequestForm
                    transaction={transaction}
                    onClose={handleRMARequestFormClose}
                  />
                )}



                <div className="hidden print:block">
                    <PrintableReceipt 
                        ref={componentRef} 
                        transaction={transaction} 
                        customer={customer} 
                        darkMode={darkMode} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ViewTransactionCashier;
