import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import SearchBar from '../components/SearchBar';
import { FaPlay } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import { HiOutlineRefresh } from "react-icons/hi";

const Refund = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const baseURL = "http://localhost:5555"; // Make sure this is your actual base URL
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const isInputsEmpty = minPrice === '' && maxPrice === '';
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionStatus, setTransactionStatus] = useState({
      Completed: false,
      Refunded: false
  });
  const [refunds, setRefunds] = useState([]); // State for refund data

  useEffect(() => {
      const fetchRefunds = async () => {
          try {
              const response = await axios.get(`${baseURL}/refund`, {
                  headers: {
                      Authorization: `Bearer ${user.token}` // Include token if needed
                  },
                  params: {
                      customerName,
                      cashierName,
                      startDate,
                      endDate,
                      minPrice,
                      maxPrice,
                      paymentMethod,
                      transactionStatus: Object.keys(transactionStatus).filter(status => transactionStatus[status])
                  }
              });
              setRefunds(response.data); // Assuming response.data is the array of refunds
          } catch (error) {
              console.error("Error fetching refunds:", error);
          }
      };

      fetchRefunds();
  }, [customerName, cashierName, startDate, endDate, minPrice, maxPrice, paymentMethod, transactionStatus, user.token]);

  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);
  
  const handleCheckboxChange = (status) => {
      setTransactionStatus(prev => ({
          ...prev,
          [status]: !prev[status]
      }));
  };

  const handlePaymentMethodChange = (e) => {
      setPaymentMethod(e.target.value);
  };

  const handlePriceRangeFilter = () => {
      // Handle price range filtering if necessary
  };

  const handleResetFilters = () => {
      setSearchQuery('');
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
      setRefunds([]); // Clear refunds on reset
  };
  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
        <Navbar />
        <div className='pt-[70px] px-6 py-4 w-full h-full'>
        <div className='flex items-center justify-center py-5'>
            <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Refunds</h1>
              <div className='w-full flex justify-end gap-2'>
                 <SearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search by RMA ID'} />
              </div>
        </div>
        <div className='flex gap-4'>
           <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col'>
                        <label htmlFor='customerName' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CUSTOMER NAME</label>
                        <input
                            type='text'
                            placeholder='Enter Customer Name'
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className={`border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-textSecondary' : 'dark:border-dark-textSecondary'} w-full p-2`}/>
                   </div>
                   <div className='flex flex-col gap-2'>
                        <label htmlFor='cashierName' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CASHIER NAME</label>
                        <input
                             type='text'
                             placeholder='Enter Cashier Name'
                             value={cashierName}
                             onChange={(e) => setCashierName(e.target.value)}
                             className={`border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-textSecondary' : 'dark:border-dark-textSecondary'} w-full p-2`}
                         />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <span className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>STATUS</span>
                          {Object.keys(transactionStatus).map((status) => (
                            <label key={status} className='custom-checkbox flex items-center'>
                               <input type='checkbox' checked={transactionStatus[status]} onChange={() => handleCheckboxChange(status)}/>
                                    <span className='checkmark'></span>
                                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>{status}</span>
                            </label>
                          ))}
                    </div>

                    <div className='flex flex-col gap-2 py-2'>
                                <label className={`text-xs font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PAYMENT METHOD</label>
                                <select
                                    id='paymentMethod'
                                    value={paymentMethod}
                                    onChange={handlePaymentMethodChange}
                                    className={`border rounded p-2 my-1 
                                      ${paymentMethod === '' 
                                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                        : (darkMode 
                                          ? 'bg-light-activeLink text-light-primary' 
                                          : 'bg-transparent text-black')} 
                                      outline-none font-semibold`}
                                  >
                                    <option value=''>Select Option</option>
                                    <option value='Cash'>Cash</option>
                                    <option value='GCash'>GCash</option>
                                    <option value='GGvices'>GGvices</option>
                                    <option value='Bank Transfer'>Bank Transfer</option>
                                    <option value='BDO Credit Card'>BDO Credit Card</option>
                                    <option value='Credit Card - Online'>Credit Card - Online</option>
                                  </select>
                              </div>

                              <label className={`text-xs font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>AMOUNT RANGE</label>

                              <div className={`flex justify-between items-center gap-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                    <div className={`flex flex-col`}>
                                        <div className={`w-[100px] rounded bg-transparent pl-1 border ${isInputsEmpty ? `${darkMode ? `border-black` : `border-white`}` : (darkMode ? 'border-light-primary' : 'dark:border-dark-primary')}`}>
                                        <input
                                            type='number'
                                            id='minPrice'
                                            value={minPrice}
                                            onChange={(e) => {
                                            setMinPrice(e.target.value);
                                            handleMinPriceChange(e);
                                            }}
                                            className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${isInputsEmpty ? 'text-black' : ''}`}
                                            min='0'
                                            placeholder='Min'
                                        />
                                        </div>
                                    </div>
                                    <span className='text-2xl text-center h-full text-[#a8adb0]'>-</span>
                                    <div className={`flex flex-col`}>
                                    <div className={`w-[100px] rounded bg-transparent pl-1 border ${isInputsEmpty ? `${darkMode ? `border-black` : `border-white`}` : (darkMode ? 'border-light-primary' : 'dark:border-dark-primary')}`}>
                                    <input
                                            type='number'
                                            id='maxPrice'
                                            value={maxPrice}
                                            onChange={(e) => {
                                            setMaxPrice(e.target.value);
                                            handleMaxPriceChange(e);
                                            }}
                                            className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${isInputsEmpty ? 'text-black' : ''}`}
                                            min='0'
                                            placeholder='Max'
                                        />
                                        </div>
                                    </div>
                                    <button
                                        className={`p-2 text-xs rounded-md text-white ${isInputsEmpty ? (darkMode ? 'bg-light-textSecondary' : 'bg-dark-textSecondary') : (darkMode ? 'bg-light-primary' : 'bg-dark-primary')} hover:bg-opacity-60 active:bg-opacity-30`}
                                        onClick={handlePriceRangeFilter}
                                    >
                                        <FaPlay />
                                    </button>
                                    </div>

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

                                    </div>
                <div className='flex flex-col gap-2'>
                    <button
                      className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-transparent border-2 
                        ${darkMode ? 'hover:bg-opacity-30 hover:bg-dark-textSecondary' : 'hover:bg-opacity-30 hover:bg-light-textSecondary'}`}
                            onClick={handleResetFilters}
                      >
                        <HiOutlineRefresh className={`mr-2 text-2xl ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`} />
                        <p className={`text-lg ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`}>Reset Filters</p>
                      </button>
                    </div>
              </div>
             </div>
       <div className={`h-[78vh] w-[77%] overflow-auto roundead-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
       <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <thead className={`sticky top-0 z-5 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                                <tr>
                                    <th className='p-2 text-center'>Refund ID</th>
                                    <th className='p-2 text-center'>Transaction ID</th>
                                    <th className='p-2 text-center text-xs'>Sales Date</th>
                                    <th className='p-2 text-center text-xs'>Cashier</th>
                                    <th className='p-2 text-center text-xs'>Refund Amount</th>
                                    <th className='p-2 text-center text-xs'>Refund Method</th>
                                    <th className='p-2 text-center text-xs'>Product Name</th>
                                    <th className='p-2 text-center text-xs'>Serial Number</th>
                                    <th className='p-2 text-center text-xs'>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {refunds.map(refund => (
                                    <tr key={refund.id} className={`border-b ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                                        <td className='p-2 text-center'>{refund.refund_id}</td>
                                        <td className='p-2 text-center'>{refund.transaction_id}</td>
                                        <td className='p-2 text-center'>{new Date(refund.salesDate).toLocaleDateString()}</td>
                                        <td className='p-2 text-center'>{refund.cashier}</td>
                                        <td className='p-2 text-center'>{refund.refund_amount}</td>
                                        <td className='p-2 text-center'>{refund.refund_method}</td>
                                        <td className='p-2 text-center'>{refund.product_name}</td>
                                        <td className='p-2 text-center'>{refund.serial_number}</td>
                                        <td className='p-2 text-center'>{refund.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
       </div>
      </div>

     </div>
    </div>
  )
}

export default Refund
