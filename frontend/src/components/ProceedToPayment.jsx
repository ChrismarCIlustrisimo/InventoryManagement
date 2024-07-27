import React from 'react'
import { useTheme } from '../context/ThemeContext';
import { IoIosClose } from "react-icons/io";

const ProceedToPayment = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { darkMode } = useTheme(); // Access darkMode from context

  
  return (
    <div className="z-20 fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center backdrop-blur-md" 
      onClick={onClose}
    >
      <div className={`p-2 rounded-2xl shadow-md w-[70%] h-[60%] p-6 ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD' } flex flex-col`}
        onClick={(e) => e.stopPropagation()}>
        <div className='w-full flex justify-end'>
            <button   className={`text-4xl font-bold rounded ${darkMode ? 'text-light-TEXT hover:text-dark-ACCENT' : 'text-dark-TEXT hover:text-light-ACCENT'}`} onClick={onClose}>
            <IoIosClose />

            </button>
        </div>

        <div className='flex gap-2 items-center justify-center w-full h-full'>
            <div className='w-[40%] h-full'>
                <p className='mb-2'>Bill To:</p>
                <div className='flex flex-col gap-4'>
                    <input type="text" placeholder='Customer Name' className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`}></input>
                    <input type="text" placeholder='Customer Name' className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`}></input>
                    <input type="text" placeholder='Customer Name' className={`p-2 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1' }`}></input>
                </div>
            </div>  
    
            <div className='w-[60%] h-full'>
                <div className={`flex flex-col w-full h-full px-4 py-4 rounded-2xl gap-6`}>
                <div className='flex w-full justify-between items-center'>
                    <div className='flex gap-7 flex-col'>
                    <p>Discount</p>
                    <p>Amount</p>
                    <p>Total Amount</p>
                    </div>
                    <div className='flex gap-7 flex-col items-end'>
                    <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-ACCENT' : 'dark:border-dark-ACCENT'}`}>₱ 6333</p>
                    <p>6333</p>
                    <p>6333</p>
                    </div>
                </div>
                <div className='flex w-full justify-between items-center'>
                    <div className='flex gap-7 flex-col'>
                    <p>Total Amount Paid</p>
                    <p>Discount</p>
                    <p>Change</p>
                    </div>
                    <div className='flex gap-7 flex-col items-end'>
                    <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-ACCENT' : 'dark:border-dark-ACCENT'}`}>₱ 6333</p>
                    <p>₱ 6333</p>
                    <p>₱ 6333</p>
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

export default ProceedToPayment
