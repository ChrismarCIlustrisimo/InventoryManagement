import React, { useState, useEffect } from "react"; 
import { useTheme } from '../context/ThemeContext';
import { RiRefundLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Import Axios
import ReplacementReceipt from "./ReplacementReceipt";
import { API_DOMAIN } from "../utils/constants";
import { useAuthContext } from '../hooks/useAuthContext';

const ProcessReplacement = ({ onClose, rma }) => {
    const { darkMode } = useTheme();
    const navigate = useNavigate(); 
    const [availableProduct, setAvailableProduct] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [productList, setProductList] = useState([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [newSerialNumber, setNewSerialNumber] = useState('');
    const baseURL = API_DOMAIN;
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchProductList = async () => {
            try {
                const response = await axios.get(`${baseURL}/product/${rma.product_id}`);
    
                // Get the whole product object
                const productData = response.data;
    
                // Filter units to include only those with status 'in_stock'
                const inStockUnits = productData.units.filter(unit => unit.status === 'in_stock');
    
                // Set the entire product data if needed, or just the in-stock units
                setProductList(inStockUnits); // Pass filtered in-stock units into state
    
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to fetch product');
            }
        };
    
        fetchProductList();
    }, [rma.product_id]);
    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleChange = (event) => {
        setAvailableProduct(event.target.value);
    };

    const handleReplacementSubmit = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirm = async () => {
        const selectedUnit = productList.find(unit => unit.serial_number === availableProduct);
    
        if (!selectedUnit) {
            toast.error('Selected unit not found');
            return;
        }
    
        try {
            const response = await axios.put(`${baseURL}/transaction/${rma.transaction}/replace-units`, {
                products: [
                    {
                        old_serial_number: rma.serial_number,
                        new_serial_number: availableProduct // This should be defined and assigned correctly
                    }
                ],
                rmaId: rma.rma_id 
            });
    
            if (response.status === 200) {
                setNewSerialNumber(availableProduct); // Store the new serial number
                setShowReceipt(true); // Show the receipt
                console.log('Receipt should now be shown.'); // Add this line
                toast.success("Units replaced successfully!");
                navigate(-1);
    
                // Log audit data for the unit replacement
                const unitReplacementAuditData = {
                    user: rma.cashier,  // User who is processing the replacement
                    action: 'UPDATE',  // Action type
                    module: 'RMA',  // Module name
                    event: `Processed Replacement for transaction ${rma.transaction}`,  // Event description
                    previousValue: 'N/A',  // The old serial number
                    updatedValue: rma.transaction,  // The new serial number
                };
    
                // Send audit log data to the backend
                axios.post(`${API_DOMAIN}/audit`, unitReplacementAuditData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,  // Assuming token-based authorization
                    },
                })
                .catch((error) => {
                    console.error("Error logging audit:", error);
                    toast.error("Failed to log audit.");
                });
    
            } else {
                toast.error(response.data.message || 'Failed to replace units');
            }
        } catch (error) {
            console.error('Error processing replacement:', error);
            toast.error(error.response?.data?.message || 'Server error while processing replacement');
        }
    };
    
    
    
    

    const handleCancel = () => {
        setShowConfirmDialog(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <ToastContainer />
            <div className={`max-w-2xl w-full rounded-md shadow-md relative h-[94%] ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`}>
                <div className="absolute top-2 right-2">
                    <button className="absolute top-2 right-4 text-black hover:text-gray-700" onClick={onClose}>✖</button>
                </div>
                <h2 className={`text-3xl font-bold mb-6 flex items-center justify-center gap-4 border-b py-3 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
                    <RiRefundLine />
                    <span>Process Replacement</span>
                </h2>
                <div className='flex flex-col w-full h-full justify-start pl-12 py-4 gap-6'>
                    <div className="flex flex-col w-full h-full overflow-y-auto py-2" style={{ maxHeight: '88%' }}>
                        {/* Transaction Info */}
                        <div className="flex flex-col gap-6 py-4">
                            <div className="flex">
                                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</p>
                                <p className={`font-semibold w-[60%]`}>{rma.transaction}</p>
                            </div>
                            <div className="flex">
                                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SALE DATE</p>
                                <p className={`font-semibold w-[60%]`}>{formatDate(rma.transaction_date) || 'N/A'}</p>
                            </div>
                            <div className="flex">
                                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CUSTOMER NAME</p>
                                <p className={`font-semibold w-[60%]`}>{rma.customer_name || 'N/A'}</p>
                            </div>
                            <div className="flex">
                                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CASHIER</p>
                                <p className={`font-semibold w-[60%]`}>{rma.cashier || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col gap-6">
                            <p className="text-xl font-bold py-6">Products Being Refunded</p>
                            <div className="flex">
                                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT NAME</p>
                                <p className={`font-semibold w-[60%]`}>{rma.product}</p>
                            </div>
                            <div className="flex">
                                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SERIAL NUMBER</p>
                                <p className={`font-semibold w-[60%]`}>{rma.serial_number}</p>
                            </div>
                            <div className="flex">
                                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>UNIT PRICE</p>
                                <p className={`font-semibold w-[60%]`}>{rma.product_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* Reason for Return */}
                        <div className="flex flex-col gap-6 pt-12">
                            <div className='flex'>
                                <label htmlFor='availableProduct' className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                                    AVAILABLE PRODUCT
                                </label>
                                <select
                                        id='availableProduct'
                                        name="availableProduct"
                                        value={availableProduct}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded w-[50%] p-1"
                                    >
                                        <option value="">Select a unit for Replacement</option>
                                        {productList.map((unit, index) => (
                                            <option key={index} value={unit.serial_number}>
                                                {unit.serial_number}
                                            </option>
                                        ))}
                                    </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-start gap-5 mt-10 pb-6 pr-8 ">
                            <button
                                id='submitReplacementButton'
                                className={`w-[46%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
                                onClick={handleReplacementSubmit}
                                disabled={!availableProduct || productList.length === 0}
                            >
                                Submit Replacement
                            </button>
                            <button
                                id='CancelReplacementButton'
                                onClick={onClose}
                                className={`w-[46%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
                <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50`}>
                    <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                            Confirm Replacement
                        </h3>
                        <p className={`mb-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                            Are you sure you want to replace the serial number <strong>{rma.serial_number}</strong> with <strong>{availableProduct}</strong>?
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-12">
                             <button
                                id='confirmButton'
                                onClick={handleConfirm}
                                className={`w-[50%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
                                >
                                Yes
                            </button>
                            <button
                                id='NoButton'
                                onClick={handleCancel}
                                className={`w-[50%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {showReceipt && (
                <ReplacementReceipt
                    rma={rma}
                    newSerialNumber={newSerialNumber}
                    oldSerialNumber={rma.serial_number}
                    onClose={() => {
                        setShowReceipt(false);
                        setNewSerialNumber(''); // Reset the serial number
                    }}
                />
            )}


        </div>
    );
};

export default ProcessReplacement;
