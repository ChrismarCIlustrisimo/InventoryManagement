import React, { useState, useContext } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoIosClose } from "react-icons/io";
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Ensure you import useNavigate

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
  const navigate = useNavigate();
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
          serial_number: item.unitIds || []
        })),
        customer: customerId,
        total_price: totalAmount,
        total_amount_paid: parseNumber(paymentAmount) || 0,
        transaction_date: new Date().toISOString(),
        cashier: user.name,
        payment_status: 'paid'
      };

      // Log the transaction data
      console.log('Received transaction data:', transactionData);

      // Validate and flatten serial numbers
      const serialNumbersToUpdate = transactionData.products.flatMap(product => {
        if (!Array.isArray(product.serial_number)) {
          console.warn(`Expected serial_number to be an array for product ${product.product}, but got:`, product.serial_number);
          return [];
        }
        return product.serial_number;
      });

      // Check for serial numbers to update
      if (!Array.isArray(serialNumbersToUpdate) || serialNumbersToUpdate.length === 0) {
        throw new Error('No serial numbers available for update.');
      }

      // Step 3: Create the Transaction
      await axios.post(`${baseURL}/transaction`, transactionData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

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

      // Send the updates to the bulk-update endpoint (if needed, modify accordingly)
      await axios.put(`${baseURL}/product/bulk-update`, updates, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      navigate('/receipt', { state: { transaction: transactionData } });
      onClose(); // Close the modal
      onPaymentSuccess(transactionData);
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message);
      onPaymentError(); // Call the onPaymentError prop
    }
  };
  
  

  return (
    <div className="z-20 fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center backdrop-blur-md"
      onClick={handleBackgroundClick}
    >
      <div className={`p-2 rounded-2xl shadow-md w-[70%] h-[80%] p-6 ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container' } flex flex-col`}
        onClick={(e) => e.stopPropagation()}>
        <div className='w-full flex justify-end'>
          <button className={`text-4xl font-bold rounded ${darkMode ? 'text-light-textPrimary hover:text-dark-primary' : 'text-dark-textPrimary hover:text-light-primary'}`} onClick={onClose}>
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
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border' }`}
              />
              <input
                type="text"
                placeholder='Address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border' }`}
              />
              <input
                type="text"
                placeholder='Phone Number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border' }`}
              />
                <input
                type="text"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border' }`}
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
                      className={`p-2 ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border'}`}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="amount">Fixed Amount</option>
                    </select>
                    <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        placeholder={discountType === 'percentage' ? "0%" : "₱ 0"}
                        className={`p-2 ml-2 ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border'}`}
                      />
                  </div>
                  <p>₱ {calculateDiscount().toLocaleString()}</p>
                  <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-primary' : 'dark:border-dark-primary'}`}>₱ {totalAmount.toLocaleString()}</p>
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
                    className={`p-2 ${darkMode ? 'bg-light-border' : 'dark:bg-dark-border'}`}
                  />
                  <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-primary' : 'dark:border-dark-primary'}`}>₱ {formatNumber(paymentAmount)}</p>
                  <p>₱ {calculateDiscount().toLocaleString()}</p>
                  <p>{change < 0 ? '₱ 0.00' : change.toLocaleString()}</p>
                </div>
              </div>
              <button
                className={`mt-4 p-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-dark-textPrimary hover:bg-dark-primary'}`}
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
