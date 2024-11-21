import React, { useState, useEffect } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import AdminSearchBar from '../components/adminSearchBar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { HiOutlineRefresh } from "react-icons/hi";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ViewTransaction from '../components/ViewTransaction';
import { useDateFilter } from '../context/DateFilterContext';
import { API_DOMAIN } from '../utils/constants';

// This component is used to display all sales orders in the dashboard.
const DashboardTransaction = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(false);
    const [salesOrder, setSalesOrder] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cashierName, setCashierName] = useState('');
    const [showViewPanel, setShowViewPanel] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const handleDateFilterChange = (filter) => {
      setDateFilter(filter); 
      const today = new Date();
  
      switch (filter) {
          case 'Today':
              setStartDate(new Date(today.setHours(0, 0, 0, 0)));
              setEndDate(new Date(today.setHours(23, 59, 59, 999)));
              break;
          case 'This Week':
              const currentDayOfWeek = today.getDay(); // 0 (Sunday) - 6 (Saturday)
              const weekStartOffset = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Adjust for Monday as the start
              const startOfWeek = new Date(today.setDate(today.getDate() - weekStartOffset));
              setStartDate(new Date(startOfWeek.setHours(0, 0, 0, 0)));
              setEndDate(new Date(new Date().setHours(23, 59, 59, 999))); // End of today
              break;
          case 'This Month':
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              setStartDate(startOfMonth);
              setEndDate(new Date(today.setHours(23, 59, 59, 999)));
              break;
          default:
              setStartDate(null);
              setEndDate(null);
      }
  };
  

    const handleViewTransaction = (transaction, item) => {
      if (showViewPanel) {
        setShowViewPanel(false); // Close if it's already open
      } else {
        closeAllPanels(); // Close other panels before opening
        setSelectedTransaction({ ...transaction, product: item });
        setShowViewPanel(true); // Open the View panel
      }
    };
    
    const closeAllPanels = () => {
      setShowViewPanel(false);
    };
    
    // This is the update to ensure the state is set correctly
    useEffect(() => {
      if (!showViewPanel) {
        setSelectedTransaction(null);
      }
    }, [showViewPanel]);
    
  

    useEffect(() => {
      if (user) {
        fetchSalesOrders();
      }
    }, [startDate, endDate, minPrice, maxPrice, sortBy, searchQuery, cashierName, user, customerName]);
    
    const fetchSalesOrders = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get(`${API_DOMAIN}/transaction`, {
          params: {
            payment_status: 'paid',
            transaction_id: searchQuery,
            cashier: cashierName,
            customer: customerName,
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
            minPrice: minPrice || undefined, // Add minPrice filter
            maxPrice: maxPrice || undefined, // Add maxPrice filte
            sortBy: sortBy,
          },
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
    
        setSalesOrder(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales orders:', error);
        setLoading(false);
      }
    };

 

      const handleStartDateChange = (date) => setStartDate(date);
      const handleEndDateChange = (date) => setEndDate(date);
      const handleMinPriceChange = (event) => setMinPrice(event.target.value);
      const handleMaxPriceChange = (event) => setMaxPrice(event.target.value);
      const handleResetFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setMinPrice('');
        setMaxPrice('');
        setCashierName('');
        setCustomerName('');
        setDateFilter('');
      };
      
      


      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options).replace(/^(.*?), (.*), (.*)$/, (match, month, day, year) => {
          return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
        });
      };
      
      
      const getStatusStyles = (status) => {
        switch (status) {
          case 'Completed':
            return {
              textClass: 'text-[#14AE5C]',
              bgClass: 'bg-[#CFF7D3]', 
            };
          case 'Refunded':
            return {
              textClass: 'text-[#EC221F]',
              bgClass: 'bg-[#FEE9E7]',
            };
            case 'RMA':
              return {
                textClass: 'text-[#BF6A02]',
                bgClass: 'bg-[#FFF1C2]',
              };
              case 'Replaced':
                return {
                  textClass: 'text-[#007BFF]',
                  bgClass: 'bg-[#C2D7FF]',
                };
          default:
            return {
              textClass: 'text-[#8E8E93]',
              bgClass: 'bg-[#E5E5EA]',
            };
        }
      };

      const shortenString = (str) => {
        if (typeof str === 'string') {
        const trimmedStr = str.trim(); 
        if (trimmedStr.length > 15) {
            return trimmedStr.slice(0, 15) + '...'; 
        }
        return trimmedStr; 
    }
    return 'N/A'; 
};
    

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <ToastContainer theme={darkMode ? 'light' : 'dark'} />
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4 w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Transaction</h1>
                    <div className='w-full flex justify-end gap-2'>
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery}  placeholderMessage={'Search Transaction by transaction id'} />
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className={`h-[78vh] max-h-[84%] w-[22%] rounded-2xl p-4 flex flex-col justify-between overflow-y-auto ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                      <div className={`flex flex-col gap-6 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>

                          <div className='flex flex-col gap-2'>
                              <div className='flex flex-col'>
                              <label htmlFor='customerName' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CUSTOMER NAME</label>
                                <input
                                  type='text'
                                  placeholder='Enter Customer Name'
                                  value={customerName}
                                  onChange={(e) => setCustomerName(e.target.value)}
                                  className={`border rounded p-2 my-1 ${customerName === '' 
                                    ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                    : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                                  outline-none font-semibold`}/>
                              </div>

                              <div className='flex flex-col gap-2'>
                              <label htmlFor='cashierName' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CASHIER NAME</label>
                                    <input
                                    type='text'
                                    placeholder='Enter Cashier Name'
                                    value={cashierName}
                                    onChange={(e) => setCashierName(e.target.value)}
                                    className={`border rounded p-2 my-1 ${cashierName === '' 
                                      ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                      : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                                    outline-none font-semibold`}/>                                    
                              </div>

                              <div className='flex flex-col gap-2 py-2'>
                                <label className={`text-xs font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>DATE FILTER</label>
                                <select
                                    id='dateFilter'
                                    value={dateFilter}
                                    onChange={(e) => handleDateFilterChange(e.target.value)} // Call the date filter handler
                                    className={`border rounded p-2 my-1 
                                        ${dateFilter === '' 
                                          ? (darkMode 
                                            ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                                            : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                                        : (darkMode 
                                            ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                                            : 'bg-light-activeLink text-dark-primary border-dark-primary')} 
                                        outline-none font-semibold`}
                                >
                                    <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Option</option>
                                    <option value='Today' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Today</option>
                                    <option value='This Week' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Week</option>
                                    <option value='This Month' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Month</option>
                                    <option value='Custom Date' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Custom Date</option>
                                </select>
                            </div>

                            {/* Date Picker for Custom Date */}
                            {dateFilter === 'Custom Date' && (
                                  <div className='flex flex-col'>
                                  <label className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SALES DATE</label>

                                <div className='flex justify-center items-center'>
                                  <div className='flex flex-col'>
                                    <div className={`w-[130px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-container1' : 'dark:border-dark-container1'}`}>
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
                            </div>
                            )}
                      </div>

                      <div className='flex flex-col'>
                        <label className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>AMOUNT RANGE</label>

                        <div className='flex justify-center items-center'>
                          <div className='flex flex-col'>
                          <div className={`w-[130px] border rounded bg-transparent pl-1 ${minPrice === '' ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary' : 'border-dark-primary')}`}>                              
                              <input
                                type='number'
                                id='minPrice'
                                value={minPrice}
                                onChange={handleMinPriceChange}
                                className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${minPrice === '' ? (darkMode ? 'text-black' : 'text-white') : darkMode ? 'text-light-primary' : 'text-dark-primary'}`}
                                min='0'
                                placeholder='Min'
                              />
                            </div>
                          </div>

                          <span className='text-2xl text-center h-full w-full text-[#a8adb0] mx-2'>-</span>

                          <div className='flex flex-col'>
                          <div className={`w-[130px] border rounded bg-transparent pl-1 ${maxPrice === '' ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary' : 'border-dark-primary')}`}>                              
                                <input
                                type='number'
                                id='maxPrice'
                                value={maxPrice}
                                onChange={handleMaxPriceChange}
                                className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${maxPrice === '' ? (darkMode ? 'text-black' : 'text-white') : darkMode ? 'text-light-primary' : 'text-dark-primary'}`}
                                min='0'
                                placeholder='Max'
                              />
                            </div>
                          </div>
                        </div>
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
               {loading ? (
                  <Spinner />
                ) : (
                  <div className="w-[80%] h-[77vh]">
                    <div className="overflow-x-auto max-h-screen h-[78vh] rounded-2xl">
                      <table
                        className={`w-full table-auto ${
                          darkMode ? 'bg-light-bg text-light-container' : 'dark:text-dark-textPrimary bg-dark-container'
                        }`}
                      >
                        <thead className="sticky top-0 z-5">
                          <tr
                            className={`border-b-2 ${
                              darkMode ? 'border-light-primary' : 'dark:border-dark-primary'
                            }`}
                          >
                            {/* Table Headers */}
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Transaction ID</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Sales Date</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Customer Name</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Cashier Name</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Product Name</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Qty. Sold</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Total Amount</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Status</th>
                            <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                            {salesOrder.length === 0 ? (
                              <tr>
                                <td colSpan="9" className="text-center p-4">
                                  <p
                                    className={`mt-[250px] text-2xl font-semibold ${
                                      darkMode ? 'dark:text-light-textPrimary' : 'text-dark-textPrimary'
                                    }`}
                                  >
                                    No transactions match the criteria.
                                  </p>
                                </td>
                              </tr>
                            ) : (
                              salesOrder
                                .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
                                .map((transaction) =>
                                  transaction.products.map((item, idx) => (
                                    <tr
                                      key={`${transaction._id}-${idx}`}
                                      className={`${
                                        darkMode
                                          ? 'text-light-textPrimary bg-light-container'
                                          : 'dark:text-dark-textPrimary bg-dark-container'
                                      } text-sm`}
                                    >
                                      {/* Table Data */}
                                      <td className="p-2 text-center">
                                        {transaction.transaction_id || 'N/A'}
                                      </td>
                                      <td className="p-2 text-center">
                                        {formatDate(transaction.transaction_date)}
                                      </td>
                                      <td className="p-2 text-center">
                                        {transaction.customer ? shortenString(transaction.customer.name) : 'None'}
                                      </td>
                                      <td className="p-2 text-center">
                                        {transaction.cashier}
                                      </td>
                                      <td className="p-2 text-center">
                                      {transaction.products.length > 0
                                          ? transaction.products.map((item, idx) => (
                                              <div key={idx}>
                                                <p>{shortenString(item.product?.name || 'Unknown')}</p>
                                              </div>
                                            ))
                                          : 'N/A'}
                                      </td>
                                      <td className="w-[10px] text-center">
                                          {transaction.products.length > 0
                                            ? transaction.products.reduce((acc, item) => acc + item.quantity, 0)
                                            : '0'}
                                        </td>
                                      <td className="p-2 text-center">
                                        ₱ {transaction.total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                      </td>
                                      <td className="p-2 text-center">
                                        {transaction.status ? (
                                          (() => {
                                            const { textClass, bgClass } = getStatusStyles(transaction.status);
                                            return (
                                              <div className={`inline-block p-2 w-[90%] rounded ${textClass} ${bgClass}`}>
                                                {transaction.status}
                                              </div>
                                            );
                                          })()
                                        ) : (
                                          'Pending'
                                        )}
                                      </td>
                                      <td className="text-center py-4 text-sm">
                                        <button
                                          className={`text-white px-4 py-2 rounded-md ${darkMode ? 'bg-light-button' : 'bg-light-button'}`}
                                          onClick={() => handleViewTransaction(transaction, item)}
                                        >
                                          View
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                  )
                              )}
                            </tbody>

                      </table>
                    </div>
                  </div>
                )}


          </div>
        </div>
        {/* Transaction Detail Modal */}
        {showViewPanel && (
            <ViewTransaction transaction={selectedTransaction} 
                onClose={closeAllPanels} 
            />
        )}



      </div>
    );
}

export default DashboardTransaction;
