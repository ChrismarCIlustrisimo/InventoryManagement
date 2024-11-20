import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RefundForm from './RefundForm';
import { useTheme } from '../context/ThemeContext';
import ProcessRefund from './ProcessRefund';
import ProcessReplacement from './ProcessReplacement';


const ViewRMACashier = ({ onClose, rma }) => {
    const navigate = useNavigate();
    const [isRefundForm, setIsRefundForm] = useState(false);
    const { darkMode } = useTheme();
    const [isProcessRefund, setIsProcessRefund] = useState(false);
    const [isProcessReplacement, setIsProcessReplacement] = useState(false);
    const [rmaProcess, setRmaProcess] = useState(rma.process);


    const handleRefundFormClose = () => {   
        setIsRefundForm(false);
    };

    useEffect(() => {
        if (rma && rma.process) {
            setRmaProcess(rma.process);
        } else {
            console.log("RMA process is undefined or empty");
        }
    }, [rma]);
    
    

    const handleProcessOpen = (process) => {
        console.log(process);  // Log to check the value of `rmaProcess`
        if (process === 'Refund') {
            setIsProcessRefund(true);
        } else if (process === 'Replacement') {
            setIsProcessReplacement(true);
        }
    };
    
    
    
    
    const handleProcessClose = () => {
        setIsProcessRefund(false);
        setIsProcessReplacement(false);
    };

    


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short', // This will return 'Oct' for 'October'
          day: 'numeric',
          year: 'numeric'
        });
      };

      
      const getStatusStyles = (status) => {
        let statusStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };
    
        switch (status) {
            case 'Approved':
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
            case 'In Progress':
                statusStyles = {
                    textClass: 'text-[#007BFF]',
                    bgClass: 'bg-[#C2D7FF]',
                };
                break;
            case 'Completed':
                statusStyles = {
                    textClass: 'text-[#8E8E93]',
                    bgClass: 'bg-[#E5E5EA]',
                };
                break;
            case 'Rejected':
                statusStyles = {
                    textClass: 'text-[#EC221F]',
                    bgClass: 'bg-[#FEE9E7]',
                };
                break;
        }
    
        return statusStyles;
    };
    
    const getWarrantyStyles = (warranty_status) => {
        let warrantyStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };
    
        switch (warranty_status) {
            case 'Valid':
                warrantyStyles = {
                    textClass: 'text-[#14AE5C]',
                    bgClass: 'bg-[#CFF7D3]',
                };
                break;
            case 'Expired':
                warrantyStyles = {
                    textClass: 'text-[#EC221F]',
                    bgClass: 'bg-[#FEE9E7]',
                };
                break;
        }
    
        return warrantyStyles;
    };
    
    const getProcessStyles = (process) => {
        let processStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };
    
        switch (process) {
            case 'Replacement':
                processStyles = {
                    textClass: 'text-[#007BFF]',
                    bgClass: 'bg-[#C2D7FF]',
                };
                break;
            case 'Refund':
                processStyles = {
                    textClass: 'text-[#BF6A02]',
                    bgClass: 'bg-[#FFF1C2]',
                };
                break;
            case 'None':
                processStyles = {
                    textClass: 'text-[#8E8E93]',
                    bgClass: 'bg-[#E5E5EA]',
                };
                break;
        }
    
        return processStyles;
    };

    const checkWarrantyStatus = (warranty, transactionDate) => {
        const warrantyParts = warranty.split(' '); // Split the warranty string into its value and unit (e.g., "5 Months" becomes ["5", "Months"])
        const warrantyValue = parseInt(warrantyParts[0]); // Extract the number of months or years
        const warrantyUnit = warrantyParts[1].toLowerCase(); // Extract the unit (Months or Years)
    
        const transactionDateObj = new Date(transactionDate);
        let expiryDate;
    
        if (warrantyUnit === 'Month' || warrantyUnit === 'Months') {
            // Add months to the transaction date
            expiryDate = new Date(transactionDateObj.setMonth(transactionDateObj.getMonth() + warrantyValue));
        } else if (warrantyUnit === 'Year' || warrantyUnit === 'Years') {
            // Add years to the transaction date
            expiryDate = new Date(transactionDateObj.setFullYear(transactionDateObj.getFullYear() + warrantyValue));
        } else if (warrantyUnit === 'Day' || warrantyUnit === 'Days') {
            // Add days to the transaction date
            expiryDate = new Date(transactionDateObj.setDate(transactionDateObj.getDate() + warrantyValue));
        } else {

        }
    
        const currentDate = new Date();
        return currentDate <= expiryDate ? 'Valid' : 'Expired';
    };
    
    const warrantyStatus = checkWarrantyStatus(rma.product_warranty, rma.transaction_date);
    

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`} onClick={onClose}>
            <div className={`bg-white shadow-lg rounded-lg p-6 w-[50%] h-[80%] relative ${darkMode ? 'bg-dark-container' : 'bg-light-container'}`} onClick={(e) => e.stopPropagation()}>
                <div className={`flex flex-col gap-2 w-full h-full ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                    <div className={`w-full flex items-center justify-between border-b py-2 px-4 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
                        <p className='font-semibold text-4xl'>RMA Details</p>
                        <button 
                            className={`px-4 py-2 text-white rounded-lg ${darkMode ? 'bg-light-button' : 'bg-blue-700'} ${rma.process === 'None' || rma.status === 'Completed'  ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            onClick={() => handleProcessOpen(rma.process)} 
                            disabled={rma.process === 'None' || rma.status === 'Completed'}
                        >
                            Process RMA
                        </button>

                    </div>
                    <div className='flex flex-col w-full h-full justify-start px-6 py-4 gap-4'>
                        <div className={`text-sm flex items-center justify-between`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.transaction}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>DATE INITIATED</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{formatDate(rma.date_initiated)}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CUSTOMER NAME</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.customer_name}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.product}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SERIAL NUMBER</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.serial_number}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REASON</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.reason}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CONDITION</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.condition}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>STATUS</p>
                            <p className={`py-2 rounded-md w-[70%]`}>
                                <span className={`p-2 rounded-md ${getStatusStyles(rma.status).bgClass} ${getStatusStyles(rma.status).textClass}`}>{rma.status}</span>
                            </p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PROCESS</p>
                            <p className={`py-2 rounded-md w-[70%]`}>
                                <span className={`p-2 rounded-md ${getProcessStyles(rma.process).bgClass} ${getProcessStyles(rma.process).textClass}`}>{rma.process}</span>
                            </p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>WARRANTY STATUS</p>
                            <p className={`py-2 rounded-md w-[70%]`}>
                                <span className={`p-2 rounded-md ${getWarrantyStyles(rma.warranty_status).bgClass} ${getWarrantyStyles(rma.warranty_status).textClass}`}>{rma.warranty_status}</span>
                            </p>
                        </div>
                        <div className={`text-sm flex items-start justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>NOTES</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.notes}</p>
                        </div>
                    </div>
                </div>



               

              {isProcessRefund && (
                    <ProcessRefund
                        onClose={handleProcessClose}
                        rma={rma}

                    />
                )}

                {isProcessReplacement && (
                    <ProcessReplacement
                        onClose={handleProcessClose}
                        rma={rma}
                    />
                )}


                {isRefundForm && (
                    <RefundForm
                        onClose={handleRefundFormClose}
                    />
                )}
            </div>
        </div>
    );
};

export default ViewRMACashier;
