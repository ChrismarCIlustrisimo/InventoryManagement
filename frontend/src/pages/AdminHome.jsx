import axios from 'axios';
import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { useAdminTheme } from "../context/AdminThemeContext";
import StatsCard from "../components/StatsCard";
import { useAuthContext } from '../hooks/useAuthContext';
import { GoAlertFill } from "react-icons/go";
import BarChart1 from '../charts/BarChart1';
import BarChart2 from '../charts/BarChart2';
import BarChart3 from '../charts/BarChart3';

import LineChart from '../charts/LineChart';

const AdminHome = () => {
  const { darkMode } = useAdminTheme();
  const { user } = useAuthContext();
  const baseURL = "http://localhost:5555";
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 Days'); // Set default timeframe
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState();
  const [transactionCount, setTransactionCount] = useState([]);
  const [totalPaidPrice, setTotalPaidPrice] = useState(0);
  const [changeSalesPercent, setChangeSalesPercent] = useState(0);  // To store the percentage change
  const [changeProductPercent, setChangeProductPercent] = useState(0);  // To store the percentage change
  const [transactionChangePercent, setTransactionChangePercent] = useState(0);
  const [itemsLowStock, setIitemsLowStock] = useState(0);
  const [latestTransaction, setLatestTransaction] = useState([]);



  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
  
      const products = response.data.data;
      const totalCount = response.data.count;

      // Filter products where no unit is 'in_stock'
      const outOfStockProducts = products.filter(product => 
        product.units.every(unit => unit.status !== 'in_stock')
      );

      setIitemsLowStock(outOfStockProducts.length);
  
      // Get current month and year
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
  
      // Initialize counter for this month
      let currentMonthCount = 0;
  
      // Filter products and count this month's products
      products.forEach(product => {
        const createdAtDate = new Date(product.createdAt);
        if (createdAtDate.getFullYear() === currentYear && createdAtDate.getMonth() === currentMonth) {
          currentMonthCount++;
        }
      });

  
      // Update stock status and calculate updated products
        const updatedProducts = products.map(product => {
        const availableUnits = product.units.filter(unit => unit.status === 'in_stock').length;
      
        const lowStockThreshold = product.low_stock_threshold || 0; // Use product-specific thresholds
  
        let stockStatus = 'HIGH';
        if (availableUnits === 0) {
          stockStatus = 'OUT OF STOCK';
        } else if (availableUnits <= lowStockThreshold) {
          stockStatus = 'LOW';
        }
  
        return {
          ...product,
          current_stock_status: stockStatus,
        };
      });
  
      setProducts(updatedProducts);
      setProductCount(totalCount);
      
  
      // Calculate the remaining products after subtracting this month's count
      const remainingProductsCount = totalCount - currentMonthCount;
  
      // Calculate percentage increase of this month's products relative to the total count
      let increase = 0;
      if (totalCount > 0) {
        increase = (currentMonthCount / totalCount) * 100; // Percentage of products created this month relative to total
      }
      setChangeProductPercent(increase);
  
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };
  


  const fetchSalesOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5555/transaction', {
        params: {
          payment_status: 'paid',
        },
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
  
      const transactions = response.data.data;
      const transactionsCount = response.data.count;

      
      setLatestTransaction(transactions.slice(0, 10));
  
      // Filter transactions by the current and previous months
      const now = new Date();
      const currentMonth = now.getMonth();
      const previousMonth = new Date(now.setMonth(now.getMonth() - 1));

  
      const currentMonthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate.getMonth() === currentMonth;
      });
  
      const lastMonthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate.getMonth() === previousMonth.getMonth();
      });
  
      // Calculate gross sales for each month
      const currentMonthSales = currentMonthTransactions.reduce((total, transaction) => total + transaction.total_price, 0);
      const lastMonthSales = lastMonthTransactions.reduce((total, transaction) => total + transaction.total_price, 0);
  
      // Calculate percent change
      const changePercent = lastMonthSales === 0 
        ? 100  // Avoid division by zero if last month had no sales
        : ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
  
      // Format the changePercent to two decimal places
      const formattedChangePercent = parseFloat(changePercent.toFixed(2)); 
      // Calculate net sales (same as before)
      const totalCostOfSoldProducts = currentMonthTransactions.reduce((total, transaction) => {
        return total + transaction.products.reduce((sum, product) => sum + (product.product.buying_price * product.quantity), 0);
      }, 0);

      const netSales = currentMonthSales - totalCostOfSoldProducts;
      // Corrected line
      const changeCountPercent = lastMonthSales === 0 
        ? 100 
        : ((lastMonthTransactions.length - currentMonthTransactions.length) / lastMonthTransactions.length) * 100;

      // Update state with calculated values
      setTotalPaidPrice(netSales);
      setTransactionCount(transactionsCount);
      setChangeSalesPercent(formattedChangePercent);
      setTransactionChangePercent(changeCountPercent)
    } catch (error) {
      console.error('Error fetching sales orders:', error);
    }
  };
  
  
  
  
  useEffect(() => {
    if (user && user.token) {
      fetchProducts();
      fetchSalesOrders();
    }
  }, [user, location.pathname]);



  const handleDropdownChange = (event) => {
    setSelectedTimeframe(event.target.value); // Update selected timeframe
  };

    const formatPrice = (price) => {
      if (price >= 1000) {
        return (price / 1000).toFixed(1) + 'k';
      }
      return price.toString();
    };
    

  return (
    <div className={`${darkMode ? "bg-light-bg" : "dark:bg-dark-bg"} h-auto flex gap-1 overflow-y-hidden`}>
      <DashboardNavbar />
      <div className="w-full h-min-full p-6 pt-[100px] flex gap-4">
        <div className="flex flex-col items-center justify-between w-[60%] h-full gap-4">
          <div className="h-[15%] flex items-center justify-center gap-4">
                <StatsCard
                  title={'Total Product'}
                  value={productCount}
                  changeType={changeProductPercent >= 0 ? 'increase' : 'decrease'}
                  changePercent={changeProductPercent.toFixed(2)} // Displaying 2 decimal places
                  className={`${darkMode ? 'bg-light-primary' : 'bg-dark-primary'} text-white shadow-lg`}
                  percenText={'from this month'}
                />
                <StatsCard
                  title={'Total Sales'}
                  value={formatPrice(totalPaidPrice)}  // Format the totalPaidPrice before displaying it
                  changeType={changeSalesPercent >= 0 ? 'increase' : 'decrease'}  // Set the type based on percent change
                  changePercent={Math.abs(changeSalesPercent.toFixed(2))}  // Show the absolute value of the percent change
                  className={`bg-[#14AE5C] text-white shadow-lg`}  // Additional custom styles
                  percenText={'from last month'}
                />

                <StatsCard
                  title={'Total Transactions'}
                  value={transactionCount}
                  changeType={'increase'}
                  changePercent={Math.abs(transactionChangePercent.toFixed(2))}
                  className={`bg-[#FF9500] text-white shadow-lg`} // Additional custom styles
                  percenText={'from last month'}
                />

          </div>

          <div className="w-full h-[40%]">
           <div className={`w-full h-full px-12 py-6 border border-gray-200 rounded-lg shadow-sm  ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
              <div className="w-full h-[10%] flex items-center justify-between">
                 <h2 className="text-center text-lg font-semibold text-orange-600">Sales Overview</h2>
                 <select
                    value={selectedTimeframe}
                    onChange={handleDropdownChange}
                    className="border border-black text-black rounded-md p-2"
                  >
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Last 3 Months">Last 3 Months</option>
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="This Year">This Year</option>
                    <option value="Custom Range">Custom Range</option>
                  </select>
              </div>
              <div className="w-full h-[90%]">
                <LineChart selectedTimeframe={selectedTimeframe} />
              </div>
            </div>
          </div>

          <div className="w-full h-[40%]">
            <div className={`w-full h-full border px-4 py-4 border-gray-200 rounded-lg shadow-sm  ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
              <h2 className="text-left text-lg font-semibold text-orange-600 mb-4">Transaction Overview</h2>
              
              {/* Set a fixed height and apply overflow */}
              <div className="overflow-y-auto h-[420px]"> 
                <table className="min-w-full bg-white border border-gray-200 shadow rounded text-black">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-xs font-semibold text-black uppercase tracking-wider">
                        <th className="px-6 py-3 sticky top-0 bg-gray-50 z-10">Transaction ID</th>
                        <th className="px-6 py-3 sticky top-0 bg-gray-50 z-10">Customer Name</th>
                        <th className="px-6 py-3 sticky top-0 bg-gray-50 z-10">Total Amount</th>
                        <th className="px-6 py-3 sticky top-0 bg-gray-50 z-10">Date and Time</th>
                      </tr>
                    </thead>
                  <tbody>
                    {latestTransaction.map((transaction, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-6 py-4">{transaction.transaction_id}</td>
                        <td className="px-6 py-4">{transaction.customer?.name || 'None'}</td>
                        <td className="px-6 py-4">{transaction.total_price}</td>
                        <td className="px-6 py-4">
                            {(() => {
                              const date = new Date(transaction.createdAt);
                              const day = String(date.getDate()).padStart(2, '0');
                              const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                              const year = date.getFullYear();
                              const hours = String(date.getHours()).padStart(2, '0');
                              const minutes = String(date.getMinutes()).padStart(2, '0');

                              return `${day}-${month}-${year} ${hours}:${minutes}`;
                            })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right-side content */}
        <div className="w-[40%] h-full flex flex-col gap-4 ">
          <div className="w-full h-[100px] flex items-center justify-start px-4 text-red-800 rounded-lg border-2 border-red-800 bg-[#F9DEDC]">
            <GoAlertFill size={40} className="mr-4" />
            <p className="text-5xl mr-4">{itemsLowStock || 0}</p>
            <p className="text-xl">items need restocking</p>
          </div>
          <div className="w-full flex flex-col gap-4">
          <div className={`border border-gray-200 rounded-lg shadow-sm ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
          <div className='w-full border-b border-gray-200 px-4 py-2 flex items-center justify-start'>
                <h2 className="text-orange-600 font-semibold text-lg">Low Stock Items</h2>
              </div>

              {/* BarChart for Low Stock Products */}
              <div className={`p-4 w-full flex items-center justify-center ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                  <BarChart1 />
              </div>
            </div>

            {/* Duplicate BarChart for Low Stock Products */}
            <div className={`border border-gray-200 rounded-lg shadow-sm ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
              <div className='w-full border-b border-gray-200 px-4 py-2 flex items-center justify-start'>
                <h2 className="text-orange-600 font-semibold text-lg">Stock by Category</h2>
              </div>
              <div className={`p-4 w-full flex items-center justify-center ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                 <BarChart2 />
              </div>
            </div>
            <div className={`border border-gray-200 rounded-lg shadow-sm ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
              <div className='w-full border-b border-gray-200 px-4 py-2 flex items-center justify-start'>
                <h2 className="text-orange-600 font-semibold text-lg">Top selling items</h2>
              </div>
              <div className={`p-4 w-full flex items-center justify-center ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                 <BarChart3 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
