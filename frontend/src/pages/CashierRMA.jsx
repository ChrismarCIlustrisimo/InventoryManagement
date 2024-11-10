import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { FaPlay } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import { HiOutlineRefresh } from "react-icons/hi";
import { useTheme } from '../context/ThemeContext';
import ViewRMACashier from '../components/ViewRMACashier';
import ProcessRefund from '../components/ProcessRefund';

const CashierRMA = () => {
    const { user } = useAuthContext();
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const [searchQuery, setSearchQuery] = useState('');
    const [customerName, setCustomerName] = useState(''); // Add this line
    const [cashierName, setCashierName] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const isInputsEmpty = minPrice === '' && maxPrice === '' ;
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isViewRMAOpen, setIsViewRMAOpen] = useState(false); // For modal open/close
    const [selectedRma, setSelectedRma] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rmaData, setRmaData] = useState([]);
    const handleStartDateChange = (date) => setStartDate(date);
    const handleEndDateChange = (date) => setEndDate(date);
    const [statusFilter, setStatusFilter] = useState(''); // New dropdown for status

    const [rmaStatus, setRmaStatus] = useState({
        Approved: false,
        Pending: false,
        Completed: false,
        Rejected: false,
      });
    
      const handleCheckboxChange = (status) => {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };
    


      const handleResetFilters = () => {
        setSearchQuery('');
        setCustomerName('');
        setCashierName('');
        setStartDate(null);
        setEndDate(null);
        setMinPrice('')
        setMaxPrice('')
        setStatusFilter('');
        setPaymentMethod('')
        setTransactionStatus({
            Completed: false,
            Refunded: false
        })
      }


      useEffect(() => {
        // Fetch RMA data
        axios.get(`${baseURL}/rma`)
            .then(response => {
                setRmaData(response.data);
            })
            .catch(error => {
                console.error("Error fetching RMA data:", error);
            });
    }, [isModalOpen]);

    const [statusFilters, setStatusFilters] = useState({
        Approved: false,
        Pending: false,
        Completed: false,
        Rejected: false,
    });


    const handleViewRMACashier = (rma) => {
        setSelectedRma(rma);
        setIsViewRMAOpen(true); // Open the modal
    };
    
    const handleCloseRMACashier = () => {
        setIsViewRMAOpen(false); // Close the modal
    };



    const filteredRMA = (rmaData || []).filter(rma => {
        const matchesSearchQuery = searchQuery ? rma?.rma_id?.includes(searchQuery) : true;
        const matchesCustomerName = customerName ? rma?.customer_name?.includes(customerName) : true;
        const matchesCashierName = cashierName ? rma?.cashier?.includes(cashierName) : true;
        const matchesDateRange = (startDate ? new Date(rma?.date_initiated) >= new Date(startDate) : true) &&
                                 (endDate ? new Date(rma?.date_initiated) <= new Date(endDate) : true);
        const matchesPriceRange = (!minPrice || rma?.selling_price >= parseFloat(minPrice)) &&
                                  (!maxPrice || rma?.selling_price <= parseFloat(maxPrice));
        const matchesStatus = statusFilter ? rma?.status === statusFilter : true;

        return matchesSearchQuery && matchesCustomerName && matchesCashierName && matchesDateRange &&
               matchesPriceRange && matchesStatus;
    });
    

    

    const getStatusStyles = (status, warranty_status, process) => {
        let statusStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };
    
        switch (status) {
            case 'Approved':    
                statusStyles = {
                    textClass: 'text-[#14AE5C]',
                    bgClass: 'bg-[#CFF7D3]',
                };
                break;
            case 'Pending':
                statusStyles = {
                    textClass: 'text-[#BF6A02]',
                    bgClass: 'bg-[#FFF1C2]',
                };
                break;
            case 'In Progress':
                statusStyles = {
                    textClass: 'text-[#007BFF]',
                    bgClass: 'bg-[#C2D7FF]',
                };
                break;
            case 'Completed':
                statusStyles = {
                    textClass: 'text-[#8E8E93]',
                    bgClass: 'bg-[#E5E5EA]',
                        
                };
                break;
            case 'Expired':
                statusStyles = {
                    textClass: 'text-[#EC221F]',
                    bgClass: 'bg-[#CFF7D3]',
                };
                break;
                case 'Rejected':
                    statusStyles = {
                        textClass: 'text-[#EC221F]',
                        bgClass: 'bg-[#FEE9E7]',
                };
                break;
        }
    
        let warrantyStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };
    
        switch (warranty_status) {
            case 'Valid':
                warrantyStyles = {
                    textClass: 'text-[#14AE5C]',
                    bgClass: 'bg-[#CFF7D3]',
                };
                break;
            case 'Expired':
                warrantyStyles = {
                    textClass: 'text-[#EC221F]',
                    bgClass: 'bg-[#FEE9E7]',
                };
                break;
        }
    
        let processStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };
    
        switch (process) {  // Use the 'process' parameter instead of 'process_styles'
            case 'Replacement':
                processStyles = {
                    textClass: 'text-[#007BFF]',
                    bgClass: 'bg-[#C2D7FF]',
                };
                break;
            case 'Refund':
                processStyles = {
                    textClass: 'text-[#BF6A02]',
                    bgClass: 'bg-[#FFF1C2]',
                };
                break;
            case 'None':
                processStyles = {
                    textClass: 'text-[#8E8E93]',
                    bgClass: 'bg-[#E5E5EA]',
                };
                break;
        }
    
        return { statusStyles, warrantyStyles, processStyles };
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short', // This will return 'Oct' for 'October'
          day: 'numeric',
          year: 'numeric'
        });
      };

      const shortenString = (str) => {
        // Log the input for debugging
        console.log('Input string:', str);
    
        // Check if the input is a valid string and trim it
        if (typeof str === 'string') {
            const trimmedStr = str.trim(); // Remove leading and trailing spaces
            if (trimmedStr.length > 12) {
                return trimmedStr.slice(0, 12) + '...'; // Shorten and add ellipsis
            }
            return trimmedStr; // Return the original trimmed string if it's 10 characters or less
        }
        return 'N/A'; // Return 'N/A' if input is not a string
    };
      



  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
        <Navbar />
        <div className='pt-[70px] px-6 py-4 w-full h-full'>
            <div className='flex items-center justify-center py-5'>
            <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>RMA Requests</h1>
                <div className='w-full flex justify-end gap-2'>
                    <SearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search by RMA ID'} />
                </div>
            </div>

        <div className='flex gap-4'>
           <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
              <div className='flex flex-col gap-6 h-full'>
                <div className='flex flex-col gap-4 flex-grow'> {/* Make the form fields take up available space */}
                    {/* CUSTOMER NAME FIELD */}
                    <div className='flex flex-col'>
                    <label htmlFor='customerName' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CUSTOMER NAME</label>
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

                    {/* CASHIER NAME FIELD */}
                    <div className='flex flex-col gap-2'>
                    <label htmlFor='cashierName' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CASHIER NAME</label>
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

                    <div className='flex flex-col gap-2'>
                            <label className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>RMA Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`border rounded p-2 my-1 
                                    ${statusFilter === '' 
                                      ? (darkMode 
                                        ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                                        : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                                    : (darkMode 
                                        ? 'bg-dark-activeLink text-light-primary ' 
                                        : 'bg-light-activeLink text-dark-primary ')} 
                                    outline-none font-semibold`}
                                >
                            <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>All</option>
                            <option value='Pending' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Pending</option>
                            <option value='Approved' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Approved</option>
                            <option value='Rejected' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Rejected</option>
                            <option value='Completed' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Completed</option>
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
                </div>

                {/* RESET FILTERS BUTTON */}
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
             <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                        {filteredRMA.length > 0 ? (
                            <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                <thead className={`sticky top-0 z-5 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                                    <tr>
                                        <th className='p-2 text-center'>RMA ID</th>
                                        <th className='p-2 text-center'>TRANSACTION ID</th>
                                        <th className='p-2 text-center text-xs'>Date Initiated</th>
                                        <th className='p-2 text-center text-xs'>Customer Name</th>
                                        <th className='p-2 text-center text-xs'>Product Name</th>
                                        <th className='p-2 text-center text-xs'>Serial Number</th>
                                        <th className='p-2 text-center text-xs'>Status</th>
                                        <th className='p-2 text-center text-xs'>Process</th>
                                        <th className='p-2 text-center text-xs'>Warranty Status</th>
                                        <th className='p-2 text-center text-xs'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRMA
                                        .sort((a, b) => (a.status === 'Pending' ? -1 : b.status === 'Pending' ? 1 : 0))
                                        .map((rmaRequest, index) => {
                                            const { statusStyles, warrantyStyles, processStyles } = getStatusStyles(
                                                rmaRequest.status,
                                                rmaRequest.warranty_status,
                                                rmaRequest.process
                                            );

                                            return (
                                                <tr key={index} className={`border-b font-medium ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                                                    <td className='text-center py-4 text-sm'>{rmaRequest.rma_id}</td>
                                                    <td className='text-center py-4 text-sm'>{rmaRequest.transaction}</td>
                                                    <td className='text-center py-4 text-sm'>{formatDate(rmaRequest.date_initiated)}</td>
                                                    <td className='text-center py-4 text-sm'>{shortenString(rmaRequest.customer_name)}</td>
                                                    <td className='text-center py-4 text-sm'>{shortenString(rmaRequest.product)}</td>
                                                    <td className='text-center py-4 text-sm'>{rmaRequest.serial_number}</td>
                                                    <td className={`text-center py-4 rounded-md px-2 text-sm`}>
                                                        <p className={`${statusStyles.textClass} ${statusStyles.bgClass} p-2 rounded-md`}>
                                                            {rmaRequest.status}
                                                        </p>
                                                    </td>
                                                    <td className={`text-center py-4 rounded-md text-sm`}>
                                                        <p className={`${processStyles.textClass} ${processStyles.bgClass} p-2 rounded-md`}>
                                                            {rmaRequest.process}
                                                        </p>
                                                    </td>
                                                    <td className={`text-center py-4 rounded-md px-4 text-sm`}>
                                                        <p className={`${warrantyStyles.textClass} ${warrantyStyles.bgClass} p-2 rounded-md`}>
                                                            {rmaRequest.warranty_status}
                                                        </p>
                                                    </td>
                                                    <td className='text-center py-4 text-sm'>
                                                        <button className={`text-white px-4 py-2 rounded-md ${darkMode ? 'bg-light-button' : 'bg-light-button'}`} onClick={() => handleViewRMACashier(rmaRequest)}>
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>

                            </table>
                        ) : (
                            <div className='flex items-center justify-center h-[78vh] text-lg text-center'>
                                <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No products found matching the filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>



     {isViewRMAOpen && (
            <ViewRMACashier
                rma={selectedRma} // Pass the selected RMA as a prop
                onClose={handleCloseRMACashier} // Pass the close handler
            />
        )}

    </div>
  )
}

export default CashierRMA
