import React, { useState, useEffect, useRef } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import DateRangeModal from '../components/DateRangeModal'; // Import your modal
import { HiOutlineRefresh } from "react-icons/hi";
import InventorySummary from '../components/reportsComponent/InventorySummary';
import LowStockAlert from '../components/reportsComponent/LowStockAlert';
import LowStockMetrics from '../components/reportsComponent/LowStockMetrics';
import axios from 'axios';
import ReactToPrint from 'react-to-print'; // Import react-to-print
import { jsPDF } from 'jspdf'; // Import jsPDF
import html2canvas from 'html2canvas'; // Import html2canvas
import reportLogo from '../assets/reportLogo.png'; 


const InventoryReport = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const componentRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [SupplierName, setSupplierName] = useState(''); // Initialize SupplierName state
  const [ProducName, setProducName] = useState(''); // Initialize ProducName state
  const [stockStatus, setStockStatus] = useState({
    HIGH: false,
    LOW: false,
    'OUT OF STOCK': false,
  });

  const [showMetrics, setShowMetrics] = useState(false); // State for showing total stock metrics
  const [includeLowStockAlert, setIncludeLowStockAlert] = useState(false); // State for low stock alert checkbox
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};



useEffect(() => {
  const fetchProducts = async () => {
      try {
          const response = await axios.get('http://localhost:5555/product'); // Adjust the endpoint if necessary
          setInventoryData(response.data); 
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  };

  fetchProducts();
}, []);


  const handleSelectedCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Update the selected category
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    if (value === 'Custom Date') {
      setIsModalOpen(true); // Open the modal if Custom Date is selected
    }
  };


  const handleMetricsCheckboxChange = () => {
    setShowMetrics((prevState) => !prevState); // Toggle showing metrics
  };

  const handleLowStockAlertChange = () => {
    setIncludeLowStockAlert((prevState) => !prevState); // Toggle low stock alert checkbox
  };


  const handleExportPdf = () => {
    const input = componentRef.current;
  
    // Use html2canvas to capture the div as an image
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
  
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; // Leave some margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height based on width
  
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
  
      pdf.save('sales-report.pdf');
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSupplierName('');
    setProductName('');
    setStockStatus({
      HIGH: false,
      LOW: false,
      'OUT OF STOCK': false,
    });
    setShowMetrics(false);
    setIncludeLowStockAlert(false);
  };

  let productData = inventoryData?.data || [];

  const filteredInventoryData = productData.filter((product) => {
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    const supplierMatch = SupplierName ? product.supplier.toLowerCase().includes(SupplierName.toLowerCase()) : true;
    const productMatch = ProducName ? product.name.toLowerCase().includes(ProducName.toLowerCase()) : true;

    return categoryMatch && supplierMatch && productMatch;
});



  
  

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
              .other-elements { /* Adjust as needed */
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
        <div className='flex items-center justify-center my-2 h-[10%]'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            Inventory Report
          </h1>
          <div className='h-full w-[40%] flex items-center justify-end gap-2 '>
          <ReactToPrint
                trigger={() => <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-textSecondary' : 'bg-dark-textSecondary'}`}>Print Report</button>}
                content={() => componentRef.current}
                pageStyle="print"
                
              /> 
           <button className={`text-white rounded-md w-[30%] h-[80%] ${darkMode ? 'bg-light-button' : 'bg-dark-button'}`} onClick={handleExportPdf}>Export as PDF</button>
          </div>
        </div>
        <div className='flex gap-4 items-center justify-center'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
            <div className='flex flex-col gap-6 flex-grow'>
              <div className="flex flex-col gap-4">

                <div className='flex flex-col gap-2'>
                  <label htmlFor='category' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Product Category</label>
                  <select
                    id='category'
                    value={selectedCategory} // Set the value of the select to the state
                    onChange={handleSelectedCategoryChange} // Use the new handler
                    className={`border rounded p-2 
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

                <div className='flex flex-col gap'>
                  <label htmlFor='SupplierName' className={`text-md  font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Supplier Name</label>
                  <input 
                    id='SupplierName'
                    type='text'
                    value={SupplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className={`border rounded p-2 my-1 ${SupplierName === '' 
                      ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                      : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-transparent text-black')} 
                    outline-none font-semibold`}
                    placeholder='Search Supplier Name'
                  />
                </div>

                <div className='flex flex-col'>
                  <label htmlFor='ProductName' className={`text-md  font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Product Name</label>
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

                {/* Include Reports Section */}
                <div className='flex flex-col py-4 gap-2'>
                  <span className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>Include Reports</span>
                  <label className='custom-checkbox flex items-center'>
                    <input 
                      type='checkbox' 
                      checked={showMetrics} 
                      onChange={handleMetricsCheckboxChange} 
                    />
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Total Stock Metrics</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input 
                      type='checkbox' 
                      checked={includeLowStockAlert} 
                      onChange={handleLowStockAlertChange} 
                    />
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Low Stock Alert</span>
                  </label>
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
          <div className={`h-[78vh] w-[77%] rounded-2xl overflow-auto p-4 ${darkMode ? 'bg-light-container text-light-textPrimary' : 'bg-dark-container text-dark-textPrimary'}`}>
            <div ref={componentRef} className="sales-report-content">
              <div className="print-header flex items-center justify-center flex-col">
                    <img src={reportLogo} alt="Report Logo" className="report-logo" />
                    <h1 className="report-title">Sales Report</h1>
                  </div>
                  <div className="print-header flex items-center justify-start">
                    <div className='w-[50%] flex'>
                      <div className='w-[30%]  flex flex-col items-start justify-start text-gray-400'>
                        <p>GENERATED ON</p>
                      </div>
                      <div className='w-[70%]  flex items-start justify-start flex-col '>
                        <p>{formatDate(new Date().toLocaleString())}</p>
                      </div>
                    </div>
                  </div>
              <InventorySummary inventoryData={filteredInventoryData}/>
              {includeLowStockAlert && <LowStockAlert inventoryData={filteredInventoryData} />} {/* Conditional rendering of LowStockAlert */}
              {showMetrics && <LowStockMetrics inventoryData={filteredInventoryData} />} {/* Conditional rendering of LowStockMetrics */}
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Modal */}
      {isModalOpen && <DateRangeModal onConfirm={handleConfirmDates} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default InventoryReport;