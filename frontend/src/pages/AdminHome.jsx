import React, { useState, useEffect } from 'react';
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
import { GiWallet } from "react-icons/gi";
import { HiMiniWallet } from "react-icons/hi2";
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

// Sample transaction data
const sampleTransactions = [
  {
    _id: '1',
    transaction_id: 'SO-021',
    transaction_date: '2024-08-01T00:00:00Z',
    customer: { name: 'John Doe' },
    total_price: 500.00,
    products: [
      { product: { name: 'NVIDIA GeForce RTX 3060 Ti' }, quantity: 2 },
      { product: { name: 'NVIDIA GeForce RTX 3060 Ti' }, quantity: 1 }
    ]
  },
  {
    _id: '2',
    transaction_id: 'SO-022',
    transaction_date: '2024-08-02T00:00:00Z',
    customer: { name: 'Jane Smith' },
    total_price: 300.00,
    products: [
      { product: { name: 'NVIDIA GeForce RTX 3060 Ti' }, quantity: 3 }
    ]
  },
  {
    _id: '3',
    transaction_id: 'SO-023',
    transaction_date: '2024-08-02T00:00:00Z',
    customer: { name: 'Jane Smith' },
    total_price: 6900.00,
    products: [
      { product: { name: 'NVIDIA GeForce RTX 3060 Ti' }, quantity: 3 }
    ]
  }
];

const AdminHome = () => { 
  const { darkMode } = useAdminTheme();
  const baseURL = 'http://localhost:5555';
  const { user } = useAuthContext();
  const [topProducts, setTopProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);



  

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
    'HIGH STOCK': '#28a745', // Green
    'NEAR LOW STOCK': '#fd7e14', // Orange
    'LOW STOCK': '#ffc107', // Yellow
    'OUT OF STOCK': '#dc3545' // Red
  };
  

  // Sample items
  /*const items = [
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'high', stock: 30 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'low', stock: 10 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'nearLow', stock: 5 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'high', stock: 28 },
    { name: 'NVIDIA GeForce RTX 3060 Ti', status: 'outOfStock', stock: 0 }
  ];*/

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle transaction click
  const handleTransactionClick = (transactionId) => {
    // Implement your click handling logic here
    console.log('Transaction clicked:', transactionId);
  };

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        // Add sorting query parameters to the request
        const response = await axios.get(`${baseURL}/product`, {
          params: {
            sortBy: 'sales',  // Sort by sales
            sortOrder: 'desc'  // Descending order
          },
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }

        const result = response.data;

        // Filter out products with sales equal to 0 and slice to get only the top 5 products
        const top5Products = result.data
          .filter(product => product.sales > 0) // Exclude products with zero sales
          .slice(0, 5);

        setTopProducts(top5Products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, [baseURL, user.token]);
  

  if (loading) return <p>Loading...</p>;

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
            className={`text-2xl border px-2 py-2 rounded-lg ${darkMode ? 'text-light-ACCENT border-light-ACCENT' : 'text-dark-ACCENT border-dark-ACCENT'}`}
          >
            <GrRefresh />
          </button>
        </div>

        {/* Main Content */}
        <div className='flex gap-2 w-full h-[30%] py-2'>
          
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
            {topProducts.map((item, index) => {
              // Get the color based on the stock status
              const statusColor = stockColors[item.current_stock_status] || '#000000'; // Default to black if status is not found

              return (
                <div
                  key={index}
                  className={`flex items-center justify-start w-full h-[70px] px-2 py-4 gap-4 ${darkMode ? 'bg-light-CARD1 border-light-ACCENT' : 'bg-dark-CARD1 border-dark-ACCENT'} rounded-md border-b-2`}
                >
                  <img src={`${baseURL}/images/${item.image.substring(14)}`} className='w-14 h-14 object-cover rounded-lg' alt={item.name} />
                  <div className='flex flex-col w-[80%]'>
                    <p className={`text-sm ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.name}</p>
                    <div className='flex items-center gap-2 text-sm'>
                      <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.category}</p>
                      <FaCircle className={`text-[0.65rem] ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`} />
                      <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.quantity_in_stock} in stock</p>
                      <FaCircle className={`text-[0.65rem] ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`} />
                      <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`} style={{ color: statusColor }}>
                        {item.current_stock_status}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col items-center justify-center w-[10%]'>
                    <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>{item.sales}</p>
                    <p className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>Sales</p>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className='flex gap-2 w-full h-[20%] py-2'>
          <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[35%] rounded-lg py-4 flex flex-col relative px-4`}>
            <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-ACCENT bg-light-CARD1' : 'text-dark-ACCENT bg-dark-CARD1'}`}>
              <AiFillProduct className='text-2xl'/>
              <div className={`absolute left-0 top-4 h-10 w-2 ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'} rounded-md`}></div>
            </div>
            <div className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
              <p className='text-sm py-3'>TOTAL PRODUCT INVENTORY</p>
              <p className='text-4xl'>350</p> 
            </div>
          </div>

          {/* Dropdown Component 1 */}
          <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[35%] rounded-lg py-4 flex flex-col gap-2`}>
            <div className='flex items-center justify-between relative w-full px-4'>
              <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-ACCENT bg-light-CARD1' : 'text-dark-ACCENT bg-dark-CARD1'}`}>
                <GiWallet className='text-2xl' />
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
          <div className={`${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[35%] rounded-lg py-4 flex flex-col gap-2`}>
            <div className='flex items-center justify-between relative w-full px-4'>
              <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode ? 'text-light-ACCENT bg-light-CARD1' : 'text-dark-ACCENT bg-dark-CARD1'}`}>
                <HiMiniWallet className='text-2xl' />
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

        {/* Transaction Log Section */}
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
            <div className='w-full h-[82%] flex flex-col gap-3'>
              <div className='h-[420px] overflow-y-auto px-4 flex flex-col gap-4'>
                <div className={`w-full h-[100%] flex flex-col gap-4 overflow-y-auto scrollbar-custom ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'}`}>
                  {sampleTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className={`rounded-lg p-4 flex gap-4 cursor-pointer w-full ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1'}`}
                      onClick={() => handleTransactionClick(transaction.transaction_id)}
                    >

                      <div className='flex justify-between items-center gap-2 w-full h-[100px]'>
                        <div className='p-4 w-[70%] flex flex-col gap-2'>
                        <h1 className={`text-2xl ${darkMode ? 'text-light-ACCENT' : 'dark:text-dark-ACCENT'}`}>{transaction.transaction_id}</h1>

                          {transaction.products.map((item, idx) => (
                            <p key={idx} className={`text-sm ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
                              ({item.quantity}) {item.product.name}
                            </p>
                          ))}
                        </div>
                        <div className={`flex gap-6 w-[50%] justify-between ${darkMode ? 'text-light-TABLE' : 'dark:text-dark-TABLE'}`}>
                          <div className='flex flex-col gap-1'> 
                            <p className={`text-xs ${darkMode ? 'text-light-PRIMARY' : 'dark:text-dark-PRIMARY'}`}>DATE</p>
                            <p className={`text-xs ${darkMode ? 'text-light-PRIMARY' : 'dark:text-dark-PRIMARY'}`}>CUSTOMER</p>
                            <p className={`text-xs ${darkMode ? 'text-light-PRIMARY' : 'dark:text-dark-PRIMARY'}`}>TOTAL AMOUNT</p>
                          </div>
                          <div className={`flex flex-col gap-1 ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>
                            <p className='text-sm ml-auto'>{formatDate(transaction.transaction_date)}</p>
                            <p className='text-sm ml-auto'>{transaction.customer ? transaction.customer.name.toUpperCase() : 'None'}</p>
                            <p className='text-sm ml-auto'>₱ {transaction.total_price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
          <div className={`px-4 py-6 flex flex-col items-center justify-center ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'} w-[50%] rounded-lg`}>
            <p className={`text-2xl ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Net Sales vs Gross Sales</p>
            <BarChartComponent className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
