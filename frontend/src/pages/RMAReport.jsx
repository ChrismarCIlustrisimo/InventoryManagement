import React, { useState, useEffect, useRef } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import DateRangeModal from '../components/DateRangeModal'; // Import your modal
import { AiOutlineArrowRight } from "react-icons/ai";
import RmaSummary from '../components/reportsComponent/RmaSummary';
import RmaDetail from '../components/reportsComponent/RmaDetail';
import RmaSummaryMatrics from '../components/reportsComponent/RmaSummaryMatrics';
import axios from 'axios';
import ReactToPrint from 'react-to-print'; // Import react-to-print
import { jsPDF } from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas
import reportLogo from '../assets/reportLogo.png'; 
import { HiOutlineRefresh } from "react-icons/hi";

const RMAReport = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const baseURL = "http://localhost:5555";
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rmaData, setRmaData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('Today'); // Set default to 'Today'
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedReason, setSelectedReason] = useState(''); 
  const [includeReports, setIncludeReports] = useState(false); 
  const componentRef = useRef();

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};


  const [rmaStatus, setRmaStatus] = useState({
    Approved: false,
    Pending: false,
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
      [status]: !prevStatus[status],
    }));
  };

  const handleConfirmDates = (startDate, endDate) => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    setIsModalOpen(false); // Close the modal after confirming
  };

  useEffect(() => {
    const fetchRmaData = async () => {
      try {
        const response = await axios.get(`${baseURL}/rma`);
        setRmaData(response.data);
      } catch (error) {
        console.error('Error fetching RMA data:', error);
      }
    };

    fetchRmaData();
  }, []);

  const filterRMAData = () => {
    return rmaData.filter((rma) => {
      const isDateMatch = selectedDate === '' ||
          (selectedDate === 'Today' && new Date(rma.createdAt).toDateString() === new Date().toDateString()) ||
          (selectedDate === 'This Week' && new Date(rma.createdAt) >= new Date(new Date().setDate(new Date().getDate() - 7))) ||
          (selectedDate === 'This Month' && new Date(rma.createdAt).getMonth() === new Date().getMonth() && new Date(rma.createdAt).getFullYear() === new Date().getFullYear());

      const isStatusMatch = Object.keys(rmaStatus).some((status) => rmaStatus[status] && rma.status === status) || 
                            Object.values(rmaStatus).every((checked) => !checked);

      const isReasonMatch = selectedReason === '' || rma.reason === selectedReason;

      return isDateMatch && isStatusMatch && isReasonMatch;
    });
  };

  const filteredRMA = filterRMAData();

  const handleExportPdf = () => {
    const input = componentRef.current;
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
  
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width; 
  
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
  
      pdf.save('rma-report.pdf');
    });
  };


  const handleResetFilters = () => {
    setSelectedDate('');
    setSelectedReason('');
    setIncludeReports(false);
    setRmaStatus({
      Approved: false,
      Pending: false,
      Completed: false,
    });
  };

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4 w-full h-full'>
      <style>
          {`
            @media print {
              .print-header {
                width: 100%;
                border-bottom: 2px solid black;
                padding: 10px 0;
                gap: 20px;
              }

              .print-header img {
                max-width: 80%; /* Adjust as necessary */
                height: auto; /* Maintain aspect ratio */
              }

              .print-header h1 {
                font-weight: 600;
                font-size: 2.25rem;
                visibility: visible;
              }

              /* Hide other elements if necessary */
              .other-elements {
                display: none;
              }
            }

            @media screen {
              .print-header {
                display: none; /* Hide on screen */
              }
            }
          `}
        </style>
        <div className='flex items-center justify-center  my-2 h-[10%]'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            RMA Report
          </h1>
          <div className='h-full w-[40%] flex items-center justify-end gap-2 '>
          <ReactToPrint
              trigger={() => <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-textSecondary' : 'bg-dark-textSecondary'}`}>Print Report</button>}
              content={() => componentRef.current}
              pageStyle="print"
            /> 
            <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-button' : 'bg-dark-primary'}`} onClick={handleExportPdf}>Export as PDF</button>
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
                        ? (darkMode 
                          ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                          : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                      : (darkMode 
                          ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                          : 'bg-light-activeLink text-dark-primary border-dark-primary')} 
                      outline-none font-semibold`}
                  >
                    <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Date</option>
                    <option value='Today' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Today</option>
                    <option value='This Week' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Week</option>
                    <option value='This Month' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>This Month</option>
                    <option value='Custom Date' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Custom Date</option>
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
                  <label htmlFor='reason' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Reason for RMA</label>
                  <select
                    id='reason'
                    value={selectedReason}
                    onChange={handleReasonChange}
                    className={`border rounded p-2 my-1 
                      ${selectedReason === '' 
                        ? (darkMode 
                          ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                          : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                      : (darkMode 
                          ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                          : 'bg-light-activeLink text-dark-primary border-dark-primary')} 
                      outline-none font-semibold`}
                  >
                    <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Reason</option>
                    <option value='Defective Product' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Defective Product</option>
                    <option value='Product Malfunction' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>roduct Malfunction</option>
                    <option value='Missing Parts' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Missing Parts</option>
                    <option value='Warranty Repair' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Warranty Repair</option>
                    <option value='Request for Replacement' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Request for Replacement</option>
                    <option value='Product Not Compatible' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Product Not Compatible</option>
                  </select>
                </div>

                <div className='flex flex-col'>
                  <span className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Reports</span>
                  <label className='custom-checkbox flex items-center'>
                    <input 
                      type='checkbox' 
                      checked={includeReports} 
                      onChange={() => setIncludeReports(prev => !prev)} 
                    />
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Show Summary Metrics</span>
                  </label>
                </div>


              </div>
            </div>

            <div className='flex flex-col gap-2'>
                  <button
                      className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-gray-400 border-2 
                      ${darkMode ? 'hover:bg-dark-textSecondary hover:scale-105' : 'hover:bg-light-textSecondary hover:scale-105'} transition-all duration-300`}
                      onClick={handleResetFilters}>
                      <HiOutlineRefresh className='mr-2 text-2xl text-white' />
                      <p className='text-lg text-white'>Reset Filters</p>
                  </button>
              </div>
          </div>
          <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
            <div ref={componentRef}>
                <div className="print-header flex items-center justify-center flex-col">
                  <img src={reportLogo} alt="Report Logo" className="report-logo" />
                  <h1 className="report-title">RMA Report</h1>
                </div>
                <div className="print-header flex items-center justify-start">
                    <div className='w-[50%] flex'>
                      <div className='w-[30%]  flex flex-col items-start justify-start text-gray-400'>
                        <p>GENERATED ON</p>
                        <p>GENERATED BY</p>
                      </div>
                      <div className='w-[70%]  flex items-start justify-start flex-col '>
                        <p>{formatDate(new Date().toLocaleString())}</p>
                        <p>{user.name}</p>
                      </div>
                    </div>
                  </div>
                <RmaSummary filteredRMA={rmaData} />
                <RmaDetail filteredRMA={filteredRMA} />
                  {includeReports && (
                      <RmaSummaryMatrics filteredRMA={filteredRMA} />
                  )}
            </div>
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
