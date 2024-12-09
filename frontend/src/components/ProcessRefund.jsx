import React, { useState } from "react"; 
import { useTheme } from '../context/ThemeContext';
import { RiRefundLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RefundReceipt from "./RefundReceipt";
import { API_DOMAIN } from "../utils/constants";
import { useAuthContext } from '../hooks/useAuthContext';

const ProcessRefund = ({ rma, onClose }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate(); 
  const [reasonForReturn, setReasonForReturn] = useState("");
  const [totalRefundAmount, setTotalRefundAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [refundData, setRefundData] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState(""); // New state for reference number
  const { user } = useAuthContext();

  const baseURL = API_DOMAIN;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };


  const handleChange = (event) => {
    setReasonForReturn(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleRefundSubmit = () => {
    // Open the confirmation dialog instead of processing immediately
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    const refundData = {
      transaction_id: rma.transaction,
      customer_name: rma.customer_name,
      product_name: rma.product,
      serial_number: rma.serial_number,
      refund_amount: totalRefundAmount,
      refund_method: paymentMethod,
      reference_number: paymentMethod !== 'Cash' ? referenceNumber : '', // Include reference number if payment method isn't cash
      reason: rma.reason,
      unit_price: rma.product_price,
      cashier: rma.cashier,
      sales_date: rma.transaction_date,
    };
    
    axios.post(`${baseURL}/refund`, refundData)
      .then((response) => {
        const createdRefund = response.data.refund;
        setRefundData(createdRefund);
        setIsReceiptOpen(true);
        toast.success("Refund processed successfully!");
  
        // Log audit data for the refund process
        const refundAuditData = {
          user: user.name,  // User who is processing the refund
          action: 'UPDATE',  // Action type
          module: 'RMA',  // Module name
          event: `Processed Refund for transaction ${rma.transaction}`,  // Event description with Transaction ID
          previousValue: 'N/A', 
          updatedValue: rma.transaction,
        };
  
        // Send audit log data to the backend
        axios.post(`${API_DOMAIN}/audit`, refundAuditData, {
          headers: {
            Authorization: `Bearer ${user.token}`,  // Assuming token-based authorization
          },
        })
        .catch((error) => {
          console.error("Error logging audit:", error);
          toast.error("Failed to log audit.");
        });
  
      })
      .catch((error) => {
        console.error("Refund failed: ", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
        toast.error("Failed to process refund.");
      });
  
    setShowConfirmDialog(false); // Close the confirmation dialog
  };
  

  const handleCancel = () => {
    setShowConfirmDialog(false); // Close the confirmation dialog without processing refund
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <ToastContainer />
      <div className={`max-w-3xl w-full rounded-md shadow-md relative h-[94%] ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`}>
        <div className="absolute top-2 right-2">
          <button className="absolute top-2 right-4 text-black hover:text-gray-700" onClick={onClose}>✖</button>
        </div>
        <h2 className={`text-3xl font-bold mb-6 flex items-center justify-center gap-4 border-b py-3 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
          <RiRefundLine />
          <span>Process Refund</span>
        </h2>
        <div className='flex flex-col w-full h-full justify-start pl-12 py-4 gap-6'>
          <div className="flex flex-col w-full h-full overflow-y-auto py-2" style={{ maxHeight: '90%' }}>
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
                <p className={`font-semibold w-[60%]`}>{Number(rma.product_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="flex">
                <p className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REASON FOR REFUND</p>
                <p className={`font-semibold w-[60%]`}>{rma.reason}</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 pt-12">
              <div className="flex">
                <label className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TOTAL REFUND AMOUNT</label>
                <input
                  id='totalRefundAmount'
                  type="number"
                  name="totalRefundAmount"
                  value={totalRefundAmount}
                  onChange={(e) => setTotalRefundAmount(e.target.value)}
                  className="border border-gray-300 rounded w-[40%] p-2"
                  placeholder="Enter Total Refund Amount"
                />
              </div>
              <div className="flex">
                <label className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REFUND METHOD</label>
                <select
                  id='paymentMethod'
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  className={`border rounded p-2 w-[285px] ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
                >
                  <option value=''>Select Option</option>
                  <option value='Cash'>Cash</option>
                  <option value='GCash'>GCash</option>
                  <option value='Bank Transfer'>Bank Transfer</option>
                  <option value='BDO Credit Card'>BDO Credit Card</option>
                  <option value='Credit Card - Online'>Credit Card - Online</option>
                </select>
              </div>

              {paymentMethod !== 'Cash' && paymentMethod !== '' && (
                <div className="flex">
                  <label className={`font-medium w-[40%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REFERENCE NUMBER</label>
                  <input
                    id='referenceNumberID'
                    type="text"
                    name="referenceNumber"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="border border-gray-300 rounded w-[40%] p-2"
                    placeholder="Enter Reference Number"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-start gap-4 mt-12 pb-6 pr-12">
              <button
                onClick={handleRefundSubmit}
                className={`w-[46%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
              >
                Process Refund
              </button>
              <button
                onClick={onClose}
                className={`w-[50%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
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
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Confirm Refund</h3>
            <p className={`mb-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Are you sure you want to process this refund?</p>
            <div className="flex items-center justify-center gap-4 mt-12">
               <button id='confirmButton' onClick={handleConfirm}className={`w-[50%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}>Yes</button>
              <button id='cancelButton' onClick={handleCancel} className={`w-[50%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Receipt */}
      {isReceiptOpen && (
        <RefundReceipt 
          refundData={refundData} 
          onClose={closeReceipt}
          rma={rma} 
        />
      )}
    </div>
  );
};

export default ProcessRefund;
