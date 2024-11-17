import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { GoTriangleRight } from "react-icons/go";
import companyLogo from '../assets/companyLogo.png'; // Adjust the path as needed
import '../App.css';
import { API_DOMAIN } from '../utils/constants';

const DashboardRefund = ({
    isOpen,
    onClose,
    transaction_id,
    cart,
    total_price,
    customer,
    transaction_date,
    cashier,
}) => {
    const { darkMode } = useTheme();
    const baseURL = API_DOMAIN;
    const [showRefundControls, setShowRefundControls] = useState(false);
    const [refundReason, setRefundReason] = useState("");

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(date));
    };

    if (!isOpen) return null;

    return (
        <div className={`z-20 fixed top-0 left-0 w-full h-full bg-opacity-50 flex justify-end items-center backdrop-blur-md flex-grow overflow-y-auto`}>
            <div className={`relative p-6 rounded-2xl shadow-md w-[40%] min-h-full flex flex-col ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                <div className={`flex justify-between items-center w-full mb-4 ${showRefundControls ? 'mt-[12%]' : 'mt-[30%]'}`}>
                    <button onClick={onClose} className={`text-3xl transition-colors duration-300 ${darkMode ? 'text-light-textPrimary hover:text-gray-700' : 'text-dark-textPrimary hover:text-gray-500'}`}>
                        <GoTriangleRight />
                    </button>
                    <button onClick={() => setShowRefundControls(!showRefundControls)} className={`text-md px-2 py-1 rounded-md transition-colors duration-300 ${darkMode ? 'bg-light-container1 hover:bg-gray-200' : 'bg-dark-container1 hover:bg-gray-600'}`}>
                      Refund
                    </button>
                </div>
                <div className="flex flex-col gap-6 justify-center items-center text-sm text-black"> {/* Set text color to black */}
                    <div className='flex gap-2 items-center justify-center'>
                        <img src={companyLogo} alt='Company Logo' className="w-8 h-8" />
                        <p className='font-bold'>iRig Computer Trading</p>
                    </div>
                    <div className='flex flex-col gap-2 items-center justify-center'>
                        <p>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
                        <p>+63 923 444 1030</p>
                        <p>kedemcomputers@gmail.com</p>
                    </div>
                    <div className={`w-[84%] flex flex-col items-center justify-center gap-2 rounded-md p-2 ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border'}`}>
                        <h1 className='font-bold text-3xl'>Sales Invoice</h1>
                        <p>Transaction ID: {transaction_id}</p>
                    </div>
                    <div className="w-full mt-4 overflow-x-auto flex flex-col items-center justify-center">
                        <p className='text-xl font-semibold py-2'>Product Details</p>
                        <div className="overflow-y-auto h-[160px]">
                        <table className={`table-fixed w-full`}>
                            <thead className={`border-b border-gray-400  sticky top-0 z-10 ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                                <tr>
                                    <th style={{ width: '44%' }} className="p-2 text-left">Name</th>
                                    <th className="p-2 text-left">Unit Price</th>
                                    <th className="p-2 text-left">Qty</th>
                                    <th className="p-2 text-left">Total Price</th>
                                    {showRefundControls && <th className="p-2 text-center">Refund</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {cart.length > 0 ? (
                                    cart.map((item, idx) => {
                                        const unitPrice = Number(item.product.selling_price) || 0;
                                        const quantity = Number(item.quantity) || 0;
                                        const totalPrice = unitPrice * quantity;

                                        return (
                                            <tr key={idx} className='border-b border-gray-400'>
                                                <td className="p-2 flex gap-2 items-center justify-start">
                                                    <img
                                                        src={`${baseURL}/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-12 h-12 object-cover rounded-lg"
                                                    />
                                                    <p className='text-sm'>{item.product.name || 'Unknown'}</p>
                                                </td>
                                                <td className="p-2 text-xs">₱ {unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className="p-2 text-xs">{quantity}</td>
                                                <td className="p-2 text-xs">₱ {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                {showRefundControls && (
                                                    <td className="p-2 text-center">
                                                        <div className="custom-checkbox">
                                                            <input 
                                                            type="checkbox" 
                                                            checked={selectedItems[item.product._id] || false} 
                                                            onChange={() => handleCheckboxChange(item.product._id, quantity)} 
                                                            />
                                                            <span className="checkmark"></span>
                                                            <span className="label-text"></span>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={showRefundControls ? "5" : "4"} className="p-2 text-center">No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                        <div className='flex items-center justify-end w-full px-4 py-6 text-md'>
                            <div className={`flex items-center justify-between w-[30%] ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`}>
                                <p>TOTAL</p>
                                <p>₱ {total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> {/* Make total text black */}
                            </div>
                        </div>
                        {showRefundControls ? (
                            <div className={`flex flex-col w-full sticky z-50 rounded-md ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border'}`}>
                                <textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Reason for Refund" className={`w-full h-24 p-2 mb-4 rounded-md outline-none ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border'}`}/>
                                <div className={`flex items-center justify-end gap-4 p-4 rounded-md h-full ${darkMode ? 'bg-light-container1' : 'dark:bg-dark-container1'}`}>
                                    <button onClick={() => setShowRefundControls(false)} className={`py-2 px-4 rounded-md border ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>
                                        Cancel
                                    </button>
                                    <div className={`border-l h-full ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`} style={{ height: '2rem' }}> </div>
                                    <button onClick={handleRefund} className={`py-2 px-4 rounded-md ${darkMode ? 'bg-light-primary text-light-textPrimary' : 'bg-dark-primary text-dark-textPrimary'}`}>
                                        Save
                                    </button>
                                </div>
                            </div>

                        ) : (
                            <>
                                <div className='flex flex-col gap-4 w-full'>
                                    <p className='text-xl font-semibold'>Customer Details</p>
                                    <div className={`flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                        <p className={`font-semibold text-gray-500`}>CUSTOMER NAME</p>
                                        <p>{customer.name || 'N/A'}</p>
                                    </div>
                                    <div className={`flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                        <p className={`font-semibold text-gray-500`}>CUSTOMER ADDRESS</p>
                                        <p>{customer.address || 'N/A'}</p>
                                    </div>
                                    <div className={`flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                        <p className={`font-semibold text-gray-500`}>CUSTOMER NUMBER</p>
                                        <p>{customer.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full'>
                                    <p className='text-xl font-semibold py-2'>Transaction Details</p>
                                    <div className={`flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                        <p className={`font-semibold text-gray-500`}>DATE</p>
                                        <p>{formatDate(transaction_date)}</p>
                                    </div>
                                    <div className={`flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                        <p className={`font-semibold text-gray-500`}>CASHIER</p>
                                        <p>{cashier || 'N/A'}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardRefund;
