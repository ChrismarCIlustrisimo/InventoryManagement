import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GrPowerReset } from 'react-icons/gr';
import Spinner from '../components/Spinner2';
import SearchBar from '../components/SearchBar';
import ViewTransactionCashier from '../components/ViewTransactionCashier';

const DashboardPos = () => {
  const { user } = useAuthContext();
  const { darkMode } = useTheme();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [salesOrder, setSalesOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    if (user) {
      fetchSalesOrders();
    }
  }, [startDate, endDate, minPrice, maxPrice, sortBy, searchQuery, cashierName, user]);

  const fetchSalesOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5555/transaction', {
        params: {
          startDate: startDate ? startDate.toISOString() : undefined,
          endDate: endDate ? endDate.toISOString() : undefined,
          minPrice,
          maxPrice,
          sortBy,
          payment_status: 'paid',
          transaction_id: searchQuery,
          cashier: cashierName,
        },
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
  
      // Log the response for debugging
      console.log(response.data);
  
      // Sort transactions by date descending
      const sortedOrders = response.data.data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
      setSalesOrder(sortedOrders);
    } catch (error) {
      console.error('Error fetching sales orders:', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDateFilter = (e) => {
    const value = e.target.value;
    const today = new Date();
    
    if (value === 'today') {
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // Set end of day
      setStartDate(startOfDay);
      setEndDate(endOfDay);
    } else if (value === 'this_week') {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Start of week (Monday)
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // End of week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0); // Set start of day
      endOfWeek.setHours(23, 59, 59, 999); // Set end of day
      setStartDate(startOfWeek);
      setEndDate(endOfWeek);
    } else if (value === 'this_month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      startOfMonth.setHours(0, 0, 0, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
  };
  
  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);
  const handleMinPriceChange = (event) => setMinPrice(event.target.value);
  const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);
  const handleSortByChange = (event) => setSortBy(event.target.value);
  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchQuery(''); // Added to reset searchQuery
    setCashierName(''); // Added to reset cashierName
};

  const handleCashierNameChange = (event) => setCashierName(event.target.value);

  // Utility function for formatting date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', // Use 'short' for abbreviated month
      day: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };


  const getStatusStyles = (item_status) => {
    let statusStyles = {
      textClass: 'text-[#8E8E93]',  // Default grey text
      bgClass: 'bg-[#E5E5EA]',      // Default grey background
    };
  
    switch (item_status) {
      case 'Completed':
        statusStyles = {
          textClass: 'text-[#14AE5C]',  // Green text for Completed
          bgClass: 'bg-[#CFF7D3]',      // Green background for Completed
        };
        break;
      case 'Refunded':
        statusStyles = {
          textClass: 'text-[#EC221F]',  // Red text for Refunded
          bgClass: 'bg-[#FEE9E7]',      // Red background for Refunded
        };
        break;
    }
  
    return statusStyles;
  };
  
  

  return (
<div className={`h-full ${darkMode ? 'bg-light-bg' : 'dark:bg-dark-bg'}`}>
  <Navbar />
  <div className='h-full px-6 pt-[70px]'>
    <div className='flex items-center justify-center py-5'>
      <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Transaction</h1>
      <div className='w-full flex justify-end gap-2 '>
        <SearchBar 
          query={searchQuery}
          onQueryChange={setSearchQuery}
          placeholderMessage={'Search by sales id'}
        />
      </div>
    </div>
    <div className='flex gap-4'>
      <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
        <div className={`flex flex-col space-y-4 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
          <div className='flex flex-col'>
            <label htmlFor='startDate' className='text-[#9C9C9C]'>DATE</label>
            <select
              id='startDate'
              onChange={handleDateFilter}
              className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary'}`}
            >
              <option value=''>Select Option</option>
              <option value='today'>Today</option>
              <option value='this_week'>This Week</option>
              <option value='this_month'>This Month</option>
            </select>
          </div>

          <label className='text-sm text-[#9C9C9C] mb-1'>DATE RANGE</label>

          <div className='flex justify-center items-center'>
            <div className='flex flex-col'>
              <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-container' : 'dark:border-dark-container'}`}>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  dateFormat='MM-dd-yyyy'
                  className='p-1 bg-transparent w-[100%] outline-none'
                  placeholderText='MM-DD-YYYY'
                />
              </div>
            </div>

            <span className='text-2xl text-center h-full w-full text-[#a8adb0] mx-2'>-</span>

            <div className='flex flex-col'>
              <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-container1' : 'dark:border-dark-container1'}`}>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  dateFormat='MM-dd-yyyy'
                  className='bg-transparent w-[100%] p-1 outline-none'
                  placeholderText='MM-DD-YYYY'
                  minDate={startDate}
                />
              </div>
            </div>
          </div>

          <label className='text-sm text-[#9C9C9C] mb-1'>PRICE RANGE</label>

          <div className='flex justify-center items-center'>
            <div className='flex flex-col'>
              <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-container1' : 'dark:border-dark-container1'}`}>
                <input
                  type='number'
                  id='minPrice'
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  className='border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none'
                  min='0'
                  placeholder='Min'
                />
              </div>
            </div>

            <span className='text-2xl text-center h-full w-full text-[#a8adb0] mx-2'>-</span>

            <div className='flex flex-col'>
              <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-container1' : 'dark:border-dark-container1'}`}>
                <input
                  type='number'
                  id='maxPrice'
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  className='border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none'
                  min='0'
                  placeholder='Max'
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='sortBy' className='text-[#9C9C9C]'>SORT BY</label>
            <select
              id='sortBy'
              value={sortBy}
              onChange={handleSortByChange}
              className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary'}`}
            >
              <option value=''>Select Option</option>
              <option value='price_asc'>Price Lowest to Highest</option>
              <option value='price_desc'>Price Highest to Lowest</option>
              <option value='customer_name_asc'>Customer Name A-Z</option>
              <option value='customer_name_desc'>Customer Name Z-A</option>
              <option value='transaction_id_asc'>ID Lowest to Highest</option>
              <option value='transaction_id_desc'>ID Highest to Lowest</option>
            </select>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <button
            className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium ${darkMode ? 'bg-light-textSecondary text-dark-textPrimary' : 'bg-dark-textSecondary text-dark-textPrimary'}`}
            onClick={handleResetFilters}
          >
            <GrPowerReset className='mr-2' />
            <p>Reset Filters</p>
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : salesOrder.length === 0 ? (
        <div className='w-[80%] h-[78vh] flex items-center justify-center'>
          <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No Successful Transactions</p>
        </div>
      ) : (
        <div className="w-[80%] h-[78vh] overflow-y-auto scrollbar-custom">
          <table className="table-auto w-full border-collapse ">
          <thead className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'} sticky top-0`}>
                <tr className={`${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} text-xs border-b border-black`}>
                  <th className="p-2 text-center">Transaction ID</th>
                  <th className="p-2 text-center">Sale Date</th>
                  <th className="p-2 text-center">Customer Name</th>
                  <th className="p-2 text-center">Product Name</th>
                  <th className="p-2 text-center">Model</th>
                  <th className="p-2 text-center">Serial Number</th>
                  <th className="p-2 text-center">Qty. Sold</th>
                  <th className="p-2 text-center">Total Amount</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
            <tbody>
              {salesOrder.map((transaction) => (
                <tr key={transaction._id} className={`${darkMode ? 'text-light-textPrimary bg-light-container ' : 'dark:text-dark-textPrimary bg-dark-container'} text-sm`}>
                  <td className="p-2 text-center">{transaction.transaction_id || 'N/A'}</td>
                  <td className="p-2 text-center">{formatDate(transaction.transaction_date)}</td>
                  <td className="p-2 text-center">{transaction.customer?.name || 'None'}</td>
                  <td className="p-2 text-center">
                    {transaction.products.length > 0
                      ? transaction.products.map((item, idx) => (
                          <div key={idx}>
                            <p>{item.product.name}</p>
                          </div>
                        ))
                      : 'N/A'}
                  </td>
                  <td className="p-2 text-center">
                    {transaction.products.length > 0
                      ? transaction.products.map((item, idx) => (
                          <div key={idx}>
                            <p>{item.product.model}</p>
                          </div>
                        ))
                      : 'N/A'}
                  </td>
                  <td className="p-2 text-center">
                      {transaction.products.length > 0 ? (
                        transaction.products.map((item, idx) => (
                          <div key={idx}>
                            <p>{item.serial_number.length > 0 ? item.serial_number.join(', ') : 'N/A'}</p>
                          </div>
                        ))
                      ) : (
                        'N/A'
                      )}
                    </td>

                  <td className="p-2 text-center">
                    {transaction.products.length > 0
                      ? transaction.products.reduce((acc, item) => acc + item.quantity, 0)
                      : '0'}
                  </td>
                  <td className="p-2 text-center">{transaction.total_price || '0.00'}</td>
                  <td className="p-2 text-center">
                        {transaction.status ? (
                          // Get styles based on transaction status
                          (() => {
                            const { textClass, bgClass } = getStatusStyles(transaction.status);  // Get styles based on the overall transaction status
                            return (
                              <div className={`inline-block p-2 rounded ${textClass} ${bgClass}`}>
                                {transaction.status}
                              </div>
                            );
                          })()
                        ) : (
                          'Pending'
                        )}
                      </td>

                          <td className='text-center py-4 text-sm'>
                          <button
                                className={`px-4 py-2 rounded-md font-semibold text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}
                                onClick={() => handleViewTransaction(transaction)} // Updated this line
                              >
                                View
                              </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
      {isModalOpen && selectedTransaction && (
              <ViewTransactionCashier 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              transaction={selectedTransaction} // Pass selected transaction ID
            />
      )}

</div>

  );
};

export default DashboardPos;