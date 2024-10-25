import React, { useEffect, useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import AdminSearchBar from '../components/adminSearchBar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import ViewRMA from '../components/ViewRMA';
import { HiOutlineRefresh } from "react-icons/hi";
import axios from 'axios';

const Rma = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const [searchQuery, setSearchQuery] = useState('');
    const [customerNameFilter, setCustomerNameFilter] = useState('');
    const [warranty_status, setWarrantyStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedRma, setSelectedRma] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rmaData, setRmaData] = useState([]);

    
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
        'In Progress': false,
        Completed: false,
    });


    const handleViewRMA = (rma) => {
        setSelectedRma(rma);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRma(null);
    };


    const handleCheckboxChange = (status) => {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setCustomerNameFilter('');
        setWarrantyStatus('');
        setStartDate('');
        setEndDate('');
        setStatusFilters({
            Approved: false,
            Pending: false,
            'In Progress': false,
            Completed: false,
        });
    };

    const filteredRMA = rmaData.filter(rma => {
        const matchesSearchQuery = rma.rma_id.includes(searchQuery);
        const matchesCustomerName = rma.customer_name.includes(customerNameFilter);
        const matchesWarrantyStatus = warranty_status ? rma.warranty_status === warranty_status : true;
        const matchesDateRange = (startDate ? new Date(rma.date_initiated) >= new Date(startDate) : true) &&
                                  (endDate ? new Date(rma.date_initiated) <= new Date(endDate) : true);
        const matchesStatus = Object.keys(statusFilters).some(status => statusFilters[status] && rma.status === status) || 
                              Object.values(statusFilters).every(value => !value);
        
        return matchesSearchQuery && matchesCustomerName && matchesWarrantyStatus && matchesDateRange && matchesStatus;
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
        // Log the input for debugging
        console.log('Input string:', str);
    
        // Check if the input is a valid string and trim it
        if (typeof str === 'string') {
            const trimmedStr = str.trim(); // Remove leading and trailing spaces
            if (trimmedStr.length > 20) {
                return trimmedStr.slice(0, 20) + '...'; // Shorten and add ellipsis
            }
            return trimmedStr; // Return the original trimmed string if it's 10 characters or less
        }
        return 'N/A'; // Return 'N/A' if input is not a string
    };
      


    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4 w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                        RMA Management
                    </h1>
                    <div className='w-full flex justify-end gap-2'>
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search by RMA ID'} />
                    </div>
                </div>
                <div className='flex gap-4'>
                 <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
                  <div className='flex flex-col gap-6'>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor='rmaId' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>RMA ID</label>
                        <input
                        type='text'
                        placeholder='Enter RMA ID'
                        value={customerNameFilter}
                        onChange={(e) => setCustomerNameFilter(e.target.value)}
                        className={`border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-textSecondary' : 'dark:border-dark-textSecondary'} w-full p-2`}
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Warranty Status</label>
                        <select
                        value={warranty_status}
                        onChange={(e) => setWarrantyStatus(e.target.value)}
                        className={`border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-textSecondary' : 'dark:border-dark-textSecondary'} w-full p-2`}
                        >
                        <option value=''>All</option>
                        <option value='Valid'>Valid</option>
                        <option value='Expired'>Expired</option>
                        </select>
                    </div>
                    
                    
                    <div className='flex flex-col gap-2'>
                        <span className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>STATUS</span>
                          {Object.keys(statusFilters).map((status) => (
                            <label key={status} className='custom-checkbox flex items-center'>
                               <input type='checkbox' checked={statusFilters[status]} onChange={() => handleCheckboxChange(status)}/>
                                    <span className='checkmark'></span>
                                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>{status}</span>
                            </label>
                          ))}
                    </div>
                    
                    <div className='flex flex-col gap-2'>
                        <label className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>RMA REQUEST DATE</label>
                        <div className='w-full flex items-center justify-between'>
                            <p className='w-[50%] text-xs'>From</p>
                            <p className='w-[50%] text-xs pl-4'>To</p>

                        </div>
                        <div className='flex gap-2 w-[46%]'>
                            <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-textSecondary bg-light-input' : 'dark:border-dark-textSecondary '} w-full p-2`}/>
                            <span className='text-2xl text-center h-full flex items-center text-[#a8adb0]'>-</span>
                            <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-textSecondary bg-light-input' : 'dark:border-dark-textSecondary '} w-full p-2`} />
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
                                        <th className='p-2 text-center text-xs'>Warranty Status</th>
                                        <th className='p-2 text-center text-xs'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRMA.map((rmaRequest, index) => {
                                        const { statusStyles, warrantyStyles } = getStatusStyles(rmaRequest.status, rmaRequest.warranty_status);

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
                                                <td className={`text-center py-4 rounded-md px-4 text-sm`}>
                                                    <p className={`${warrantyStyles.textClass} ${warrantyStyles.bgClass} p-2 rounded-md`}>
                                                        {rmaRequest.warranty_status}
                                                    </p>
                                                </td>
                                         
                                                <td className='text-center py-4 text-sm'>
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

        </div>
    );
};

export default Rma;
