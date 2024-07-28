import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { IoIosClose } from "react-icons/io";

// Function to format number with commas
const formatNumber = (value) => {
  if (value === '' || isNaN(value)) return '';
  const number = Number(value.replace(/,/g, ''));
  return number.toLocaleString();
};

// Function to parse number removing commas
const parseNumber = (value) => {
  return value.replace(/,/g, '');
};

const ProceedToPayment = ({ isOpen, onClose, totalAmount }) => {
  if (!isOpen) return null;

  const { darkMode } = useTheme();
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');

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
              <input type="text" placeholder='Customer Name' className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`} />
              <input type="text" placeholder='Address' className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`} />
              <input type="text" placeholder='Phone Number' className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`} />
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
                      onChange={(e) => setDiscountValue(e.target.value)}
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

              <button className={`w-full py-3 rounded text-black font-semibold ${darkMode ? 'bg-light-ACCENT text-light-TEXT' : 'dark:bg-dark-ACCENT text-dark-TEXT'}`}>
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProceedToPayment;
