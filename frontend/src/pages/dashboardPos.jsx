import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GrPowerReset } from 'react-icons/gr';
import Spinner from '../components/Spinner';
import SearchBar from '../components/SearchBar';

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
  
      // Sort transactions by date descending
      const sortedOrders = response.data.data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
      setSalesOrder(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
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
  };
  
  const handleCashierNameChange = (event) => setCashierName(event.target.value);

  // Utility function for formatting date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(date));
  };

  return (
    <div className={`h-full ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG'}`}>
      <Navbar />
      <div className='h-full px-6 pt-[70px]'>
        <div className='flex items-center justify-center py-5'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT' }`}>Transaction</h1>
          <div className='w-full flex  justify-end '>
            <SearchBar 
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD'}`}>
            <div className={`flex flex-col space-y-4 ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
              <div className='flex flex-col'>
                <label htmlFor='CashierName' className='text-[#9C9C9C]'>CASHIER</label>
                <input
                  id='CashierName'
                  value={cashierName}
                  onChange={handleCashierNameChange}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                  placeholder='Search by Cashier Name'
                />
              </div>

              <div className='flex flex-col'>
                <label htmlFor='startDate' className='text-[#9C9C9C]'>DATE</label>
                <select
                  id='startDate'
                  onChange={handleDateFilter}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
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
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-CARD1' : 'dark:border-dark-CARD1'}`}>
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
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-CARD1' : 'dark:border-dark-CARD1'}`}>
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
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-CARD1' : 'dark:border-dark-CARD1'}`}>
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
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-CARD1' : 'dark:border-dark-CARD1'}`}>
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
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
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
                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide ${darkMode ? 'bg-light-TABLE text-dark-TEXT' : 'dark:bg-dark-TABLE light:text-light-TEXT'}`}
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
                <div className='w-[80%] h-[76vh] flex items-center justify-center'>
                  <p className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>No Successful Transactions</p>
                </div>
              ) : (
                <div className='w-[80%] h-[76vh] flex flex-col gap-4 overflow-y-auto scrollbar-custom'>
                  {salesOrder.map((transaction) => (
                    <div
                      key={transaction._id}
                      className={`rounded-lg p-4 flex gap-4 ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD'}`}
                      //onClick={() => handleTransactionClick(transaction.transaction_id)}
                    >
                      <div className={`flex items-center justify-center p-4 w-[15%] border-r-2 ${darkMode ? 'border-light-ACCENT' : 'dark:border-dark-ACCENT'}`}>
                        <h1 className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>{transaction.transaction_id || 'N/A'}</h1>
                      </div>
                      <div className='flex justify-between items-center w-[85%]'>
                        <div className='p-4 w-[70%] flex flex-col gap-1'>
                          {transaction.products.length > 0 ? (
                            transaction.products.map((item, idx) => (
                              <p key={idx} className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
                                ({item.quantity || 'N/A'}) {item.product.name || 'Unknown Product'}
                              </p>
                            ))
                          ) : (
                            <p className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>No products available</p>
                          )}
                        </div>
                        <div className={`flex gap-6 w-[50%] justify-between ${darkMode ? 'text-light-TABLE' : 'dark:text-dark-TABLE'}`}>
                          <div className='flex flex-col gap-1'>
                            <p className='text-gray-400'>DATE</p>
                            <p className='text-gray-400'>CUSTOMER</p>
                            <p className='text-gray-400'>TOTAL AMOUNT</p>
                          </div>
                          <div className={`flex flex-col gap-1 ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
                            <p className='ml-auto'>{formatDate(transaction.transaction_date)}</p>
                            <p className='ml-auto'>{transaction.customer ? transaction.customer.name || 'None' : 'None'}</p>
                            <p className='ml-auto'>₱ {transaction.total_price ? transaction.total_price.toFixed(2) : '0.00'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPos;
