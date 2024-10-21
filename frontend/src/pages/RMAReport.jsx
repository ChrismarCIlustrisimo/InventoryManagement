import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import DateRangeModal from '../components/DateRangeModal'; // Import your modal
import { AiOutlineArrowRight } from "react-icons/ai";

const RMAReport = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();

  // State for report generation
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [ProducName, setProducName] = useState(''); // Initialize ProducName state
  const [selectedReason, setSelectedReason] = useState(''); // Initialize selectedReason state
  const [customerName, setCustomerName] = useState(''); // New state for customer search

  const [rmaStatus, setRmaStatus] = useState({
    Approved: false,
    'In Progress': false,
    Completed: false,
  });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    if (value === 'Custom Date') {
      setIsModalOpen(true); // Open the modal if Custom Date is selected
    }
  };

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
  };

  const handleCheckboxChange = (status) => {
    setRmaStatus((prevStatus) => ({
      ...prevStatus,
      [status]: !prevStatus[status], // Toggle the checkbox state
    }));
  };

  const handleConfirmDates = (startDate, endDate) => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    setIsModalOpen(false); // Close the modal after confirming
    // You can handle the confirmed dates here (e.g., trigger report generation)
  };

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4 w-full h-full'>
        <div className='flex items-center justify-center  my-2 h-[10%]'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            RMA Report
          </h1>
          <div className='h-full w-[40%] flex items-center justify-center gap-2 '>
            <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-textSecondary' : 'bg-dark-textSecondary'}`}>Print Report</button>
            <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-button' : 'bg-dark-button'}`}>Export as PDF</button>
            <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-button' : 'bg-dark-button'}`}>Export as CSV</button>
          </div>
        </div>
        <div className='flex gap-4 items-center justify-center'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
            <div className='flex flex-col gap-6 flex-grow'> {/* Ensure this takes up available space */}
              <div className="flex flex-col gap-2">
                <div className='flex flex-col'>
                  <label htmlFor='category' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CATEGORY</label>
                  <select
                    id='category'
                    value={selectedDate}
                    onChange={handleCategoryChange}
                    className={`border rounded p-2 my-1 
                      ${selectedDate === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}
                  >
                    <option value=''>Select Date</option>
                    <option value='Today'>Today</option>
                    <option value='This Week'>This Week</option>
                    <option value='This Month'>This Month</option>
                    <option value='Custom Date'>Custom Date</option>
                  </select>
                </div>

                <div className='flex flex-col'>
                  <span className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Stock Status</span>
                  {Object.keys(rmaStatus).map((status) => (
                    <label key={status} className='custom-checkbox flex items-center'>
                      <input 
                        type='checkbox' 
                        checked={rmaStatus[status]} 
                        onChange={() => handleCheckboxChange(status)} 
                      />
                      <span className='checkmark'></span>
                      <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>{status}</span>
                    </label>
                  ))}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='ProductName' className={`text-md mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Product Name</label>
                  <input 
                    id='ProductName'
                    type='text'
                    value={ProducName}
                    onChange={(e) => setProducName(e.target.value)}
                    className={`border rounded p-2 my-1 ${ProducName === '' 
                      ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                      : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-transparent text-black')} 
                    outline-none font-semibold`}
                    placeholder='Search Product Name'
                  />
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='reason' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Reason for RMA</label>
                  <select
                    id='reason'
                    value={selectedReason}
                    onChange={handleReasonChange}
                    className={`border rounded p-2 my-1 
                      ${selectedReason === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}
                  >
                    <option value=''>Select Reason</option>
                    <option value='Defective Product'>Defective Product</option>
                    <option value='Product Malfunction'>Product Malfunction</option>
                    <option value='Missing Parts'>Missing Parts</option>
                    <option value='Warranty Repair'>Warranty Repair</option>
                    <option value='Request for Replacement'>Request for Replacement</option>
                    <option value='Product Not Compatible'>Product Not Compatible</option>
                  </select>
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='customerName' className={`text-md mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Customer Name</label>
                  <input 
                    id='customerName'
                    type='text'
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`border rounded p-2 my-1 ${customerName === '' 
                      ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                      : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-transparent text-black')} 
                    outline-none font-semibold`}
                    placeholder='Search Customer Name'
                  />
                </div>

              </div>
            </div>

            {/* Generate Report button positioned at the bottom */}
            <button
              className={`text-lg text-white rounded px-4 py-4 mt-auto hover:bg-opacity-80 transition duration-200 flex gap-2 items-center justify-center ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`} // Updated button class
              onClick={() => {
                // Trigger report generation logic here if needed
              }}
            >
              Generate Report
              <AiOutlineArrowRight />
            </button>
          </div>
          <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
            {/* Report data can be displayed here */}
          </div>
        </div>
      </div>

      {/* Date Range Modal */}
      <DateRangeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmDates} 
      />
    </div>
  );
};

export default RMAReport;
