import React, { useState, useContext, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoIosClose } from "react-icons/io";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Ensure you import useNavigate
import { BiArrowBack } from "react-icons/bi";
import { API_DOMAIN } from '../utils/constants';


const ProceedToPayment = ({ isOpen, onClose, totalAmount, cart, onPaymentSuccess, onPaymentError }) => {
  if (!isOpen) return null;
  const baseURL = API_DOMAIN;
  const { darkMode } = useTheme();
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isCustomerInput, setIsCustomerInput] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(''); // Add this line
  const [referenceNumber, setReferenceNumber] = useState('');


  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
};

// Ensure the value is a string before calling replace
const parseNumber = (value) => {
  // Convert the value to a string, then apply replace
  if (value && typeof value === 'string') {
    return value.replace(/[^\d.-]/g, ''); // Example to remove non-numeric characters
  } else if (typeof value === 'number') {
    return value.toString(); // If it's a number, convert to string
  }
  return ''; // Return empty string if value is not valid
};

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^09\d{9}$/; 
    return phoneRegex.test(number);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
    return emailRegex.test(email);
  };

  const calculateDiscount = () => {
    return discountValue; // Assumes discountValue is a fixed amount
  };

  const handleBackgroundClick = (e) => {
    e.stopPropagation();
  };
  const calculateTotalVAT = () => {
    const totalPrice = cart.reduce((acc, item) => {
      return acc + item.product.selling_price * item.quantity;
    }, 0);
  
    // Calculate VAT based on total price
    const totalVAT = (totalPrice / 1.12) * 0.12;
    return totalVAT;
  };
  
  const totalVAT = calculateTotalVAT();
  
  
  const finalAmount = totalAmount - calculateDiscount();

  const change = (parseNumber(paymentAmount) || 0) - finalAmount;

  const handlePayButton = async () => {
    // Ensure paymentAmount is a string before using trim
    const paymentAmountStr = String(paymentAmount).trim(); // Convert to string and trim
  
    if (!validatePhoneNumber(phoneNumber)) {
      toast.warning('Please enter a valid phone number (e.g., 09854875843).');
      return;
    }
  
    // Validate email
    if (!validateEmail(email)) {
      toast.warning('Please enter a valid email address (e.g., chris@gmail.com).');
      return;
    }
  
    // Validate paymentAmount
    if (paymentAmountStr === '') {
      toast.warning('Please enter a payment amount.');
      return;
    }
  
    if (parseNumber(paymentAmountStr) < finalAmount) {
      toast.warning('Payment amount is less than the total amount.');
      return;
    }
  
    // Validate customer information
    if (!customerName.trim() || !address.trim() || !phoneNumber.trim() || !email.trim()) {
      toast.warning('Please fill in all customer information fields.');
      return;
    }
  
    // Validate payment method
    if (paymentMethod === '') {
      toast.warning('Please select a payment method');
      return;
    }
    if(paymentMethod !== 'Cash'){
      if (referenceNumber === '') {
        toast.warning('Please input reference number');
        return;
      }
    }
  
    try {
      // Step 1: Create or Find the Customer
      const customerResponse = await axios.post(`${baseURL}/customer`, {
        name: customerName,
        email: email,
        phone: phoneNumber,
        address: address,
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const customerId = customerResponse.data._id;
  
      // Log audit event for customer creation (without previousValue)
      const customerAuditData = {
        user: user.name,
        action: 'Create',
        module: 'Customer',
        event: `Created customer with ID ${customerId}`,
        previousValue: null,  // No previous value since it's a creation
        updatedValue: {
          name: customerName,
          email: email,
          phone: phoneNumber,
          address: address,
        }
      };
  
      await axios.post(`${baseURL}/audit`, customerAuditData);
  
      // Check for serial numbers in the cart
      cart.forEach(item => {
        if (!item.unitIds || item.unitIds.length === 0) {
          throw new Error(`Serial numbers (unit IDs) are missing for product ID ${item.product._id}`);
        }
      });
  
      const transactionData = {
        products: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          serial_number: item.unitIds || [],
        })),
        customer: customerId,
        total_price: finalAmount,
        total_amount_paid: parseNumber(paymentAmountStr) || 0,
        transaction_date: new Date().toISOString(),
        cashier: user.name,
        payment_status: 'paid',
        status: 'Completed',
        vat: totalVAT,
        discount: discountValue,
        payment_method: paymentMethod,
        reference_number: referenceNumber,
      };
  
      // Log audit event for transaction creation (without previousValue)
      const transactionAuditData = {
        user: user.name,
        action: 'Create',
        module: 'Transaction',
        event: `Created transaction with total amount ${finalAmount} for customer ID ${customerId}`,
        previousValue: null,  // No previous value since it's a creation
        updatedValue: transactionData,
      };
  
      await axios.post(`${baseURL}/audit`, transactionAuditData);
  
      // Step 3: Create the Transaction
      const transactionResponse = await axios.post(`${baseURL}/transaction`, transactionData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const transactionId = transactionResponse.data.transaction_id;
  
      // Step 4: Update Sales Only
      const updates = cart.map(item => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: {
            $inc: {
              sales: item.quantity // Increment the sales by the quantity sold
            },
          },
        },
      }));
  
      // Log audit event for sales update (no previous value, only updated value)
      const salesUpdateAuditData = {
        user: user.name,
        action: 'Create',
        module: 'POS',
        event: `Added new sale Transaction`,
        previousValue: "N/A",  // No previous value
        updatedValue: transactionId,
      };
  
      await axios.post(`${baseURL}/audit`, salesUpdateAuditData);
  
      // Send the updates to the bulk-update endpoint (if needed, modify accordingly)
      await axios.put(`${baseURL}/product/bulk-update`, updates, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
  
      navigate('/receipt', { state: { transaction: transactionData, transactionId: transactionId, totalVAT: totalVAT, discount: discountValue } });
      onClose(); // Close the modal
      onPaymentSuccess(transactionData);
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message);
      onPaymentError(); // Call the onPaymentError prop
    }
  };
  
  
  
  const handleBackButtonClick = () => {
    setIsCustomerInput(true); // Reset to customer input
  };

  const handleContinueClick = async () => {
    if (!customerName.trim() || !address.trim() || !phoneNumber.trim() || !email.trim()) {
      toast.warning('Please fill in all customer information fields.');
      return; 
    }

      if (!validatePhoneNumber(phoneNumber)) {
      toast.warning('Please enter a valid phone number with eleven digits (e.g., 09123456789).');
      return;
    }
    
      if (!validateEmail(email)) {
      toast.warning('Please enter a valid email address (e.g., chris@gmail.com).');
      return;
    }

      setIsCustomerInput(false);
  };


  // Function to format numbers as currency
const formatNumber = (num) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};



useEffect(() => {
  // Automatically set paymentAmount when payment method changes
  if (paymentMethod !== 'Cash' && paymentMethod !== '') {
    setPaymentAmount(totalAmount - discountValue); // Set total price
  }
}, [paymentMethod, totalVAT, totalAmount, discountValue]);


  return (
    <div className="z-20 fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center backdrop-blur-md"
      onClick={handleBackgroundClick}
    >
      <div className={`rounded-2xl shadow-md w-[70%] h-[90%] p-6 relative ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container' } flex flex-col`}
        onClick={(e) => e.stopPropagation()}>

        <div className='flex gap-2 items-center justify-center w-full h-full'>

        {!isCustomerInput && (
            <button 
            className={`flex gap-2 items-center py-4 px-6 outline-none absolute top-[10px] left-[5px] ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} hover:underline`}
              onClick={handleBackButtonClick}
            >
            <BiArrowBack size={30} />
           </button>
          )}
        {isCustomerInput ? (

          <div className='w-[40%] h-full'>
            <p className='mb-2 text-center text-4xl font-semibold py-6'>Customer Information</p>
            <div className={`flex flex-col gap-4 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                placeholder='Enter Your Full Name'
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`p-2 py-3 rounded-lg border w-full ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder='Enter Your Complete Address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`p-2 py-3 rounded-lg border w-full ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                Contact No.
              </label>
              <input
                id="phoneNumber"
                type="text"
                placeholder='Enter Your Contact No'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`p-2 py-3 rounded-lg border w-full ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder='Enter Your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`p-2 py-3 rounded-lg border w-full ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
              />
            </div>
            <div className='w-full py-6 flex flex-col gap-4'>
              <button
                className={`w-full py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-dark-textPrimary hover:bg-dark-primary'}`}
                onClick={handleContinueClick}
                >
                Continue
              </button>
              <button
                className={`w-full py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                onClick={onClose} // Close the modal
              >
                Cancel
              </button>
            </div>

          </div>

          </div>
          ) : (

          <div className='w-[60%] '>
            <div className={`flex flex-col w-full h-full px-4 py-4 rounded-2xl gap-12 font-semibold`}>
              <div className='flex flex-col w-full justify-between items-center gap-4'>
              <p className='text-center text-4xl font-semibold py-4'>Payment Details</p>


                <div className='w-full flex items-center  '>
                  <p className='w-[50%]'>Vatable Sales</p>
                  <p className='w-[50%]'>₱ {(totalAmount / 1.12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className='w-full flex items-center  '>
                  <p className='w-[50%]'>VAT (12%)</p>
                  <p className='w-[50%]'>₱ {((totalAmount / 1.12) * 0.12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

                <div className='w-full flex items-center'>
                  <p className='w-[50%]'>Total Amount</p>
                  <p className='w-[50%]'>₱ {formatNumber(totalAmount - discountValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>

              </div>



              <div className='flex flex-col w-full justify-between items-center gap-2'>
                
              <div className='w-full flex items-center'>
                  <p className='w-[50%]'>Discount</p>
                  <div className='w-[50%]'>
                    <input
                      type="number"
                      value={discountValue === 0 ? '' : discountValue}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value); // Allow empty input
                        if (value === '' || value <= totalAmount) {
                          setDiscountValue(value);
                        } else {
                          setDiscountValue(totalAmount); // Optional: Set to max if exceeded
                        }
                      }}
                      max={totalAmount}
                      placeholder="₱ 0"
                      className={`p-2 border w-[240px] ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
                    />
                  </div>
                </div>

                
              <div className='w-full flex items-center'>
                  <p className='w-[50%]'>Payment Method</p>
                  <div className='w-[50%]'>
                    <select
                      id='paymentMethod'
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                      className={`border rounded p-2 w-[240px]  ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
                    >
                      <option value=''>Select Option</option>
                      <option value='Cash'>Cash</option>
                      <option value='GCash'>GCash</option>
                      <option value='GGvices'>GGvices</option>
                      <option value='Bank Transfer'>Bank Transfer</option>
                      <option value='BDO Credit Card'>BDO Credit Card</option>
                      <option value='Credit Card - Online'>Credit Card - Online</option>
                    </select>
                  </div>
                </div>

                {/* Conditionally render reference number field based on payment method */}
                {paymentMethod !== 'Cash' && paymentMethod !== '' && (
                  <div className='w-full flex items-center'>
                    <p className='w-[50%]'>Reference Number</p>
                    <div className='w-[50%]'>
                      <input
                        type='text'
                        id='referenceNumber'
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className={`border rounded p-2 w-[240px] ${darkMode ? 'border-light-border' : 'dark:border-dark-border'} outline-none font-semibold`}
                        placeholder='Enter Reference Number'
                      />
                    </div>
                  </div>
                )}

                {/* Payment Received field */}
                <div className='w-full flex items-center'>
                  <p className='w-[50%]'>Payment Received</p>
                  <input
                    type="text"
                    value={formatNumber(paymentAmount)}
                    onChange={(e) => setPaymentAmount(parseNumber(e.target.value))}
                    placeholder="₱ 0"
                    className={`p-2 border w-[240px] ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
                  />
                </div>


                <div className='w-full flex items-center  '>
                  <p className='w-[50%]'>Change</p>
                  <p className='w-[50%]'>{change < 0 ? '₱ 0.00' : change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>
              </div>
              <div className='w-full flex flex-col gap-2 py-2 pt-6'>
                <button
                   className={`w-full py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
                   onClick={handlePayButton}
                >
                  Confirm Payment
                </button>
                <button
                  className={`w-full py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                  onClick={onClose}
                >
                  Cancel Transaction
                </button>
              </div>
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProceedToPayment;
