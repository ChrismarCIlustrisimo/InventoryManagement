import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiOutlineRefresh } from "react-icons/hi";
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import { API_DOMAIN } from '../utils/constants';

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
  const [customerName, setCustomerName] = useState('');
  const isInputsEmpty = minPrice === '' && maxPrice === '' ;
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (user) {
      fetchSalesOrders();
    }
  }, [startDate, endDate, minPrice, maxPrice, sortBy, searchQuery, customerName, user]);

  const fetchSalesOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_DOMAIN}/transaction`, {
        params: {
          startDate: startDate ? startDate.toISOString() : undefined,
          endDate: endDate ? endDate.toISOString() : undefined,
          minPrice, // Ensure this is correctly passed
          maxPrice, // Ensure this is correctly passed
          sortBy,
          payment_status: 'unpaid', 
          transaction_id: searchQuery,
          customer: customerName
        },
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      setSalesOrder(response.data.data); // Ensure this matches the data structure returned from API
    } catch (error) {
      console.error('Error fetching Reservationss:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleTransactionClick = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(date));
  };

  const handleCustomerNameChange = (e) => {
    setCustomerName(e.target.value); // Update state with customer name input
  };


  const handleDateFilter = (e) => {
    const value = e.target.value;
    setSelectedDate(value); // Update state with the selected value

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
    setSelectedDate('');
    fetchSalesOrders();
    setCustomerName('');
  };

  return (
    <div className={`h-full ${darkMode ? 'bg-light-bg' : 'dark:bg-dark-bg' }`}>
      <Navbar />
      <div className='h-full px-6 pt-[70px]'>
        <div className='flex items-center justify-center py-5'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>Reservations</h1>
          <div className='w-full flex justify-end'>
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              placeholderMessage={'Search by Sales ID'}
            />
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container' }`}>
            <div className={`flex flex-col space-y-4 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>
            <div className='flex flex-col'>
                <label className='text-sm text-gray-500 mb-1 font-semibold'>CUSTOMER NAME</label>
                <input
                  type='text'
                  value={customerName}
                  onChange={handleCustomerNameChange}
                  className={`border rounded p-2 my-1 ${customerName === '' 
                    ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                    : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                  outline-none font-semibold`}
                  placeholder='Enter Customer Name'
                />
              </div>
              <div className='flex flex-col'>
              <label className='text-sm text-gray-500 mb-1 font-semibold'>DATE</label>
              <select
                  id='startDate'
                  onChange={handleDateFilter}
                  value={selectedDate}
                  className={`border rounded p-2 my-1 
                    ${selectedDate === '' 
                      ? (darkMode 
                        ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                        : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                    : (darkMode 
                        ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                        : 'bg-light-activeLink text-dark-primary border-dark-primary')} 
                    outline-none font-semibold`}
                >
                  <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Option</option>
                  <option value='today' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Today</option>
                  <option value='this_week' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Week</option>
                  <option value='this_month' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Month</option>
                </select> 
              </div>

              <div className='flex flex-col'>
                    <label className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SALES DATE</label>
                    <div className='flex justify-center items-center'>
                      <div className='flex flex-col'>
                      <div className={`w-[130px] border rounded border-3 pl-1  ${startDate ? ' text-light-primary border-light-primary' : `bg-transparent ${darkMode ? 'border-light-textPrimary' : 'dark:border-dark-textPrimary'}`}`}>
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
                      <div className={`w-[130px] border rounded  border-3 pl-1 ${endDate ? ' text-light-primary border-light-primary' : `bg-transparent ${darkMode ? 'border-light-textPrimary bg-light-activeLink' : 'dark:border-dark-textPrimary bg-dark-activeLink'}`}`}>
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
                  </div>

                  <label className={`text-xs font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>AMOUNT RANGE</label>

                  <div className='flex justify-center items-center'>
                    <div className='flex flex-col'>
                      <div 
                        className={`w-[130px] border rounded bg-transparent pl-1 ${minPrice === '' ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-light-primary')}`}
                      >
                        <input
                          type='number'
                          id='minPrice'
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value);
                            handleMinPriceChange(e);
                          }}
                          className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${minPrice === '' ? (darkMode ? 'text-black' : 'text-white') : darkMode ? 'text-light-primary' : 'text-dark-primary'}`}
                          min='0'
                          placeholder='Min'
                        />
                      </div>
                    </div>

                    <span className='text-2xl text-center h-full text-[#a8adb0] mx-2'>-</span>

                    <div className='flex flex-col'>
                      <div 
                        className={`w-[130px] border rounded bg-transparent pl-1 ${maxPrice === '' ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary' : 'border-dark-primary')}`}
                      >
                        <input
                          type='number'
                          id='maxPrice'
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value);
                            handleMaxPriceChange(e);
                          }}
                          className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${maxPrice === '' ? (darkMode ? 'text-black' : 'text-white') : darkMode ? 'text-light-primary' : 'text-dark-primary'}`}
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
                  className={`border rounded p-2 my-1 
                    ${sortBy === '' 
                      ? (darkMode 
                        ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                        : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                    : (darkMode 
                        ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                        : 'bg-light-activeLink text-dark-primary border-dark-primary')} 
                    outline-none font-semibold`}
                >
                  <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Option</option>
                  <option value='price_asc' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Price Lowest to Highest</option>
                  <option value='price_desc' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Price Highest to Lowest</option>
                  <option value='customer_name_asc' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Customer Name A-Z</option>
                  <option value='customer_name_desc' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Customer Name Z-A</option>
                  <option value='transaction_id_asc' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>ID Lowest to Highest</option>
                  <option value='transaction_id_desc' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>ID Highest to Lowest</option>
                </select>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <button
                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-gray-400 border-2 
                  ${darkMode ? 'hover:bg-dark-textSecondary hover:scale-105' : 'hover:bg-light-textSecondary hover:scale-105'} transition-all duration-300`}
                onClick={handleResetFilters}
              >
                <HiOutlineRefresh className={`mr-2 text-2xl text-white`} />
                <p className={`text-lg text-white`}>Reset Filters</p>
              </button>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <Spinner />
          ) : salesOrder.length === 0 ? (
            <div className='w-[80%] h-[78vh] flex items-center justify-center'>
              <p className={`text-xl ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary' }`}>No Reservation Found</p>
            </div>
          ) : (
            <div className='w-[80%] h-[78vh] flex flex-col gap-4 overflow-y-auto scrollbar-custom'>
              {salesOrder
                         .sort((a, b) => {
                          if (sortBy) {
                            // Respect the sortBy logic
                            switch (sortBy) {
                              case 'price_asc':
                                return a.selling_price - b.selling_price;
                              case 'price_desc':
                                return b.selling_price - a.selling_price;
                              case 'product_name_asc':
                                return a.name.localeCompare(b.name);
                              case 'product_name_desc':
                                return b.name.localeCompare(a.name);
                              default:
                                return 0;
                            }
                          } 
                          // Default to new to old sorting
                          return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                  .map((transaction) => (
                  <div
                    key={transaction._id}
                    className={`rounded-lg p-4 flex gap-4 cursor-pointer 
                                ${darkMode ? 'bg-light-container hover:bg-gray-200' : 'bg-dark-container hover:bg-gray-600'}`}
                    onClick={() => handleTransactionClick(transaction.transaction_id)}
                  >
                    <div className={`flex items-center justify-center p-4 w-[15%] border-r-2 
                                    ${darkMode ? 'border-light-activeLink' : 'dark:border-dark-activeLink'}`}>
                      <h1 className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
                        {transaction.transaction_id}
                      </h1>
                    </div>
                    <div className='flex justify-between items-center w-[85%]'>
                      <div className='p-4 w-[70%] flex flex-col gap-1'>
                        {transaction.products.map((item, idx) => (
                          <p key={idx} className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
                            ({item.quantity}) {item.product.name}
                          </p>
                        ))}
                      </div>
                      <div className={`flex gap-6 w-[50%] justify-between ${darkMode ? 'text-light-border' : 'dark:text-dark-border'}`}>
                        <div className='flex flex-col gap-1'>
                          <p className='text-gray-400'>RESERVATION DATE</p>
                          <p className='text-gray-400'>CUSTOMER</p>
                          <p className='text-gray-400'>TOTAL AMOUNT</p>
                        </div>
                        <div className={`flex flex-col gap-1 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
                          <p className='ml-auto'>{formatDate(transaction.transaction_date)}</p>
                          <p className='tracking-wider ml-auto'>{transaction.customer && transaction.customer.name !== "" ? transaction.customer.name : 'None'}</p>
                          <p className='ml-auto'>₱ {(transaction.total_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
