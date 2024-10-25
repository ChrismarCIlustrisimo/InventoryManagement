import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import ReactToPrint from 'react-to-print';

const ReplacementReceipt = ({ rma, newSerialNumber, onClose }) => {
    const { darkMode } = useTheme();
    const componentRef = useRef();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50`}>
            <div className={`h-full w-full rounded-md flex items-end justify-center shadow-md ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`}>
                <div className='flex items-center justify-between w-full h-[10%] top-0 py-4 fixed z-50 px-6 bg-white'>
                    <button className={`flex gap-2 items-center rounded-md  hover:underline`} onClick={onClose}>
                        <IoCaretBackOutline /> Back to RMA
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
                    </div>
                </div>
                <div className='w-full h-[90%] flex items-center justify-center py-2'>
                    <div className={`w-[50%] h-full items-center flex flex-col justify-start px-12 ${darkMode ? 'text-light-textPrimary border-light-border' : 'text-light-textPrimary border-light-border'} p-4 rounded-md`}>
                        <div ref={componentRef} className={`flex flex-col w-full h-full justify-start px-6 py-4 gap-6 border-2 rounded-lg ${darkMode ? 'border-gray-400 bg-light-container' : 'border-gray-600 bg-dark-container'}`}>
                            <h2 className="text-2xl font-bold mb-4 text-center">Replacement Receipt</h2>

                            {/* Transaction Info Section */}
                            <h3 className="text-lg font-semibold mb-2">Transaction Info</h3>
                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.transaction}</p>
                            </div>
                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>DATE INITIATED</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{formatDate(new Date())}</p>
                            </div>

                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CUSTOMER NAME</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.customer_name}</p>
                            </div>


                            {/* Additional Info Section */}
                            <h3 className="text-lg font-semibold mb-2">Replacement Info</h3>
                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.product}</p>
                            </div>

                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Product Price</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.product_price}</p>
                            </div>
                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Cashier</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.cashier}</p>
                            </div>
                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REASON</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.reason}</p>
                            </div>
                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REPLACED SERIAL NUMBER</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.serial_number}</p>
                            </div>
                            <div className={`text-sm flex items-center justify-between`}>
                                <p className={`font-medium w-[35%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>NEW SERIAL NUMBER</p>
                                <p className={`w-[75%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{newSerialNumber || 'SN987654321'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReplacementReceipt;
