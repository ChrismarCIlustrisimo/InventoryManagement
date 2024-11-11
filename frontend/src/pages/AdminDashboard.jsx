import axios from 'axios';
import React, { useState, useEffect } from "react";
import AdminNavbar from '../components/AdminNavbar';
import { useAdminTheme } from "../context/AdminThemeContext";
import StatsCard from "../components/StatsCard";
import { useAuthContext } from '../hooks/useAuthContext';
import BarChart1 from '../charts/BarChart1';
import TopSellingItems from '../charts/TopSellingItems';
import LowStockItems from '../charts/LowStockItems';
import PendingRMARequests from '../charts/PendingRMARequests';
import LineChart from '../charts/LineChart';
import DateRangeModal from '../components/DateRangeModal';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useStockAlerts } from '../context/StockAlertsContext';
import { useDateFilter } from '../context/DateFilterContext';

const AdminDashboard = () => {
  const { darkMode } = useAdminTheme();
  const { user } = useAuthContext();
  const baseURL = "http://localhost:5555";
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 Days');
  const [transactionCount, setTransactionCount] = useState([]);
  const [totalPaidPrice, setTotalPaidPrice] = useState(0);
  const [changeSalesPercent, setChangeSalesPercent] = useState(0);  
  const [changeProductPercent, setChangeProductPercent] = useState(0);  
  const [transactionChangePercent, setTransactionChangePercent] = useState(0);
  const [itemsLowStock, setIitemsLowStock] = useState(0);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);
  const [rmaRequests, setRmaRequests] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [currentMonthCount, setCurrentMonthCount] = useState(0); // State for current month count
  const navigate = useNavigate();
  const { stockAlerts, setStockAlerts } = useStockAlerts();
  const { dateFilter, handleDateFilterChange } = useDateFilter(); // Access context values


  const fetchRMARequests = async () => {
    try {
      const response = await axios.get(`${baseURL}/rma`);
      setRmaRequests(response.data);
    } catch (err) {
      console.error("Error fetching RMA data:", err);
    }
  };
  

  const fetchRefunds = async () => {
    try {
      const response = await axios.get('http://localhost:5555/refund', {
        headers: {
          'Authorization': `Bearer ${user.token}`, // Include authorization token if needed
        },
      });
      
      setRefunds(response.data); // Store all refunds
      
      // Calculate counts
      const currentCount = countRefundsForMonth(response.data, new Date());
      
      setCurrentMonthCount(currentCount);
      
    } catch (error) {
      console.error('Error fetching refunds:', error);
    }
  };

  const countRefundsForMonth = (refunds, date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the month
    return refunds.filter(refund => {
      const createdAt = new Date(refund.createdAt); // Convert createdAt to Date
      return createdAt >= startOfMonth && createdAt <= endOfMonth;
    }).length;
  };

  const calculatePercentageChange = () => {
    if (transactionCount === 0) return 0;  // Avoid division by zero
    return (currentMonthCount / transactionCount) * 100;
  };

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
      const lowStockProduct = products.filter(product => 
        (product.current_stock_status === 'LOW')
      );

      setIitemsLowStock(lowStockProduct.length);
  
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

      // Filter products that have low stock status and at least one unit in stock
      const filteredProducts = products.filter(product => 
        product.current_stock_status === 'LOW' &&
        product.units.some(unit => unit.status === 'in_stock')
      );

      // Slice the filtered products to get a maximum of 5
      const limitedProducts = filteredProducts.slice(0, 5);

      const sortedProducts = products.sort((a, b) => b.sales - a.sales).slice(0, 5);

      setTopSellingItems(sortedProducts);
      setLowStockItems(limitedProducts);
  
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
      const response = await axios.get(`${baseURL}/transaction`, {
        params: {
          payment_status: 'paid',
        },
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
  
      const transactions = response.data?.data || [];
  
      // Filter transactions for valid statuses and paid transactions
      const validTransactions = transactions.filter(transaction => 
        ['Completed', 'RMA', 'Replaced'].includes(transaction?.status) &&
        transaction?.payment_status === 'paid'
      );
  
      // Calculate initial total sales from valid transactions for the current month
      let totalSales = validTransactions.reduce((total, transaction) => total + (transaction?.total_price || 0), 0);
  
      // Calculate additional sales from refunded transactions with sold units
      const refundedTransactions = transactions.filter(transaction => transaction?.status === 'Refunded');
  
      refundedTransactions.forEach(transaction => {
        if (transaction?.products) {
          transaction.products.forEach(product => {
            if (product?.units) {
              const soldUnits = product.units.filter(unit => unit?.status === 'sold');
              if (soldUnits.length > 0) {
                const additionalSales = (product?.selling_price || 0) * 0.12;
                totalSales += additionalSales;
              }
            }
          });
        }
      });
  
      // Get the current month and year
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
  
      // Filter transactions for the current month
      const currentMonthTransactions = validTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      });
  
      const currentMonthTransactionCount = currentMonthTransactions.length;
      setTransactionCount(currentMonthTransactionCount);
  
      // Calculate total sales for the current month
      const currentMonthSales = currentMonthTransactions.reduce((total, transaction) => total + (transaction?.total_price || 0), 0);
      setTotalPaidPrice(currentMonthSales);
  
      // Get the previous month transactions
      const previousMonth = new Date(now.setMonth(now.getMonth() - 1));
      const previousMonthTransactions = validTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return transactionDate.getMonth() === previousMonth.getMonth() && transactionDate.getFullYear() === previousMonth.getFullYear();
      });
  
      const lastMonthSales = previousMonthTransactions.reduce((total, transaction) => total + (transaction?.total_price || 0), 0);
      const changePercent = lastMonthSales === 0 ? 100 : ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
      setChangeSalesPercent(parseFloat(changePercent.toFixed(2)));
  
      const transactionChangePercent = previousMonthTransactions.length === 0 ? 100 : ((currentMonthTransactionCount - previousMonthTransactions.length) / previousMonthTransactions.length) * 100;
      setTransactionChangePercent(parseFloat(transactionChangePercent.toFixed(2)));
  
    } catch (error) {
      console.error('Error fetching sales orders:', error);
    }
  };
  

  
  
  useEffect(() => {
    if (user && user.token) {
      fetchProducts();
      fetchSalesOrders();
      fetchRefunds();
      fetchRMARequests();
    }
  }, [user, location.pathname]);


  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedTimeframe(value);

    // Open modal for custom range selection
    if (value === 'Custom Range') {
      setIsModalOpen(true);
    }
  };

  const handleDateRangeConfirm = (startDate, endDate) => {
    setCustomStart(startDate);
    setCustomEnd(endDate);
  };
  const percentageChange = calculatePercentageChange();

  const handleGoSalesReport = () => {
    navigate('/admin-sales-report');
  };

  const handleGoInventoryReport = () => {
    navigate('/InventoryReport');
  };

  const handleGoRMAReport = () => {
    navigate('/RMAReport');
  };

  const handleGoSales = () => {
    //handleDateFilterChange('This Month');
    navigate('/admin-transaction');
};

  const handleGoInventory = () => {
    setStockAlerts((prev) => ({ ...prev, LOW: true }));
    navigate('/admin-inventory');
  };




  return (
    <div className={`${darkMode ? "bg-light-bg" : "dark:bg-dark-bg"} h-auto flex gap-1 overflow-y-hidden`}>
      <AdminNavbar />
      <div className="w-[100vw] h-[170vh] px-6 pt-[100px] flex gap-4 flex-col border border-red-800">
        <div className='w-full h-[20%] max-h-[180px]  flex items-center gap-4'>

        <StatsCard
            title={'Monthly Total Sales'}
            value={totalPaidPrice.toLocaleString('en-US', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 })} // Format without decimal places
            changeType={changeSalesPercent >= 0 ? 'increase' : 'decrease'}  // Set the type based on percent change
            changePercent={Math.abs(changeSalesPercent)}  // Show the absolute value of the percent change
            bgColor={`bg-[#14AE5C]`}  // Additional custom styles
            percenText={'from last month'}
            width="w-[30%]"
            onClick={handleGoSalesReport}  // Pass the function here

        />
            <StatsCard
                title={'Monthly Total Transactions'}
                value={transactionCount}
                changeType={transactionChangePercent >= 0 ? 'increase' : 'decrease'}
                changePercent={Math.abs(transactionChangePercent)}
                bgColor={`bg-[#E8B931]`}
                percenText={'from last month'}
                width="w-[25%]"
                onClick={handleGoSales}  // Pass the function here
            />


          <StatsCard
            title={'Low Stock Alert'}
            value={itemsLowStock}
            changeType={'increase'}
            bgColor={`${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}
            percenText={'from last month'}
            showPercent={false}
            warning={true}
            width="w-[22.5%]"
            onClick={handleGoInventory} // Calls the function on click
          />

        <StatsCard 
          title={'Refund / Return Rate'}
          value={percentageChange.toFixed(2)}
          bgColor={`bg-[#14AE5C]`}  // Additional custom styles
          percenText={'from last month'}
          showPercent={false}
          percent={Math.abs(percentageChange).toFixed(2)} // Display the absolute value for percent, fixed to 2 decimal places
          width="w-[22.5%]"
        />
        </div>
        <div className='w-full h-[80%] '>
          <div className='w-full h-full flex flex-col gap-4'>
              <div className='w-full h-[50%] flex gap-4 pb-4'>
                  <div className={`w-[60%] h-full px-12 py-6 border border-gray-200 rounded-lg shadow-lg  ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                    <div className="w-full h-[10%] flex items-center justify-between">
                      <h2 className="text-center text-lg font-semibold text-orange-600">Sales Overview</h2>
                      <select
                        value={selectedTimeframe}
                        onChange={handleDropdownChange}
                        className={`border-none outline-none bg-transparent ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`}
                      >
                        <option value="Last 7 Days" disabled={selectedTimeframe === 'Last 7 Days'}>Last 7 Days</option>
                        <option value="Last 30 Days" disabled={selectedTimeframe === 'Last 30 Days'}>Last 30 Days</option>
                        <option value="Last 3 Months" disabled={selectedTimeframe === 'Last 3 Months'}>Last 3 Months</option>
                        <option value="Last 6 Months" disabled={selectedTimeframe === 'Last 6 Months'}>Last 6 Months</option>
                        <option value="This Year" disabled={selectedTimeframe === 'This Year'}>This Year</option>
                        <option value="Custom Range" disabled={selectedTimeframe === 'Custom Range'}>Custom Range</option>
                      </select>

                        <DateRangeModal
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onConfirm={handleDateRangeConfirm}
                        />


                     </div>
                     <div className="w-full h-[90%]">
                      <LineChart 
                        selectedTimeframe={selectedTimeframe} 
                        customStart={customStart}
                        customEnd={customEnd}
                      />
                    </div>
                  </div>

                    <div className={`w-[40%] h-full px-12 py-6 border border-gray-200 rounded-lg shadow-lg  ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                        <div className="w-full h-[10%] flex items-center justify-between">
                          <h2 className="text-center text-lg font-semibold text-orange-600">Sales Overview</h2>
                        </div>
                        <div className="w-full h-[90%]">
                          <BarChart1 />
                        </div>
                    </div>

          
              </div>

              <div className='w-full h-[50%] flex gap-4'>
                <TopSellingItems topSellingItems={topSellingItems} />
                <LowStockItems lowStockItems={lowStockItems} />
                <PendingRMARequests rmaRequests={rmaRequests} />
              </div>
              <ToastContainer />

            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
