import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import AdminSearchBar from '../components/adminSearchBar';
import { FaPlay } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import { HiOutlineRefresh } from "react-icons/hi";
import { IoCaretBackOutline } from "react-icons/io5";
import { API_DOMAIN } from '../utils/constants';

const AdminRefund = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const baseURL = API_DOMAIN; // Adjust your actual base URL
  
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const isInputsEmpty = minPrice === '' && maxPrice === '';
  const [paymentMethod, setPaymentMethod] = useState('');
  const [refunds, setRefunds] = useState([]); // State for all refund data
  const [filteredRefunds, setFilteredRefunds] = useState([]); // State for filtered refund data
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const handleRowClick = (refund) => {
    setSelectedRefund(refund);
    setIsPopupOpen(true);
  };
  
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  
  // Fetch all refunds initially
  const fetchRefunds = async () => {
    try {
      const response = await axios.get(`${baseURL}/refund`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      });
      setRefunds(response.data); // Assuming response.data is the array of refunds
      setFilteredRefunds(response.data); // Set filteredRefunds to the full data initially
    } catch (error) {
      console.error("Error fetching refunds:", error);
    }
  };

  const applyFilters = () => {
    const filtered = refunds.filter((refund) => {
      if (searchQuery && !refund.refund_id?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (customerName && !refund.customer_name?.toLowerCase().includes(customerName.toLowerCase())) {
        return false;
      }
      if (cashierName && !refund.cashier?.toLowerCase().includes(cashierName.toLowerCase())) {
        return false;
      }
      if (startDate && new Date(refund.sales_date) < startDate) {
        return false;
      }
      if (endDate && new Date(refund.sales_date) > endDate) {
        return false;
      }
      if (minPrice && refund.refund_amount < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && refund.refund_amount > parseFloat(maxPrice)) {
        return false;
      }
      if (paymentMethod && refund.refund_method !== paymentMethod) {
        return false;
      }
      return true;
    });
  
    setFilteredRefunds(filtered);
  };
  
  useEffect(() => {
    fetchRefunds();
  }, [user.token]);

  // Call applyFilters whenever a filter is changed
  useEffect(() => {
    applyFilters();
  }, [customerName, cashierName, startDate, endDate, minPrice, maxPrice, paymentMethod, searchQuery]);

  // Reset all filters to their default state
  const handleResetFilters = () => {
    setCustomerName('');
    setCashierName('');
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setPaymentMethod('');
    setTransactionStatus({
      Completed: false,
      Refunded: false
    });
    setFilteredRefunds(refunds); // Reset to show all data
  };
  
  // Date change handlers
  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);

  // Checkbox change handler for transaction status
  const handleCheckboxChange = (status) => {
    setTransactionStatus(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Payment method change handler
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Price range filter handler
  const handlePriceRangeFilter = () => {
    if (minPrice && maxPrice && Number(minPrice) <= Number(maxPrice)) {
      applyFilters();
    } else {
      console.warn("Please enter a valid price range.");
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short', // This will return 'Oct' for 'October'
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDates = (dateString) => {
  const date = new Date(dateString);
  
  // Get date in the desired format
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  };
  
  // Format the date and time
  const formattedDate = date.toLocaleString('en-US', options);

  return formattedDate;
};


  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
        <DashboardNavbar />
        <div className='pt-[70px] px-6 py-4 w-full h-full'>
        <div className='flex items-center justify-center py-5'>
            <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Refunds</h1>
              <div className='w-full flex justify-end gap-2'>
              <AdminSearchBar
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                    placeholderMessage={'Search by Refund ID'}
                    />
              </div>
        </div>
        <div className='flex gap-4'>
           <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
             <div className='flex flex-col gap-6 h-full'>
                <div className='flex flex-col gap-2 flex-grow'>
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
                    <label className={`text-sm font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>REFUND METHOD</label>
                    <select
                      id='paymentMethod'
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                      className={`border rounded p-2 my-1 
                        ${paymentMethod === '' 
                          ? (darkMode 
                            ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                            : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                        : (darkMode 
                            ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                            : 'bg-light-activeLink text-dark-primary border-dark-primary')} 
                        outline-none font-semibold`}
                    >
                      <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Option</option>
                      <option value='Cash' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Cash</option>
                      <option value='GCash' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>GCash</option>
                      <option value='GGvices' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>GGvices</option>
                      <option value='Bank Transfer' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Bank Transfer</option>
                      <option value='BDO Credit Card' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>BDO Credit Card</option>
                      <option value='Credit Card - Online' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Credit Card - Online</option>
                    </select>
                  </div>

                  <label className={`text-sm font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>AMOUNT RANGE</label>

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
                          value={maxPrice}s
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
                        <label className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SALES DATE</label>

                        <div className='flex justify-center items-center'>
                          <div className='flex flex-col'>
                            <div className={`w-[130px] border rounded bg-transparent pl-1 
                               ${startDate === '' 
                                ? (darkMode ? 'bg-transparent text-black border-light-textPrimary' : 'bg-transparent text-white border-dark-textPrimary') 
                                : (darkMode 
                                  ? ' text-light-primary border-light-textPrimary' 
                                  : ' text-dark-primary border-dark-primary')} `}>
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
                            <div className={`w-[130px] border rounded bg-transparent pl-1
                              ${endDate === '' 
                                ? (darkMode ? 'bg-transparent text-black border-light-textPrimary' : 'bg-transparent text-white border-dark-textPrimary') 
                                : (darkMode 
                                  ? ' text-light-primary border-light-textPrimary' 
                                  : ' text-dark-primary border-dark-textPrimary')} `}>
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
          </div>

       <div className={`h-[78vh] w-[77%] overflow-auto roundead-2xl text-sm ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                    <thead className={`sticky top-0 z-5 ${darkMode ? 'border-light-primary bg-light-container' : 'border-dark-primary bg-dark-container'} border-b text-sm`}>
                      <tr>
                        <th className='p-2 text-center'>Refund ID</th>
                        <th className='p-2 text-center text-xs'>Sales Date</th>
                        <th className='p-2 text-center text-xs'>Customer Name</th>
                        <th className='p-2 text-center text-xs'>Cashier Name</th>
                        <th className='p-2 text-center text-xs'>Refund Amount</th>
                        <th className='p-2 text-center text-xs'>Product Name</th>
                        <th className='p-2 text-center text-xs'>Reason</th>
                        <th className='p-2 text-center text-xs'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRefunds.length > 0 ? (
                        filteredRefunds.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(refund => (
                            <tr key={refund.id} className={`border-b ${darkMode ? 'bg-light-container border-light-primary' : 'bg-dark-container border-dark-primary'}`}>
                              <td className='p-4 text-center'>{refund.refund_id}</td>
                              <td className='p-4 text-center'>{formatDate(refund.sales_date)}</td>
                              <td className='p-4 text-center'>{refund.customer_name}</td>
                              <td className='p-4 text-center'>{refund.cashier}</td>
                              <td className='p-4 text-center'>{refund.refund_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className='p-4 text-center'>{shortenString(refund.product_name)}</td>
                              <td className='p-4 text-center'>{refund.reason}</td>
                              <td className='p-4 text-center'>
                                <button className={`text-white px-4 py-2 rounded-md ${darkMode ? 'bg-light-button' : 'bg-light-button'}`} onClick={() => handleRowClick(refund)}>
                                  View
                                </button>
                              </td>
                            </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className='p-2 text-center text-4xl h-[500px]'>No refunds available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                      </div>
                   </div>
               </div>

              {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50">
                  <div
                    className={`py-6 max-w-xl w-full h-full p-4 border border-blue-400 rounded-md shadow-md relative overflow-y-auto ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-light-bg'}`}
                  >
                    <button
                      className={`flex gap-2 items-center outline-none pb-6 ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'} hover:underline`}
                      onClick={closePopup}
                    >
                      <IoCaretBackOutline /> Back to Refund
                    </button>

                    {selectedRefund && (
                      <div className="w-full flex flex-col gap-3 px-10">
                          <div className="text-md w-full flex items-center justify-between py-4">
                              <div className={`w-[100%] text-4xl font-semibold ${darkMode ? 'text-light-textPrimay' : 'text-dark-textPrimay'}`}>
                                REFUND ID: {selectedRefund.refund_id}
                              </div>
                          </div>
                          
                        <div className="border-b pb-4 flex flex-col gap-4">
                          <h3 className="font-semibold text-xl pb-2">Refund Info</h3>
                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              TRANSACTION ID
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.transaction_id}</div>
                          </div>
                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              CUSTOMER NAME
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.customer_name}</div>
                          </div>
                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
s                              REFUND AMOUNT
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.refund_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          </div>
                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              SALES DATE
                            </div>
                            <div className="font-semibold w-[50%]">
                              {formatDates(new Date(selectedRefund.sales_date).toLocaleDateString())}
                            </div>
                          </div>
                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              REFUND METHOD
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.refund_method}</div>
                          </div>

                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              CASHIER
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.cashier}</div>
                          </div>





                        </div>

                        {/* Product Info Section */}
                        <div className="border-b pb-4 flex flex-col gap-4">
                          <h3 className="font-semibold text-xl pb-2">Product Info</h3>
                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              PRODUCT NAME
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.product_name}</div>
                          </div>

                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              SERIAL NUMBER
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.serial_number}</div>
                          </div>

                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              UNIT PRICE
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          </div>

                          <div className="text-md w-full flex items-center justify-between">
                            <div className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                              REASON
                            </div>
                            <div className="font-semibold w-[50%]">{selectedRefund.reason}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}


  </div>
  )
}

export default AdminRefund
