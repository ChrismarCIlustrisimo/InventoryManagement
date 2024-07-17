import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GrPowerReset } from 'react-icons/gr';
import { FaFilter } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

const SalesOrder = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [salesOrder, setSalesOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesOrders();
  }, [startDate, endDate, minPrice, maxPrice, sortBy]);

  const fetchSalesOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5555/transaction', {
        params: {
          startDate: startDate ? startDate.toISOString() : undefined,
          endDate: endDate ? endDate.toISOString() : undefined,
          minPrice,
          maxPrice,
          sortBy
        }
      });
      setSalesOrder(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      setLoading(false);
    }
  };

  const handleDateFilter = (e) => {
    const value = e.target.value;
    if (value === 'today') {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of today
      const endOfDay = new Date(today);
      endOfDay.setDate(endOfDay.getDate() + 1); // Adding 1 day to get end of today
  
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
  

  const handleSearch = () => {
    // Check if any filter is applied
    if (startDate || endDate || minPrice || maxPrice || sortBy) {
      fetchSalesOrders();
    }
  };
  
  const handleResetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    fetchSalesOrders();
  };
  
  const handleRefresh = () => {
    fetchSalesOrders();
  };
  

  return (
    <div>
      <Navbar />
      <div className='h-full px-6 pt-[70px]'>
        <h1 className='w-full py-5 text-3xl font-bold mt-5'>Sales Order</h1>
        <div className='flex gap-4'>
          <div className='h-[76vh] w-[22%] bg-[#17262e] rounded-2xl p-4 flex flex-col justify-between'>
            <div className='flex flex-col space-y-4'>
              <div className='flex flex-col'>
                <label htmlFor='startDate'>Date</label>
                <select
                    id='startDate'
                    onChange={handleDateFilter}
                    className='border rounded p-2 my-1 bg-[#7a3724] border-none text-primary outline-none'
                  >
                    <option value=''>Select Option</option>
                    <option value='today'>Today</option>
                    <option value='this_week'>This Week</option>
                    <option value='this_month'>This Month</option>
                  </select>
              </div>

              <label className='text-sm text-gray-500 mb-1'>DATE RANGE</label>

              <div className='flex justify-center items-center'>
                <div className='flex flex-col'>
                  <div className='w-[130px] border-primary border rounded bg-transparent border-3 pl-1 '>
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
                  <div className='w-[130px] border-primary border rounded bg-transparent border-3 pl-1'>
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

              <label className='text-sm text-gray-500 mb-1'>PRICE RANGE</label>

              <div className='flex justify-center items-center'>
                <div className='flex flex-col'>
                  <div className='w-[130px] border-primary border rounded bg-transparent border-3 pl-1'>
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
                  <div className='w-[130px] border-primary border rounded bg-transparent border-3 pl-1'>
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
                <label htmlFor='sortBy'>Sort By</label>
                <select
                  id='sortBy'
                  value={sortBy}
                  onChange={handleSortByChange}
                  className='order rounded p-2 my-1 bg-[#7a3724] border-none text-primary outline-none'
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
                className='bg-[#1b2c34] text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide
                              hover:bg-[#283c49] hover:text-gray-200 hover:shadow-md
                              active:bg-[#0f1e23] active:text-gray-300 active:shadow-none'
                onClick={handleRefresh}
              >
                <FiRefreshCcw className='mr-2' />
                <p>Refresh</p>
              </button>
              <button
                className='bg-[#1b2c34] text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide
                              hover:bg-[#283c49] hover:text-gray-200 hover:shadow-md
                              active:bg-[#0f1e23] active:text-gray-300 active:shadow-none'
                onClick={handleSearch}
              >
                <FaFilter className='mr-2' />
                <p>Filter</p>
              </button>
              <button
                className='bg-[#1b2c34] text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide
                              hover:bg-[#283c49] hover:text-gray-200 hover:shadow-md
                              active:bg-[#0f1e23] active:text-gray-300 active:shadow-none'
                onClick={handleResetFilters}
              >
                <GrPowerReset className='mr-2' />
                <p>Reset Filters</p>
              </button>
            </div>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className='w-[80%] h-[76vh] flex flex-col gap-4 overflow-y-auto scrollbar-custom'>
              {salesOrder.map((transaction) => (
                <div key={transaction._id} className='bg-[#17262e] rounded-lg p-4 flex gap-4'>
                  <div className='flex items-center justify-center p-4 w-[15%] border-r-2 border-primary'>
                    <h1>{transaction.transaction_id}</h1>
                  </div>
                  <div className='flex justify-between items-center w-[85%]'>
                    <div className='p-4 w-[70%] flex flex-col gap-1'>
                      {transaction.products.map((item, idx) => (
                        <p key={idx}>
                          ({item.quantity}) {item.product.name}
                        </p>
                      ))}
                    </div>
                    <div className='flex gap-6 w-[30%]'>
                      <div className='flex flex-col gap-1'>
                        <p className='text-gray-400'>DATE</p>
                        <p className='text-gray-400'>CUSTOMER</p>
                        <p className='text-gray-400'>TOTAL AMOUNT</p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <p className='ml-auto'>{new Date(transaction.transaction_date).toLocaleDateString()}</p>
                        <p className='ml-auto'>{transaction.customer.name}</p>
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
