import React, { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { GrRefresh } from "react-icons/gr";
import PieChartComponent from '../charts/PieChartComponent';
import { GoTriangleRight } from "react-icons/go";
import demoImage from '../assets/Demo.png';
import { FaCircle } from "react-icons/fa";
import { AiFillProduct } from 'react-icons/ai';
import { IoMdArrowDropdown } from 'react-icons/io';
import BarChartComponent from '../charts/BarChartComponent';

const AdminHome = () => { 
  const { darkMode } = useAdminTheme();

  // State for dropdowns
  const [openDropdown, setOpenDropdown] = useState(null); // null means no dropdown is open
  const [selectedOption, setSelectedOption] = useState('Last Month');

  // Function to toggle dropdown visibility
  const toggleDropdown = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId); // Close if same dropdown clicked
  };

  // Function to handle dropdown option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setOpenDropdown(null); // Close dropdown after selection
  };

  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  // Stock color mapping
  const stockColors = {
    high: '#28a745', // Green
    nearLow: '#fd7e14', // Orange
    low: '#ffc107', // Yellow
    outOfStock: '#dc3545' // Red
  };

  // Sample items
  const items = [
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'high', stock: 30 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'low', stock: 10 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'nearLow', stock: 5 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'high', stock: 28 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'outOfStock', stock: 0 }
  ];

  return (
    <div className={`${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG'} h-auto flex gap-1 overflow-y`}>
      <DashboardNavbar />
      <div className='h-[145vh] w-[100vw] pt-[70px] px-4 flex flex-col'>
        
        {/* Header Section */}
        <div className='w-full h-auto flex justify-between items-center mt-2'>
          <p className={`font-bold text-3xl ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
            Dashboard
          </p>
          <button
            onClick={handleRefresh}
            className={`${darkMode ? 'text-light-ACCENT border-light-ACCENT' : 'text-dark-ACCENT border-dark-ACCENT'} text-2xl border px-2 py-2 rounded-lg`}
          >
            <GrRefresh />
          </button>
        </div>

        {/* Main Content */}
        <div className='flex gap-2 w-full h-[35%] py-2'>
          
          {/* Pie Chart Section */}
          <div className={`${darkMode ? 'bg-light-CARD text-light-TEXT' : 'bg-dark-CARD text-dark-TEXT'} w-[60%] rounded-lg px-4 py-2`}>
            <p>Stock Level</p>
            <PieChartComponent />
          </div>

          {/* Top Selling Products Section */}
          <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[40%] rounded-lg px-2`}>
            <div className='w-full h-[15%] flex items-center justify-between px-2'>
              <p className={`text-xl ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                Top 5 Selling Products
              </p>
              <button className={`text-xs flex gap-1 items-center justify-center ${darkMode ? 'text-dark-ACCENT' : 'text-light-ACCENT'}`}>
                VIEW MORE <GoTriangleRight />
              </button>
            </div>
            <div className='w-full h-[82%] flex flex-col gap-3 overflow-y-auto'>
              {items.map((item, index) => {
                const statusColor = stockColors[item.status];
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-start w-full h-[70px] px-2 py-4 gap-4 ${darkMode ? 'bg-light-CARD1 border-light-ACCENT' : 'bg-dark-CARD1 border-dark-ACCENT'} rounded-md border-b-2`}
                  >
                    <img src={demoImage} className='w-14 h-14 object-cover rounded-lg' alt={item.name} />
                    <div className='flex flex-col gap-2'>
                      <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.name}</p>
                      <div className='flex items-center gap-2'>
                        <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>Component</p>
                        <FaCircle className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-[0.65rem]`} />
                        <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.stock} in stock</p>
                        <FaCircle className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-[0.65rem]`} />
                        <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`} style={{ color: statusColor }}>
                          {item.status === 'outOfStock' ? 'Out of stock' :
                           item.status === 'low' ? 'Low stock' :
                           item.status === 'nearLow' ? 'Near low stock' : 'High stock'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className='flex gap-2 w-full h-[20%] py-2'>
          <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[35%] rounded-lg  py-4 flex flex-col relative px-4`}>
            <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-ACCENT bg-light-CARD1' : 'text-dark-ACCENT bg-dark-CARD1'}`}>
              <AiFillProduct className='text-2xl'/>
              <div className={`absolute left-0 top-4 h-10 w-2 ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'} rounded-md`}></div>
            </div>
            <div className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
              <p className='text-sm py-2'>TOTAL PRODUCT INVENTORY</p>
              <p className='text-4xl'>350</p> 
            </div>
          </div>

          {/* Dropdown Component 1 */}
          <div className={`w-[35%] rounded-lg py-4 flex flex-col gap-2 ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'}`}>
            <div className='flex items-center justify-between relative w-full px-4'>
              <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-ACCENT bg-light-CARD1' : 'text-dark-ACCENT bg-dark-CARD1'}`}>
                <AiFillProduct className='text-2xl' />
                <div className={`absolute left-0 top-0 h-10 w-2 ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'} rounded-md`}></div>
              </div>

              {/* Dropdown Button */}
              <div className='relative'>
                <button 
                  onClick={() => toggleDropdown(1)} 
                  className={`flex items-center space-x-2 px-2 py-1 rounded-md ${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'} bg-transparent border border-transparent`}
                >
                  <span>{selectedOption}</span>
                  <IoMdArrowDropdown className={`text-lg ${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'}`} />
                </button>
                {/* Dropdown Menu */}
                {openDropdown === 1 && (
                  <div className={`absolute right-0 top-full mt-2 w-48 bg-${darkMode ? 'light-CARD' : 'dark-CARD'} border border-gray-300 rounded-md shadow-lg`}>
                    <ul>
                      <li 
                        className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => handleOptionSelect('Last Month')}
                      >
                        Last Month
                      </li>
                      <li 
                        className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => handleOptionSelect('This Month')}
                      >
                        This Month
                      </li>
                      <li 
                        className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => handleOptionSelect('Next Month')}
                      >
                        Next Month
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className={`px-4 ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
              <p className='text-sm py-2'>TOTAL NET SALES</p>
              <p className='text-4xl'>₱40,000</p> 
            </div>
          </div>

          {/* Dropdown Component 2 */}
          <div className={`w-[35%] rounded-lg py-4 flex flex-col gap-2 ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'}`}>
            <div className='flex items-center justify-between relative w-full px-4'>
              <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-ACCENT bg-light-CARD1' : 'text-dark-ACCENT bg-dark-CARD1'}`}>
                <AiFillProduct className='text-2xl' />
                <div className={`absolute left-0 top-0 h-10 w-2 ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'} rounded-md`}></div>
              </div>

              {/* Dropdown Button */}
              <div className='relative'>
                <button 
                  onClick={() => toggleDropdown(2)} 
                  className={`flex items-center space-x-2 px-2 py-1 rounded-md ${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'} bg-transparent border border-transparent`}
                >
                  <span>{selectedOption}</span>
                  <IoMdArrowDropdown className={`text-lg ${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'}`} />
                </button>
                {/* Dropdown Menu */}
                {openDropdown === 2 && (
                  <div className={`absolute right-0 top-full mt-2 w-48 bg-${darkMode ? 'light-CARD' : 'dark-CARD'} border border-gray-300 rounded-md shadow-lg`}>
                    <ul>
                      <li 
                        className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => handleOptionSelect('Last Month')}
                      >
                        Last Month
                      </li>
                      <li 
                        className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => handleOptionSelect('This Month')}
                      >
                        This Month
                      </li>
                      <li 
                        className='px-4 py-2 hover:bg-gray-200 cursor-pointer'
                        onClick={() => handleOptionSelect('Next Month')}
                      >
                        Next Month
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className={`px-4 ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
              <p className='text-sm py-2'>TOTAL GROSS SALES</p>
              <p className='text-4xl'>₱60,000</p> 
            </div>
          </div>
        </div>

        {/* Additional Placeholder Sections */}
        <div className='flex gap-2 w-full h-[45%] py-2'>

          <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[50%] rounded-lg`}>

            <div className='w-full h-[15%] flex items-center justify-between p-4'>
                <p className={`text-2xl font-semibold ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                  Transaction Log
                </p>
                <button className={`text-xs flex gap-1 items-center justify-center ${darkMode ? 'text-dark-ACCENT' : 'text-light-ACCENT'}`}>
                  VIEW MORE <GoTriangleRight />
                </button>
              </div>

              <div className='w-full h-[82%] flex flex-col gap-3 border border-red-800'>
                <div className='h-[360px] overflow-y-auto px-4 flex flex-col gap-4 border border-green-800'>
                  <div className={`w-full h-[110px] rounded-md ${darkMode ? 'bg-light-CARD1 border-light-ACCENT' : 'bg-dark-CARD1 border-dark-ACCENT'} border-4 border-blue-500`}></div>
                  <div className={`w-full h-[110px] rounded-md ${darkMode ? 'bg-light-CARD1 border-light-ACCENT' : 'bg-dark-CARD1 border-dark-ACCENT'} border-4 border-blue-500`}></div>
                  <div className={`w-full h-[110px] rounded-md ${darkMode ? 'bg-light-CARD1 border-light-ACCENT' : 'bg-dark-CARD1 border-dark-ACCENT'} border-4 border-blue-500`}></div>
                </div>
              </div>

            


          </div>
          <div className={`px-4 py-6 flex flex-col items-center jusitfy-center ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[50%] rounded-lg`}>
              <p className='text-2xl'>Net Sales vs Gross Sales</p>
              <BarChartComponent className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
