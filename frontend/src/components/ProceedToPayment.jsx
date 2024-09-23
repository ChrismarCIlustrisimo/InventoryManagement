import React, { useState, useContext } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoIosClose } from "react-icons/io";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const formatNumber = (value) => {
  if (value === '' || isNaN(value)) return '';
  const number = Number(value.replace(/,/g, ''));
  return number.toLocaleString();
};

const parseNumber = (value) => {
  return value.replace(/,/g, '');
};

const ProceedToPayment = ({ isOpen, onClose, totalAmount, cart, onPaymentSuccess, onPaymentError }) => {
  if (!isOpen) return null;
  const baseURL = 'http://localhost:5555';
  const { darkMode } = useTheme();
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const { user } = useContext(AuthContext);


  const validatePhoneNumber = (number) => {
    const phoneRegex = /^09\d{9}$/; // Matches numbers like 09854875843
    return phoneRegex.test(number);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
    return emailRegex.test(email);
  };


  const calculateDiscount = () => {
    if (discountType === 'percentage') {
      return totalAmount * (discountValue / 100);
    }
    return discountValue; // Assumes discountValue is a fixed amount
  };

  const handleBackgroundClick = (e) => {
    e.stopPropagation();
  };

  const finalAmount = totalAmount - calculateDiscount();
  const change = (parseNumber(paymentAmount) || 0) - finalAmount;

  const handlePayButton = async () => {

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
    if (paymentAmount.trim() === '') {
      toast.warning('Please enter a payment amount.');
      return;
    }
  
    if (parseNumber(paymentAmount) < finalAmount) {
      toast.warning('Payment amount is less than the total amount.');
      return;
    }
  
    // Validate customer information
    if (!customerName.trim() || !address.trim() || !phoneNumber.trim() || !email.trim()) {
      toast.warning('Please fill in all customer information fields.');
      return;
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
  
      // Step 2: Prepare Transaction Data
      const transactionData = {
        products: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        customer: customerId,
        total_price: totalAmount,
        total_amount_paid: parseNumber(paymentAmount) || 0,
        transaction_date: new Date().toISOString(),
        cashier: user.name,
        payment_status: 'paid'
      };
  
      // Step 3: Create the Transaction
      await axios.post(`${baseURL}/transaction`, transactionData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Step 4: Update Product Quantities and Sales
      const updates = cart.map(item => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: { 
            $inc: { 
              quantity_in_stock: -item.quantity, 
              sales: item.quantity 
            } 
          }
        }
      }));
  
      await axios.put(`${baseURL}/product/bulk-update`, updates, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      onClose(); // Close the modal
      onPaymentSuccess(); // Call the onPaymentSuccess prop
  
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message);
      onPaymentError(); // Call the onPaymentError prop
    }
  };
  
  

  return (
    <div className="z-20 fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center backdrop-blur-md"
      onClick={handleBackgroundClick}
    >
      <div className={`p-2 rounded-2xl shadow-md w-[70%] h-[80%] p-6 ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } flex flex-col`}
        onClick={(e) => e.stopPropagation()}>
        <div className='w-full flex justify-end'>
          <button className={`text-4xl font-bold rounded ${darkMode ? 'text-light-TEXT hover:text-dark-ACCENT' : 'text-dark-TEXT hover:text-light-ACCENT'}`} onClick={onClose}>
            <IoIosClose />
          </button>
        </div>

        <div className='flex gap-2 items-center justify-center w-full h-full'>
          <div className='w-[40%] h-full'>
            <p className='mb-2'>Bill To:</p>
            <div className='flex flex-col gap-4'>
              <input
                type="text"
                placeholder='Customer Name'
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`}
              />
              <input
                type="text"
                placeholder='Address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`}
              />
              <input
                type="text"
                placeholder='Phone Number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`}
              />
                <input
                type="text"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`}
              />
            </div>
          </div>

          <div className='w-[60%] h-full'>
            <div className={`flex flex-col w-full h-full px-4 py-4 rounded-2xl gap-6`}>
              <div className='flex w-full justify-between items-center'>
                <div className='flex gap-7 flex-col'>
                   <p>Add Discount</p>
                  <p>Discount</p>
                  <p>Amount</p>
                  <p>Total Amount</p>
                </div>
                <div className='flex gap-7 flex-col items-end'>
                  <div className='flex items-center'>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1'}`}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="amount">Fixed Amount</option>
                    </select>
                    <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        placeholder={discountType === 'percentage' ? "0%" : "₱ 0"}
                        className={`p-2 ml-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1'}`}
                      />
                  </div>
                  <p>₱ {calculateDiscount().toLocaleString()}</p>
                  <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-ACCENT' : 'dark:border-dark-ACCENT'}`}>₱ {totalAmount.toLocaleString()}</p>
                  <p>₱ {finalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className='flex w-full justify-between items-center'>
                <div className='flex gap-7 flex-col'>
                  <p>Add Payment</p>
                  <p>Total Amount Paid</p>
                  <p>Discount</p>
                  <p>Change</p>
                </div>
                <div className='flex gap-7 flex-col items-end'>
                  <input
                    type="text"
                    value={formatNumber(paymentAmount)}
                    onChange={(e) => setPaymentAmount(parseNumber(e.target.value))}
                    placeholder="₱ 0"
                    className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1'}`}
                  />
                  <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-ACCENT' : 'dark:border-dark-ACCENT'}`}>₱ {formatNumber(paymentAmount)}</p>
                  <p>₱ {calculateDiscount().toLocaleString()}</p>
                  <p>{change < 0 ? '₱ 0.00' : change.toLocaleString()}</p>
                </div>
              </div>
              <button
                className={`mt-4 p-2 rounded-md font-semibold ${darkMode ? 'bg-light-ACCENT text-dark-TEXT hover:bg-light-ACCENT' : 'bg-dark-ACCENT text-dark-TEXT hover:bg-dark-ACCENT'}`}
                onClick={handlePayButton}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProceedToPayment;
