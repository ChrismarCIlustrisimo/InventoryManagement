import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import AdminSearchBar from '../components/adminSearchBar';
import { useNavigate } from 'react-router-dom';
import { API_DOMAIN } from '../utils/constants';
import { HiOutlineRefresh } from 'react-icons/hi';
import { toast,ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AuditLog = () => {
    const { darkMode } = useAdminTheme();
    const baseURL = API_DOMAIN;
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/audit`);
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch logs');
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchLogs();
    }, []);
  
    const handleStartDateChange = (date) => {
      setStartDate(date);
    };
  
    const handleEndDateChange = (date) => {
      setEndDate(date);
    };
  
    const formatDate = (date) => {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      const formattedDate = new Date(date).toLocaleDateString('en-US', options);
      const formattedTime = new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${formattedDate} ${formattedTime}`;
    };
  
    const handleResetFilters = () => {
      setSearchQuery('');
      setStartDate(null);
      setEndDate(null);
      setSelectedDate('');
    };
  
    const handleDateFilterChange = (filter) => {
      setSelectedDate(filter);
      const today = new Date();
      switch (filter) {
        case 'Today':
          setStartDate(new Date(today.setHours(0, 0, 0, 0)));
          setEndDate(new Date(today.setHours(23, 59, 59, 999)));
          break;
        case 'This Week': {
          const dayOfWeek = today.getDay();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - (dayOfWeek || 7) + 1);
          setStartDate(new Date(startOfWeek.setHours(0, 0, 0, 0)));
  
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          setEndDate(new Date(endOfWeek.setHours(23, 59, 59, 999)));
          break;
        }
        case 'This Month':
          setStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
          setEndDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
          break;
        default:
          setStartDate(null);
          setEndDate(null);
      }
    };
  
// Apply filters to the logs
const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const matchesDateRange =
      (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
  
    const matchesSearchQuery =
      searchQuery.trim() === '' ||
      Object.values(log).some(
        (value) =>
          value &&
          typeof value === 'string' &&
          value.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
    return matchesDateRange && matchesSearchQuery;
  });
  


    return (    
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4 w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Audit Trail</h1>
                    <div className='w-[90%] flex justify-end gap-2'>
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search....'} />
                    </div>
                </div>
                <div className='flex gap-6'>
                    <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                    <div className='flex flex-col gap-3 h-[90%]'>
                        <div className='flex flex-col gap-4'>
                          <div className='flex flex-col'>
                            <label htmlFor='date' className={`text-sm font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>DATE</label>
                            <select 
                                id='date'
                                value={selectedDate}
                                onChange={(e) => handleDateFilterChange(e.target.value)}
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
                                <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>All</option>
                                <option value='Today' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Today</option>
                                <option value='This Week' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Week</option>
                                <option value='This Month' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Month</option>
                                <option value='This Year' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Month</option>

                            </select>      
                            </div>

                            <div className='flex flex-col gap-2'>

                            <label className={`text-sm font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>DATE RANGE</label>

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
                    </div>

                        <div className='flex flex-col gap-2 mb-auto h-[10%]'>
                            <button
                                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-gray-400 border-2 ${darkMode ? 'hover:bg-dark-textSecondary hover:scale-105' : 'hover:bg-light-textSecondary hover:scale-105'} transition-all duration-300`}
                                onClick={handleResetFilters}

                            >
                                <HiOutlineRefresh className="mr-2 text-2xl text-white" />
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl  ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
                        {loading ? (
                        <p>Loading...</p>
                        ) : error ? (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                            <p>{error}</p>
                        </div>
                        ) : logs.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                            <p>No logs found.</p>
                        </div>
                        ) : (
                            <table className="w-full text-left text-xs table-fixed">
                            <thead>
                                <tr
                                    className={`w-full text-sm font-semibold border-b-2 ${
                                        darkMode
                                            ? 'border-light-border bg-light-container'
                                            : 'border-dark-border bg-dark-container'
                                    }`}
                                >
                                    <th className="py-2 px-4 w-[16%]">Timestamp</th>
                                    <th className="py-2 px-4 w-[10%]">User</th>
                                    <th className="py-2 px-4 w-[8%]">Action</th>
                                    <th className="py-2 px-4 w-[8%]">Module</th>
                                    <th className="py-2 px-4 w-[41%] truncate">Event</th>
                                    <th className="py-2 px-4 w-[16%] truncate">Previous Value</th>
                                    <th className="py-2 px-4 w-[16%] truncate">Updated Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr
                                        key={log._id}
                                        className={`border-b cursor-pointer ${
                                            darkMode
                                                ? 'bg-light-container1'
                                                : 'bg-dark-container1'
                                        }`}
                                    >
                                        <td className="py-3 px-4">{formatDate(log.timestamp)}</td>
                                        <td className="py-3 px-4">{log.user}</td>
                                        <td className="py-3 px-4">{log.action}</td>
                                        <td className="py-3 px-4">{log.module}</td>
                                        <td className="py-3 px-4 truncate">
                                            {log.event.split(',').map((eventItem, index) => (
                                                <div key={index}>{eventItem.trim()}</div>
                                            ))}
                                        </td>
                                        <td className="py-3 px-4 truncate">
                                            {typeof log.previousValue === 'object' ? (
                                                Object.entries(log.previousValue).map(
                                                    ([key, value]) => (
                                                        <div key={key}>
                                                            {value.previous && (
                                                                <span>{value.previous || 'N/A'}</span>
                                                            )}
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <span>{log.previousValue || 'N/A'}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 truncate">
                                            {typeof log.updatedValue === 'object' ? (
                                                Object.entries(log.updatedValue).map(
                                                    ([key, value]) => (
                                                        <div key={key}>
                                                            {value.updated && (
                                                                <span>{value.updated || 'N/A'}</span>
                                                            )}
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <span>{log.updatedValue || 'N/A'}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        )}

                    </div>


                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AuditLog;
