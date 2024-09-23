import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GrPowerReset } from 'react-icons/gr';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';

const SalesOrder = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [salesOrder, setSalesOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const { user } = useAuthContext(); 
  const { darkMode } = useTheme(); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchSalesOrders();
    }
  }, [startDate, endDate, minPrice, maxPrice, sortBy, searchQuery, user]);

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
          payment_status: 'unpaid',  // This is set to 'unpaid'
          transaction_id: searchQuery  
        },
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setSalesOrder(response.data.data); // Ensure this matches the data structure returned from API
    } catch (error) {
      console.error('Error fetching sales orders:', error);
    } finally {
      setLoading(false);
    }
  };
  

  {console.log(salesOrder)}

  const handleTransactionClick = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(date));
  };

  const handleDateFilter = (e) => {
    const value = e.target.value;
    if (value === 'today') {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0); 
      const endOfDay = new Date(today);
      endOfDay.setDate(endOfDay.getDate() + 1); 
  
      setStartDate(startOfDay);
      setEndDate(endOfDay);
    } else if (value === 'this_week') {
      const today = new Date();
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
      const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
      setStartDate(startOfWeek);
      setEndDate(endOfWeek);
    } else if (value === 'this_month') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setStartDate(startOfMonth);
      setEndDate(endOfMonth);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date < startDate) {
      setStartDate(date);
    }
  };

  const handleMinPriceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setMinPrice(value.toString());
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setMaxPrice(value.toString());
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    fetchSalesOrders();
  };

  return (
    <div className={`h-full ${darkMode ? 'bg-light-bg' : 'dark:bg-dark-bg' }`}>
      <Navbar />
      <div className='h-full px-6 pt-[70px]'>
        <div className='flex items-center justify-center py-5'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>Sales Order</h1>
          <div className='w-full flex justify-end'>
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              placeholderMessage={'Search by Sales ID'}
            />
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container' }`}>
            <div className={`flex flex-col space-y-4 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>
              <div className='flex flex-col'>
                <label htmlFor='startDate font-semibold'>Date</label>
                <select
                  id='startDate'
                  onChange={handleDateFilter}
                  className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
                >
                  <option value=''>Select Option</option>
                  <option value='today'>Today</option>
                  <option value='this_week'>This Week</option>
                  <option value='this_month'>This Month</option>
                </select>
              </div>

              <label className='text-sm text-gray-500 mb-1 font-semibold'>DATE RANGE</label>

              <div className='flex justify-center items-center'>
                <div className='flex flex-col'>
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-border' : 'dark:border-dark-border' }`}>
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
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-border' : 'dark:border-dark-border' }`}>
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

              <label className='text-sm text-gray-500 mb-1 font-semibold'>PRICE RANGE</label>

              <div className='flex justify-center items-center'>
                <div className='flex flex-col'>
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-container1' : 'dark:border-dark-container1' }`}>
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
                  <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-container1' : 'dark:border-dark-container1' }`}>
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
              <label className='text-sm text-gray-500 mb-1 font-semibold'>SORT BY</label>
                <select
                  id='sortBy'
                  value={sortBy}
                  onChange={handleSortByChange}
                  className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
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
                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium ${darkMode ? 'bg-light-textSecondary text-dark-textPrimary' : 'bg-dark-textSecondary text-dark-textPrimary' }`}
                onClick={handleResetFilters}
              >
                <GrPowerReset className='mr-2' />
                <p>Reset Filters</p>
              </button>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <Spinner />
          ) : salesOrder.length === 0 ? (
            <div className='w-[80%] h-[76vh] flex items-center justify-center'>
              <p className={`text-xl ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>No Orders Found</p>
            </div>
          ) : (
            <div className='w-[80%] h-[76vh] flex flex-col gap-4 overflow-y-auto scrollbar-custom'>
              {salesOrder.map((transaction) => (
                <div
                  key={transaction._id}
                  className={`rounded-lg p-4 flex gap-4 cursor-pointer ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container' }`}
                  onClick={() => handleTransactionClick(transaction.transaction_id)}
                >
                  <div className={`flex items-center justify-center p-4 w-[15%] border-r-2 ${darkMode ? 'border-light-activeLink' : 'dark:border-dark-activeLink' }`} >
                    <h1 className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>{transaction.transaction_id}</h1>
                  </div>
                  <div className='flex justify-between items-center w-[85%]'>
                    <div className='p-4 w-[70%] flex flex-col gap-1'>
                      {transaction.products.map((item, idx) => (
                        <p key={idx} className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>
                          ({item.quantity}) {item.product.name}
                        </p>
                      ))}
                    </div>
                    <div className={`flex gap-6 w-[50%] justify-between ${darkMode ? 'text-light-border' : 'dark:text-dark-border' }`}>
                      <div className='flex flex-col gap-1'>
                        <p className='text-gray-400'>DATE</p>
                        <p className='text-gray-400'>CUSTOMER</p>
                        <p className='text-gray-400'>TOTAL AMOUNT</p>
                      </div>
                      <div className={`flex flex-col gap-1 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`} >
                        <p className='ml-auto'>{formatDate(transaction.transaction_date)}</p>
                        <p className='tracking-wider ml-auto'>{transaction.customer && transaction.customer.name !== "" ? transaction.customer.name : 'None'}</p>
                        <p className='ml-auto'>₱ {transaction.total_price.toFixed(2)}</p>
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

export default SalesOrder;
