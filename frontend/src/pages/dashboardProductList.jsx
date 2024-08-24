import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import SearchBar from '../components/adminSearchBar';
import 'react-datepicker/dist/react-datepicker.css';
import { GrPowerReset } from 'react-icons/gr';
import '../App.css';

const DashboardProductList = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate(); // Initialize navigate

  // State for filters
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Handler functions
  const handleDateFilter = () => {};
  const handleStartDateChange = date => setStartDate(date);
  const handleEndDateChange = date => setEndDate(date);
  const handleMinPriceChange = e => setMinPrice(e.target.value);
  const handleMaxPriceChange = e => setMaxPrice(e.target.value);
  const handleSortByChange = e => setSortBy(e.target.value);
  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
  };

  // Navigate to Add Product page
  const handleAddProductClick = () => {
    navigate('/addproduct');
  };

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-BG' : 'bg-dark-BG'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4'>
        <div className='flex items-center justify-center py-5'>
          <div className='flex w-[30%]'>
            <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Product</h1>
            <div className={`flex w-[100%] gap-2 items-center justify-center border rounded-xl ${darkMode ? 'border-black' : 'border-white'}`}>
              <p className={`font-semibold text-lg ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>350</p>
              <p className={`text-xs ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>total products</p>
            </div>
          </div>
          <div className='w-full flex justify-end gap-6'>
            <SearchBar />
            <button
              className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-ACCENT' : 'dark:bg-dark-ACCENT'}`}
              onClick={handleAddProductClick} // Attach onClick handler
            >
              Add Product
            </button>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD'}`}>

            <div className='flex flex-col gap-4'>
              <div className='flex flex-col'>
                <label htmlFor='category' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>CATEGORY</label>
                <select
                  id='category'
                  onChange={handleDateFilter}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                >
                  <option value=''>Select Category</option>
                  <option value='components'>Components</option>
                  <option value='peripherals'>Peripherals</option>
                  <option value='accessories'>Accessories</option>
                  <option value='pc_furniture'>PC Furniture</option>
                  <option value='os_software'>OS & Software</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='sortBy' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>SORT BY</label>
                <select
                  id='sortBy'
                  onChange={handleSortByChange}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                >
                  <option value=''>Select Option</option>
                  <option value='price_asc'>Price Lowest to Highest</option>
                  <option value='price_desc'>Price Highest to Lowest</option>
                  <option value='product_name_asc'>Product Name A-Z</option>
                  <option value='product_name_desc'>Product Name Z-A</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='supplier' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>SUPPLIER</label>
                <select
                  id='supplier'
                  onChange={handleDateFilter}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                >
                  <option value=''>All Supplier</option>
                  <option value='kins'>KINS</option>
                  <option value='this_week'>This Week</option>
                  <option value='this_month'>This Month</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='stockAlert' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>STOCK ALERT</label>

                <div id='stockAlert' className='flex flex-col'>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='lowStock' id='lowStock' />
                    <span className='checkmark'></span>
                    <span className='label-text'>Low Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='nearLowStock' id='nearLowStock' />
                    <span className='checkmark'></span>
                    <span className='label-text'>Near Low Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='highStock' id='highStock' />
                    <span className='checkmark'></span>
                    <span className='label-text'>High Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='outOfStock' id='outOfStock' />
                    <span className='checkmark'></span>
                    <span className='label-text'>Out of Stock</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <button
                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide ${darkMode ? 'bg-light-TABLE text-dark-TEXT' : 'dark:bg-dark-TABLE text-light-TEXT'}`}
                onClick={handleResetFilters}
              >
                <GrPowerReset className='mr-2' />
                <p>Reset Filters</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductList;
