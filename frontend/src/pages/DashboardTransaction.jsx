import React, { useState, useEffect } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import AdminSearchBar from '../components/adminSearchBar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { GrPowerReset } from 'react-icons/gr';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { GrView } from "react-icons/gr";
import { RiRefundLine } from "react-icons/ri";
import { BsArrowRepeat } from "react-icons/bs";
import ViewTransaction from '../components/ViewTransaction';
import RMAPanel from '../components/RMAPanel';
import RefundPanel from '../components/RefundPanel';

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
    const [showRMAPanel, setShowRMAPanel] = useState(false);
    const [showRefundPanel, setShowRefundPanel] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    
    const toggleRMAPanel = (transaction, item) => {
      if (showRMAPanel) {
        setShowRMAPanel(false); // Close if it's already open
      } else {
        closeAllPanels(); // Close other panels before opening
        setSelectedTransaction({ ...transaction, product: item });
        setShowRMAPanel(true); // Open the RMA panel
      }
    };
    
    const toggleRefundPanel = (transaction, item) => {
      if (showRefundPanel) {
        setShowRefundPanel(false); // Close if it's already open
      } else {
        closeAllPanels(); // Close other panels before opening
        setSelectedTransaction({ ...transaction, product: item }); // Use item here
        setShowRefundPanel(true); // Open the Refund panel
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
      setShowRMAPanel(false);
      setShowRefundPanel(false);
    };
    
    // This is the update to ensure the state is set correctly
    useEffect(() => {
      if (!showViewPanel && !showRMAPanel && !showRefundPanel) {
        setSelectedTransaction(null);
      }
    }, [showViewPanel, showRMAPanel, showRefundPanel]);
    
  

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
          setSalesOrder(response.data.data);
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
      const handleCashierNameChange = (event) => setCashierName(event.target.value);
      const handleResetFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setMinPrice('');
        setMaxPrice('');
        setSortBy('');
      };

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options).replace(/^(.*?), (.*), (.*)$/, (match, month, day, year) => {
          return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
        });
      };
      
      


      const handleRefundSuccess = () => {
        toast.success('Refund processed successfully!');
        setShowViewPanel(false); // Close the refund panel
        fetchSalesOrders(); // Refresh the sales orders
    };
    
    const handleRefundError = (error) => {
        toast.error(`Error processing refund: ${error.message}`);
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
                    <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                      <div className={`flex flex-col space-y-4 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
                      <div className='flex flex-col'>
                      <label htmlFor='CashierName' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CASHIER</label>
                      <input
                        id='CashierName'
                        value={cashierName}
                        onChange={handleCashierNameChange}
                        className={`border rounded p-2 my-1 border-none text-white outline-none ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'} placeholder-white`}
                        placeholder='Search by Cashier Name'
                      />
                  </div>


              <div className='flex flex-col'>
                <label htmlFor='startDate' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>DATE</label>
                <select
                  id='startDate'
                  onChange={handleDateFilter}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'}`}
                >
                  <option value=''>Select Option</option>
                  <option value='today'>Today</option>
                  <option value='this_week'>This Week</option>
                  <option value='this_month'>This Month</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='sortBy' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SORT BY</label>
                <select
                  id='sortBy'
                  value={sortBy}
                  onChange={handleSortByChange}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'}`}
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

              <label className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>DATE RANGE</label>

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

              <label className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PRICE RANGE</label>

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
      
          {loading ? (
                <Spinner />
              ) : salesOrder.length === 0 ? (
                <div className='w-[80%] h-[76vh] flex items-center justify-center'>
                  <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No Successful Transactions</p>
                </div>
              ) : (
                <div className='w-[80%] h-[76vh] overflow-y-auto scrollbar-custom'>
                    <table className={`w-full table-auto ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                      <thead>
                        <tr className={`border-b-2 ${darkMode ? 'border-light-primary' : 'dark:border-dark-primary'}`}>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Transaction ID</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Sales Date</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Cashier</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Customer Name</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Product Name</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Product Code</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Serial Number</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Qty. Sold</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Status</th>
                          <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesOrder.flatMap((transaction) =>
                          transaction.products.map((item, idx) => (
                            <tr key={`${transaction._id}-${idx}`} className={`border-b ${darkMode ? 'border-light-primary' : 'dark:border-dark-primary'}`}>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {transaction.transaction_id || 'N/A'}
                              </td>
                              <td className={`py-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {formatDate(transaction.transaction_date)}
                              </td>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {transaction.cashier || 'N/A'}
                              </td>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {transaction.customer?.name || 'None'}
                              </td>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {item.product?.name || 'Unknown Product'}
                              </td>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {item.product?.product_id || 'N/A'}
                              </td>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {item.serial_number.length > 0 ? item.serial_number.join(', ') : 'N/A'}
                              </td>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {item.quantity || 'N/A'}
                              </td>
                              <td className={`p-4 text-xs ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                                {item.item_status || 'N/A'}
                              </td>
                              <td className={`p-4 h-full  flex items-center justify-center text-sm ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} text-center`}>
                              <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`} 
                                  onClick={() => handleViewTransaction(transaction, item)}>
                                  <GrView size={20} />
                              </button>

                              <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`} 
                                  onClick={() => toggleRefundPanel(transaction, item)}>
                                  <RiRefundLine size={20} />
                              </button>

                              <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`} 
                                  onClick={() => toggleRMAPanel(transaction, item)}>
                                  <BsArrowRepeat size={20} />
                              </button>
                              </td>
                            </tr>
                          ))  
                        )}
                      </tbody>
                    </table>
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

        {showRMAPanel && (
            <RMAPanel 
                transaction={selectedTransaction} 
                onClose={closeAllPanels} 
            />
        )}

        {showRefundPanel && (
            <RefundPanel 
                transaction={selectedTransaction} 
                onClose={closeAllPanels} 
            />
        )}


      </div>
    );
}

export default DashboardTransaction;
