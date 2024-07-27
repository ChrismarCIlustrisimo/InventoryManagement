import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackNavbar from '../components/BackNavbar';
import Spinner from '../components/Spinner';
import { useTheme } from '../context/ThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';

const Transaction = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = 'http://localhost:5555';
  const { darkMode } = useTheme(); // Access darkMode from context
  const { user } = useAuthContext(); // Assuming useAuthContext provides user object

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`  // Replace with your actual authentication token
          }
        });
        setTransaction(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setLoading(false);
      }
    };
  
    fetchTransaction();
  }, [id, user.token]);

  // Helper function to format date
  const formatDate = (date) => {
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) { // Check if date is valid
        return 'Invalid date'; // Return a fallback value
      }
      
      // Options for formatting the month and day
      const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(parsedDate);
      const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(parsedDate);
      const year = new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(parsedDate);
      
      // Construct the formatted date string with comma
      return `${day} ${month}, ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date'; // Return a fallback value
    }
  };
  

  if (loading) {
    return <Spinner />;
  }

  if (!transaction) {
    return (
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
      >
        Transaction not found
      </div>
    );
  }

  return (
    <div className={`pt-20 px-20 pb-5 h-screen w-full ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG'}`}>
      <BackNavbar id={transaction._id}/>
      <div className='flex justify-center items-center h-full gap-6'>
        {/* Left Section */}
        <div className='flex flex-col items-end justify-start h-full w-[40%] p-4 gap-6'>
          <p className={`w-full text-left text-4xl font-semibold ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Order Number: {transaction.transaction_id}</p>
          <div className={`flex flex-col gap-4 w-full ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
            <h4 className={`font-medium text-2xl ${darkMode ? 'text-light-ACCENT' : 'dark:text-dark-ACCENT'}`}>Order Details</h4>
            <div className='flex items-center w-[70%] justify-between'> 
              <div className='flex items-start justify-between flex-col text-l gap-3'> 
                <p>TRANSACTION DATE</p>
                <p>DUE DATE</p>
              </div>
              <div className='flex items-start justify-between flex-col text-l gap-3'>
                <p className='tracking-wider'>{formatDate(transaction.transaction_date)}</p>
                <p className='text-l tracking-wider'>{formatDate(transaction.transaction_date)}</p>
              </div>
            </div>
          </div>
          
          <div className={`flex flex-col gap-4 w-full ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
            <h4 className={`font-medium text-2xl ${darkMode ? 'text-light-ACCENT' : 'dark:text-dark-ACCENT'}`}>Customer Details</h4>
            <div className='flex items-center w-[95%] justify-between'>
              <div className='flex items-start justify-between flex-col text-l gap-3'>
                <p>CUSTOMER NUMBER</p>
                <p>CONTACT NUMBER</p>
                <p>EMAIL</p>
                <p>ADDRESS</p>
              </div>
              <div className='flex items-start justify-between text-l flex-col gap-3'>
                <p className='tracking-wider'>{transaction.customer.name}</p>
                <p className='tracking-wider'>{transaction.customer.phone}</p>
                <p className='tracking-wider'>{transaction.customer.email}</p>
                <p className='tracking-wider'>{transaction.customer.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className={`h-full w-[40%] p-6 rounded-2xl ${darkMode ? 'bg-light-CARD text-light-TEXT' : 'dark:bg-dark-CARD text-dark-TEXT'}`}>
          {/* Invoices */}
          <div className='flex flex-col gap-2'>
            <p className='text-2xl'>Invoices</p>
            <div className='overflow-y-auto h-[280px] w-full'>
              <table className='m-w-full border-collapse table-fixed h-[120px]'>
                <thead>
                  <tr className='border-b border-primary'>
                    <th className={`sticky top-0 px-4 py-2 text-left ${darkMode ? 'bg-light-TABLE' : 'dark:bg-dark-TABLE'}`}>Product</th>
                    <th className={`sticky top-0 px-4 py-2 text-left ${darkMode ? 'bg-light-TABLE' : 'dark:bg-dark-TABLE'}`}>Unit Price</th>
                    <th className={`sticky top-0 px-4 py-2 text-left ${darkMode ? 'bg-light-TABLE' : 'dark:bg-dark-TABLE'}`}>Qty</th>
                    <th className={`sticky top-0 px-4 py-2 text-left ${darkMode ? 'bg-light-TABLE' : 'dark:bg-dark-TABLE'}`}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.products.map((item, idx) => (
                    <tr key={idx} className='border-b border-dark-ACCENT gap-2'>
                      <td className='px-4 py-1 flex gap-4 items-center justify-start'>
                        {/* Ensure the image path is correctly constructed */}
                        <img
                          src={`${baseURL}/images/${item.product.image.substring(14)}`}
                          className='w-16 h-16 object-cover rounded-lg'
                        />
                        <p className='text-sm w-full'>{item.product.name}</p>
                      </td>
                      <td className='px-4 py-2'>{item.product.selling_price}</td>
                      <td className='px-4 py-2'>{item.quantity}</td>
                      <td className='px-4 py-2'>{(item.quantity * item.product.selling_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`flex flex-col w-full px-4 py-4 rounded-2xl gap-6 ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1'}`}>
              <div className='flex w-full justify-between items-center'>
                <div className='flex gap-3 flex-col'>
                  <p>Discount</p>
                  <p>Amount</p>
                  <p>Total Amount</p>
                </div>
                <div className='flex gap-3 flex-col items-end'>
                  <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-ACCENT' : 'dark:border-dark-ACCENT'}`}>₱ 6333</p>
                  <p>6333</p>
                  <p>6333</p>
                </div>
              </div>
              <div className='flex w-full justify-between items-center'>
                <div className='flex gap-3 flex-col'>
                  <p>Total Amount Paid</p>
                  <p>Discount</p>
                  <p>Change</p>
                </div>
                <div className='flex gap-3 flex-col items-end'>
                  <p className={`border w-[140px] rounded-md font-semibold flex items-center justify-center ${darkMode ? 'border-light-ACCENT' : 'dark:border-dark-ACCENT'}`}>₱ {(transaction.total_price - (transaction.total_price * 0.12)).toFixed(2)}</p>
                  <p>₱ {transaction.total_amount_paid}</p>
                  <p>₱ {(transaction.total_amount_paid - (transaction.total_price)).toFixed(2)}</p>
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
  );
};

export default Transaction;
