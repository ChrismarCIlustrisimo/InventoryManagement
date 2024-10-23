import React, { useState, useRef, useEffect } from 'react';
import '../App.css'
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import DateRangeModal from '../components/DateRangeModal'; // Import your modal
import { HiOutlineRefresh } from "react-icons/hi";
import SalesSummary from '../components/reportsComponent/SalesSummary';
import SalesBreakdown from '../components/reportsComponent/SalesBreakdown';
import SalesByCategory from '../components/reportsComponent/SalesByCategory';
import PaymentMethods from '../components/reportsComponent/PaymentMethods';
import RefundSummary from '../components/reportsComponent/RefundSummary';
import VATSummary from '../components/reportsComponent/VATSummary';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const CashierSalesReport = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [salesDataData, setSalesDataData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]); // New state for filtered data
  const [salesDataStatus, setSalesDataStatus] = useState({
    Completed: false,
    Refunded: false,
  });

  const [reportIncluded, setReportIncluded] = useState({
    'Sales by Category': false,
    'Payment Method': false,
    'Refunds Summary': false,
    'VAT Summary': false,
  });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    if (value === 'Custom Date') {
      setIsModalOpen(true); // Open the modal if Custom Date is selected
    }
  };

  const handleSelectedCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Update the selected category
  };

  const handleCheckboxChange = (status) => {
    setSalesDataStatus((prevState) => ({
      ...prevState,
      [status]: !prevState[status],
    }));
  };

  const handleCheckboxChangeReports = (status) => {
    setReportIncluded((prevState) => ({
      ...prevState,
      [status]: !prevState[status],
    }));
  };

  const handleConfirmDates = (startDate, endDate) => {
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    setIsModalOpen(false);
  };

  // Create a ref for the content to be printed
  const componentRef = useRef();

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5555/transaction', {
        params: {
          payment_status: 'paid',
        },
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      setSalesData(response.data.data);
      setFilteredSalesData(response.data.data); // Initialize filtered data
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSales();
    }
  }, [user]);

  useEffect(() => {
    // Filter sales data whenever salesData or filters change
    let filteredData = salesData;

    // Filter by selected category if specified
    if (selectedCategory) {
      filteredData = filteredData.filter(item => item.category === selectedCategory);
    }

    // Filter by sales status
    if (Object.keys(salesDataStatus).some(key => salesDataStatus[key])) {
      filteredData = filteredData.filter(item =>
        (salesDataStatus['Completed'] && item.status === 'Completed') ||
        (salesDataStatus['Refunded'] && item.status === 'Refunded')
      );
    }

    // Update filtered sales data state
    setFilteredSalesData(filteredData);
  }, [salesData, selectedCategory, salesDataStatus]);



const handleResetFilters = () => {
  setSelectedCategory('');
  setSalesDataStatus({
    Completed: false,
    Refunded: false,
  });
  setReportIncluded({
    'Sales by Category': false,
    'Payment Method': false,
    'Refunds Summary': false,
    'VAT Summary': false,
  })
  setFilteredSalesData(salesData); // Reset filtered data
};

  
  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <Navbar />
      <div className='pt-[70px] px-6 py-4 w-full h-full'>
      <div className='flex items-center justify-center  my-2 h-[10%]'>
      <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            Sales Report
          </h1>
          <div className='h-full w-[40%] flex items-center justify-end gap-2 '>
          <ReactToPrint 
              trigger={() => <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-textSecondary' : 'bg-dark-textSecondary'}`}>Print Report</button>}
              content={() => componentRef.current}
              pageStyle="print"
              
            />
            <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-button' : 'bg-dark-button'}`}>Export as PDF</button>
          </div>
        </div>
        <div className='flex gap-4 items-center justify-center'>
        <div className={`h-[78vh] max-h-[84%] w-[22%] rounded-2xl p-4 flex flex-col justify-between overflow-y-auto ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
         <div className='flex flex-col gap-6 flex-grow'>
              <div className="flex flex-col gap-4">
                <div className='flex flex-col'>
                  <label htmlFor='date' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Date</label>
                  <select
                    id='date'
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
                  <span className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Sales Status</span>
                  {Object.keys(salesDataStatus).map((status) => (
                    <label key={status} className='custom-checkbox flex items-center'>
                      <input 
                        type='checkbox' 
                        checked={salesDataStatus[status]} 
                        onChange={() => handleCheckboxChange(status)} 
                      />
                      <span className='checkmark'></span>
                      <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>{status}</span>
                    </label>
                  ))}
                </div>



                {/* Category Dropdown */}
                <div className='flex flex-col'>
                  <label htmlFor='category' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Product Category</label>
                  <select
                    id='category'
                    value={selectedCategory} // Set the value of the select to the state
                    onChange={handleSelectedCategoryChange} // Use the new handler
                    className={`border rounded p-2 my-1 
                      ${selectedCategory === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}
                  >
                    <option value=''>Select Category</option>
                    <option value='Components'>Components</option>
                    <option value='Peripherals'>Peripherals</option>
                    <option value='Accessories'>Accessories</option>
                    <option value='PC Furniture'>PC Furniture</option>
                    <option value='OS & Software'>OS & Software</option>
                  </select>
                </div>

                <div className='flex flex-col gap-2 py-2 pb-8'>
                  <span className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Included Reports</span>
                  {Object.keys(reportIncluded).map((status) => (
                    <label key={status} className='custom-checkbox flex items-center'>
                      <input 
                        type='checkbox' 
                        checked={reportIncluded[status]} 
                        onChange={() => handleCheckboxChangeReports(status)} 
                      />
                      <span className='checkmark'></span>
                      <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>{status}</span>
                    </label>
                  ))}
                </div>


              </div>
            </div>

            <button
              className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-transparent border-2 
                ${darkMode ? 'hover:bg-opacity-30 hover:bg-dark-textSecondary' : 'hover:bg-opacity-30 hover:bg-light-textSecondary'}`}
                    onClick={handleResetFilters}
              >
                <HiOutlineRefresh className={`mr-2 text-2xl ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`} />
                <p className={`text-lg ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`}>Reset Filters</p>
              </button>
          </div>

          
          
          <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl px-4 py-2 flex flex-col ${darkMode ? 'bg-light-container text-light-textPrimary' : 'bg-dark-container text-dark-textPrimary'}`}>
            <div ref={componentRef}>
                <>
                  <SalesSummary salesData={filteredSalesData} />
                  <div className='flex flex-col gap-4'>
                  <SalesBreakdown salesData={filteredSalesData} />
                    {reportIncluded['Sales by Category'] && (<SalesByCategory salesData={filteredSalesData} />)}
                    {reportIncluded['Payment Method'] && (<PaymentMethods salesData={filteredSalesData} />)}
                    {reportIncluded['Refunds Summary'] && (<RefundSummary salesData={filteredSalesData} />)}
                    {reportIncluded['VAT Summary'] && (<VATSummary salesData={filteredSalesData} />)}
                  </div>
                </>
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

export default CashierSalesReport;
