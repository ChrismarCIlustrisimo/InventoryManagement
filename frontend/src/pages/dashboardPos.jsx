import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiOutlineRefresh } from "react-icons/hi";
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
  const [date, setDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [salesOrder, setSalesOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isInputsEmpty = minPrice === '' && maxPrice === '' ;

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
          minPrice: minPrice !== '' ? minPrice : undefined, // Check if not empty
          maxPrice: maxPrice !== '' ? maxPrice : undefined, // Check if not empty
          sortBy,
          payment_status: 'paid',
          transaction_id: searchQuery,
          cashier: cashierName,
        },
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
  
      const sortedOrders = response.data.data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
      setSalesOrder(sortedOrders);
    } catch (error) {
      console.error('Error fetching sales orders:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleDateFilter = (event) => {
    const value = event.target.value;
    setDate(value);

    const now = new Date();
    switch (value) {
        case 'today':
            setStartDate(now);
            setEndDate(now);
            break;
        case 'this_week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
            setStartDate(startOfWeek);
            setEndDate(endOfWeek);
            break;
        case 'this_month':
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setStartDate(startOfMonth);
            setEndDate(endOfMonth);
            break;
        case '':
            // Reset the date filter
            setStartDate(null);
            setEndDate(null);
            break;
        default:
            setStartDate(null);
            setEndDate(null);
            break;
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
    setSearchQuery(''); 
    setCashierName('');
    setDate(''); // Resetting to an empty string instead of null
};


  const handleCashierNameChange = (event) => setCashierName(event.target.value);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };


  const getStatusStyles = (item_status) => {
    let statusStyles = {
      textClass: 'text-[#8E8E93]',  
      bgClass: 'bg-[#E5E5EA]',      
    };
  
    switch (item_status) {
      case 'Completed':
        statusStyles = {
          textClass: 'text-[#14AE5C]',  
          bgClass: 'bg-[#CFF7D3]',     
        };
        break;
      case 'Refunded':
        statusStyles = {
          textClass: 'text-[#EC221F]',  
          bgClass: 'bg-[#FEE9E7]',      // Red background for Refunded
        };
        break;
      case 'RMA':
          statusStyles = {
            textClass: 'text-[#BF6A02]',  
            bgClass: 'bg-[#FFF1C2]',      // Red background for Refunded
          };
          break;
    }
  
    return statusStyles;
  };
  
  const shortenString = (str) => {
    if (typeof str === 'string') {
        const trimmedStr = str.trim();
        if (trimmedStr.length > 10) {
            return trimmedStr.slice(0, 10) + '...';
        }
        return trimmedStr;
    }
    return 'N/A';
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
            <label htmlFor='date' className='text-[#9C9C9C]'>DATE</label>
            <select
                id='date'
                onChange={handleDateFilter}
                value={date || ''} // Ensure value is always a string
                className={`border rounded p-2 my-1 ${date === '' 
                  ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                  : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-transparent text-black')} 
                outline-none font-semibold`} 
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
            <div className={`w-[130px] border rounded border-3 pl-1  ${startDate ? 'bg-light-activeLink text-light-primary border-light-primary' : `bg-transparent ${darkMode ? 'border-light-textPrimary' : 'dark:border-dark-textPrimary'}`}`}>
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
            <div className={`w-[130px] border rounded  border-3 pl-1 ${endDate ? 'bg-light-activeLink text-light-primary border-light-primary' : `bg-transparent ${darkMode ? 'border-light-textPrimary bg-light-activeLink' : 'dark:border-dark-textPrimary bg-dark-activeLink'}`}`}>
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
            <div className={`w-[130px] rounded bg-transparent pl-1 border ${isInputsEmpty ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary text-light-primary bg-light-activeLink' : 'dark:border-dark-primary text-dark-primary bg-dark-activeLink')}`}>
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
            <div className={`w-[130px] rounded bg-transparent pl-1 border ${isInputsEmpty ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary text-light-primary' : 'dark:border-dark-primary text-dark-primary')}`}>
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
              className={`border rounded p-2 my-1 ${sortBy === '' 
                ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-transparent text-black')} 
              outline-none font-semibold`}            >
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
              className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-transparent border-2 
              ${darkMode ? 'hover:bg-opacity-30 hover:bg-dark-textSecondary' : 'hover:bg-opacity-30 hover:bg-light-textSecondary'}`}
              onClick={handleResetFilters}
          >
              <HiOutlineRefresh className={`mr-2 text-2xl ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary'}`} />
              <p className={`text-lg ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary'}`}>Reset Filters</p>
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
                  <td className="p-2 text-center">{shortenString(transaction.customer?.name) || 'None'}</td>
                  <td className="p-2 text-center">
                    {transaction.products.length > 0
                      ? transaction.products.map((item, idx) => (
                          <div key={idx}>
                            <p>{shortenString(item.product.name)}</p>
                          </div>
                        ))
                      : 'N/A'}
                  </td>
                  <td className="p-2 text-center">
                    {transaction.products.length > 0
                      ? transaction.products.map((item, idx) => (
                          <div key={idx}>
                            <p>{shortenString(item.product.model)}</p>
                          </div>
                        ))
                      : 'N/A'}
                  </td>
                  <td className="p-2 text-center">
                      {transaction.products.length > 0 ? (
                        transaction.products.map((item, idx) => (
                          <div key={idx}>
                            <p>{item.serial_number.length > 0 ? shortenString(item.serial_number.join(', '), 20) : 'N/A'}</p>
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
                  <td className="p-2 text-center">₱ {transaction.total_price || '0.00'}</td>
                  <td className="p-2 text-center">
                        {transaction.status ? (
                          // Get styles based on transaction status
                          (() => {
                            const { textClass, bgClass } = getStatusStyles(transaction.status);  // Get styles based on the overall transaction status
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

                          <td className='text-center py-4 text-sm'>
                          <button
                                className={`text-white px-4 py-2 rounded-md ${darkMode ? 'bg-light-button' : 'bg-light-button'}`}
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