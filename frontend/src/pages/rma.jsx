import React, { useEffect, useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import AdminSearchBar from '../components/adminSearchBar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import ViewRMA from '../components/ViewRMA';
import { HiOutlineRefresh } from "react-icons/hi";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_DOMAIN } from '../utils/constants';

const Rma = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const baseURL = API_DOMAIN;
    const [searchQuery, setSearchQuery] = useState('');
    const [customerNameFilter, setCustomerNameFilter] = useState('');
    const [warranty_status, setWarrantyStatus] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedRma, setSelectedRma] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rmaData, setRmaData] = useState([]);
    const [productNameFilter, setProductNameFilter] = useState(''); 
    
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


    const handleViewRMA = (rma) => {
        setSelectedRma(rma);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRma(null);
    };

    


    const handleResetFilters = () => {
        setSearchQuery('');
        setCustomerNameFilter('');
        setProductNameFilter('');
        setStatusFilter(''); // Reset RMA status filter
        setWarrantyStatus('');
        setStartDate('');
        setEndDate('');
        setProductNameFilter('');
    };

    const filteredRMA = rmaData.filter(rma => {
        const matchesSearchQuery = rma.rma_id.includes(searchQuery) || rma.transaction.includes(searchQuery);
        const matchesCustomerName = rma.customer_name.includes(customerNameFilter);
        const matchesStatus = statusFilter ? rma.status === statusFilter : true;
        const matchesWarrantyStatus = warranty_status ? rma.warranty_status === warranty_status : true;
        const matchesDateRange = (startDate ? new Date(rma.date_initiated) >= new Date(startDate) : true) &&
                                  (endDate ? new Date(rma.date_initiated) <= new Date(endDate) : true);
        const matchesProductName = productNameFilter 
            ? rma.product.toLowerCase().includes(productNameFilter.toLowerCase()) 
            : true;
    
        return matchesSearchQuery && matchesCustomerName && matchesWarrantyStatus && matchesDateRange && matchesStatus && matchesProductName;
    });
    

    
    

    const getStatusStyles = (status, warranty_status) => {
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

        return { statusStyles, warrantyStyles };
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
            if (typeof str === 'string') {
            const trimmedStr = str.trim(); 
            if (trimmedStr.length > 20) {
                return trimmedStr.slice(0, 20) + '...'; 
            }
            return trimmedStr; 
        }
        return 'N/A'; 
    };
      


    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 p-2  w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                        RMA Management
                    </h1>
                    <div className='w-full flex justify-end gap-2'>
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search by RMA ID'} />
                    </div>
                </div>
                <div className='flex gap-4'>
                <div className={`h-[78vh] w-[22%] rounded-2xl p-4 justify-between flex flex-col ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
                <div className='flex flex-col gap-2 '>


                    <div className='flex flex-col gap-2'>
                        <label htmlFor='customerName' className={`text-sm font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CUSTOMER NAME</label>
                        <input
                            type='text'
                            placeholder='Enter Customer Name'
                            value={customerNameFilter}
                            onChange={(e) => setCustomerNameFilter(e.target.value)}
                            className={`border rounded p-2 ${customerNameFilter === '' 
                                ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                              outline-none font-semibold`}
                          />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='productName' className={`text-sm  font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Product Name</label>
                        <input
                            type='text'
                            placeholder='Enter Product Name'
                            value={productNameFilter}
                            onChange={(e) => setProductNameFilter(e.target.value)}
                            className={`border rounded p-2 ${productNameFilter === '' 
                                ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                              outline-none font-semibold`}
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                            <label className={`text-sm font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>RMA Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className={`border rounded p-2 ${statusFilter === '' 
                                    ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                    : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
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
                        <label className={`text-sm font-semibold mb-2 ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                            SALES DATE
                        </label>

                        <div className='flex justify-center items-center'>
                            <div className='flex flex-col'>
                            <div className={`w-[130px] border rounded bg-transparent pl-1
                              ${startDate === '' 
                                ? (darkMode ? 'bg-transparent text-black border-light-textPrimary' : 'bg-transparent text-white border-dark-textPrimary') 
                                : (darkMode 
                                  ? ' text-light-primary border-light-textPrimary' 
                                  : ' text-dark-primary border-dark-textPrimary')} `}>
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}  // Set date directly
                                dateFormat='MM-dd-yyyy'
                                className='bg-transparent w-[100%] p-1 outline-none'
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
                                onChange={(date) => setEndDate(date)}  // Set date directly
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
                            <HiOutlineRefresh className='mr-2 text-2xl text-white' />
                            <p className='text-lg text-white'>Reset Filters</p>
                        </button>
                    </div>
                </div>
                    <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                        {filteredRMA.length > 0 ? (
                            <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                <thead className={`sticky top-0 z-5 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                                    <tr>
                                        <th className='p-2 text-left'>RMA ID</th>
                                        <th className='p-2 text-left'>TRANSACTION ID</th>
                                        <th className='p-2 text-left text-xs'>Date Initiated</th>
                                        <th className='p-2 text-left text-xs'>Customer Name</th>
                                        <th className='p-2 text-left text-xs'>Product Name</th>
                                        <th className='p-2 text-left text-xs'>Serial Number</th>
                                        <th className='p-2 text-center text-xs'>Status</th>
                                        {/*<th className='p-2 text-left text-xs'>Warranty Status</th>*/}
                                        <th className='p-2 text-center text-xs'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRMA.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((rmaRequest, index) => {
                                        const { statusStyles, warrantyStyles } = getStatusStyles(rmaRequest.status, rmaRequest.warranty_status);

                                        return (
                                            <tr key={index} className={`border-b font-medium ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                                                <td className='text-left p-2  text-sm'>{rmaRequest.rma_id}</td>
                                                <td className='text-left p-2  text-sm'>{rmaRequest.transaction}</td>
                                                <td className='text-left p-2  text-sm'>{formatDate(rmaRequest.date_initiated)}</td>
                                                <td className='text-left p-2  text-sm'>{shortenString(rmaRequest.customer_name)}</td>
                                                <td className='text-left p-2  text-sm'>{shortenString(rmaRequest.product)}</td>
                                                <td className='text-left p-2  text-sm'>{rmaRequest.serial_number}</td>
                                                <td className={`text-center p-2  rounded-md px-2 text-sm`}>
                                                    <p className={`${statusStyles.textClass} ${statusStyles.bgClass} p-2 rounded-md`}>
                                                        {rmaRequest.status}
                                                    </p>
                                                </td>
                                                {/*<td className={`text-center p-2  rounded-md px-4 text-sm`}>
                                                    <p className={`${warrantyStyles.textClass} ${warrantyStyles.bgClass} p-2 rounded-md`}>
                                                        {rmaRequest.warranty_status}
                                                    </p>
                                                </td>*/}
                                         
                                                <td className='text-center p-2  text-sm'>
                                                    <button className={`text-white px-4 py-2 rounded-md ${darkMode ? 'bg-light-button' : 'bg-light-button'}`} onClick={() => handleViewRMA(rmaRequest)}>
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

            {/* Modal for RMA Details */}
            {isModalOpen && selectedRma && (
                <ViewRMA rma={selectedRma} onClose={closeModal} darkMode={darkMode} />
            )}
            <ToastContainer />
        </div>
    );
};

export default Rma;