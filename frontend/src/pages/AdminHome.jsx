import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { useAdminTheme } from "../context/AdminThemeContext";
import { GrRefresh } from "react-icons/gr";
import PieChartComponent from "../charts/PieChartComponent";
import { GoTriangleRight } from "react-icons/go";
import { FaCircle } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import BarChartComponent from "../charts/BarChartComponent";
import { GiWallet } from "react-icons/gi";
import { HiMiniWallet } from "react-icons/hi2";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from 'react-router-dom';



const AdminHome = () => {
  const { darkMode } = useAdminTheme();
  const baseURL = "http://localhost:5555";
  const { user } = useAuthContext();
  const [topProducts, setTopProducts] = useState([]);
  const [grossSales, setGrossSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productCount, setproductCount] = useState([]);
  const [transactionLog, setTransactionLog] = useState([]);
  const [openDropdown1, setOpenDropdown1] = useState(false);
  const [selectedOption1, setSelectedOption1] = useState("Last Month");
  const [openDropdown2, setOpenDropdown2] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState("Last Month");
  const [totalBuyingPrice, setTotalBuyingPrice] = useState();
  const navigate = useNavigate();
  const [netSalesData, setNetSalesData] = useState([]);
  const [grossSalesData, setGrossSalesData] = useState([]);


  const getCurrentWeekDateRange = () => {
    const now = new Date(); // Current date and time
  
    // Calculate the start of the week (Monday)
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay() + 1); // Adjust to Monday
  
    // Calculate the end of the week (Sunday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Move to Sunday
  
    // Set time for start and end of the day
    start.setHours(0, 0, 0, 0); // Start of the day
    end.setHours(23, 59, 59, 999); // End of the day
    return { start, end };
  };
  

  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  // Stock color mapping
  const stockColors = {
    "HIGH STOCK": "#28a745", // Green
    "NEAR LOW STOCK": "#fd7e14", // Orange
    "LOW STOCK": "#ffc107", // Yellow
    "OUT OF STOCK": "#dc3545", // Red
  };


  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle transaction click
  const handleTransactionClick = (transactionId) => {
    // Implement your click handling logic here
    console.log("Transaction clicked:", transactionId);
  };

  const fetchTopSellingProducts = async () => {
    try {
      // Add sorting query parameters to the request
      const response = await axios.get(`${baseURL}/product`, {
        params: {
          sortBy: "sales", // Sort by sales
          sortOrder: "desc", // Descending order
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const result = response.data;
      setproductCount(result.count);

      // Filter out products with sales equal to 0 and slice to get only the top 5 products
      const top5Products = result.data
        .filter((product) => product.sales > 0) // Exclude products with zero sales
        .slice(0, 5).sort((a, b) => b.sales - a.sales);

      setTopProducts(top5Products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTopSellingProducts();
  }, [baseURL, user.token]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      const { start, end } = getCurrentWeekDateRange();
  
      try {
        const response = await axios.get(`${baseURL}/transaction`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
        });
  
        const result = response.data;
        console.log("Result:", result); // Inside fetchTopSellingProducts and fetchWeeklyData

        // Filter transactions with payment_status 'paid'
        const paidTransactions = result.data.filter(transaction => transaction.payment_status === 'paid');
  
        // Initialize sales data for each day of the week (0 for Monday, 1 for Tuesday, ..., 6 for Sunday)
        const netSalesByDay = Array(7).fill(0);
        const grossSalesByDay = Array(7).fill(0);
  
        // Function to get day index (0 for Monday, 6 for Sunday)
        const getDayIndex = (dateString) => {
          const date = new Date(dateString);
          const day = date.getDay();
          return (day === 0 ? 6 : day - 1); // Adjust Sunday to be the last day (index 6)
        };
  
        // Aggregate sales data
        paidTransactions.forEach(transaction => {
          const dayIndex = getDayIndex(transaction.transaction_date);
          netSalesByDay[dayIndex] += transaction.total_price - transaction.products.reduce((total, product) => total + (product.product.buying_price * product.quantity), 0);
          grossSalesByDay[dayIndex] += transaction.total_price;
        });
  
        console.log(paidTransactions);
        console.log(netSalesByDay);
        console.log(grossSalesByDay);

        // Set data for the bar chart
        setNetSalesData(netSalesByDay);
        setGrossSalesData(grossSalesByDay);
  
        // Other calculations remain the same
        const overallTotalBuyingPrice = paidTransactions.reduce((acc, transaction) => acc + transaction.products.reduce((total, product) => total + (product.product.buying_price * product.quantity), 0), 0);
        setTotalBuyingPrice(overallTotalBuyingPrice);
        setGrossSales(paidTransactions.reduce((acc, P) => acc + P.total_price, 0));
        setTransactionLog(paidTransactions.slice(0, 3));
  
      } catch (error) {
        console.error("Error fetching weekly data:", error);
      }
    };
  
    fetchWeeklyData();
  }, [user.token, baseURL]);
  

  const handleProductClick = (productId) => {
    navigate(`/update-product/${productId}`);
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div className={`${darkMode ? "bg-light-BG" : "dark:bg-dark-BG"} h-auto flex gap-1 overflow-y`}>
      <DashboardNavbar />
      <div className="h-[145vh] w-[100vw] pt-[70px] px-4 flex flex-col">
        {/* Header Section */}
        <div className="w-full h-auto flex justify-between items-center mt-2">
          <p className={`font-bold text-3xl ${darkMode ? "text-light-TEXT" : "dark:text-dark-TEXT"}`}>Dashboard</p>
          <button onClick={handleRefresh} className={`text-2xl border px-2 py-2 rounded-lg ${darkMode? "text-light-ACCENT border-light-ACCENT": "text-dark-ACCENT border-dark-ACCENT"}`}>
            <GrRefresh />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex gap-2 w-full h-[30%] py-2">
          {/* Pie Chart Section */}
          <div className={`${darkMode ? "bg-light-CARD text-light-TEXT" : "bg-dark-CARD text-dark-TEXT"} w-[60%] rounded-lg px-4 py-2`}>
            <p>Stock Level</p>
            <PieChartComponent />
          </div>

          {/* Top Selling Products Section */}
          <div className={`${ darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[40%] rounded-lg px-2`}>
            <div className="w-full h-[15%] flex items-center justify-between px-2">
              <p className={`text-2xl ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>Top 5 Selling Products</p>
            </div>
            <div className="w-full h-[82%] flex flex-col gap-3 overflow-y-auto">
              {topProducts.map((item, index) => {
                // Get the color based on the stock status
                const statusColor = stockColors[item.current_stock_status] || "#000000"; // Default to black if status is not found

                return (
                  <div onClick={() => handleProductClick(item._id)} key={index} className={`flex items-center justify-start w-full h-[70px] px-2 py-4 gap-4 ${ darkMode ? "bg-light-CARD1 border-light-ACCENT": "bg-dark-CARD1 border-dark-ACCENT"} rounded-md border-b-2`}>
                    <img src={`${baseURL}/images/${item.image.substring(14)}`}className="w-14 h-14 object-cover rounded-lg"alt={item.name}/>
                    <div className="flex flex-col w-[80%]">
                      <p className={`text-sm ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.name} </p>
                      <div className="flex items-center gap-2 text-sm">
                        <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.category}</p>
                        <FaCircle className={`text-[0.65rem] ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}/>
                        <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.quantity_in_stock} in stock</p>
                        <FaCircle className={`text-[0.65rem] ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}/>
                        <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}style={{ color: statusColor }}>{item.current_stock_status}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[10%]">
                      <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>{item.sales}
                      </p>
                      <p className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>Sales</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="flex gap-2 w-full h-[20%] py-2">
          <div className={`${darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[35%] rounded-lg py-4 flex flex-col relative px-4`}>
            <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode? "text-light-ACCENT bg-light-CARD1" : "text-dark-ACCENT bg-dark-CARD1"}`}>
              <AiFillProduct className="text-2xl" />
              <div className={`absolute left-0 top-4 h-10 w-2 ${darkMode ? "bg-light-ACCENT" : "bg-dark-ACCENT"} rounded-md`}></div>
            </div>
            <div
              className={`${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>
              <p className="text-lg py-3">TOTAL PRODUCT</p>
              <p className="text-4xl">{productCount}</p>
            </div>
          </div>

          {/* Dropdown Component 1 */}
          <div className={`${darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[35%] rounded-lg py-4 flex flex-col gap-2`}>
            <div className="flex items-center justify-between relative w-full px-4">
              <div
                className={`h-10 w-10 flex items-center justify-center rounded-full ${
                  darkMode ? "text-light-ACCENT bg-light-CARD1" : "text-dark-ACCENT bg-dark-CARD1"}`}>
                <GiWallet className="text-2xl" />
                <div className={`absolute left-0 top-0 h-10 w-2 ${darkMode ? "bg-light-ACCENT" : "bg-dark-ACCENT"} rounded-md`}></div>
              </div>


            </div>
            <div className={`px-4 ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>
              <p className="text-lg py-2">TOTAL NET SALES</p>
              <p className="text-4xl">₱ {Math.round(grossSales - totalBuyingPrice) || 0}</p>
            </div>
          </div>

          {/* Dropdown Component 2 */}
          <div className={`${darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[35%] rounded-lg py-4 flex flex-col gap-2`}>
            <div className="flex items-center justify-between relative w-full px-4">
              <div className={`h-10 w-10 flex items-center justify-center rounded-full ${darkMode? "text-light-ACCENT bg-light-CARD1": "text-dark-ACCENT bg-dark-CARD1"}`}>
                <HiMiniWallet className="text-2xl" />
                <div className={`absolute left-0 top-0 h-10 w-2 ${darkMode ? "bg-light-ACCENT" : "bg-dark-ACCENT"} rounded-md`}></div>
              </div>


            </div>
            <div className={`px-4 ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>
              <p className="text-sm py-2">TOTAL GROSS SALES</p>
              <p className="text-4xl">₱ {Math.round(grossSales)}</p>
              </div>
          </div>
        </div>

{/* Transaction Log Section */}
<div className="flex gap-2 w-full h-[45%] py-2">
  <div className={`${darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[50%] rounded-lg`}>
    <div className="w-full h-[15%] flex items-center justify-between p-4">
      <p className={`text-2xl font-semibold ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>
        Transaction Log
      </p>
    </div>
    <div className="w-full h-[82%] flex flex-col gap-3">
      <div className="h-[420px] overflow-y-auto px-4 flex flex-col gap-4">
        {transactionLog.length === 0 ? (
          <div className={`w-full h-full flex items-center justify-center ${darkMode ? "text-light-TEXT" : "text-dark-TEXT"}`}>
            <p className="text-2xl">No Transactions for this week</p>
          </div>
        ) : (
          <div className={`w-full h-[100%] flex flex-col gap-4 overflow-y-auto scrollbar-custom ${darkMode ? "bg-light-CARD" : "bg-dark-CARD"}`}>
            {transactionLog.map((transaction) => (
              <div key={transaction._id} className={`rounded-lg p-4 flex gap-4 cursor-pointer w-full ${darkMode ? "bg-light-CARD1" : "dark:bg-dark-CARD1"}`}
                   onClick={() => handleTransactionClick(transaction.transaction_id)}>
                <div className="flex justify-between items-center gap-2 w-full h-[100px]">
                  <div className="p-4 w-[70%] flex flex-col gap-2">
                    <h1 className={`text-2xl ${darkMode ? "text-light-ACCENT" : "dark:text-dark-ACCENT"}`}> {transaction.transaction_id}</h1>

                    {transaction.products.map((item, idx) => (
                      <p key={idx} className={`text-sm ${darkMode ? "text-light-TEXT" : "dark:text-dark-TEXT"}`}>
                        ({item.quantity}) {item.product.name}
                      </p>
                    ))}
                  </div>
                  <div
                    className={`flex gap-6 w-[50%] justify-between ${darkMode ? "text-light-TABLE" : "dark:text-dark-TABLE"}`}>
                    <div className="flex flex-col gap-1">
                      <p className={`text-xs ${darkMode ? "text-light-PRIMARY" : "dark:text-dark-PRIMARY"}`}>DATE</p>
                      <p className={`text-xs ${darkMode ? "text-light-PRIMARY" : "dark:text-dark-PRIMARY"}`}>CUSTOMER</p>
                      <p className={`text-xs ${darkMode ? "text-light-PRIMARY" : "dark:text-dark-PRIMARY"}`}>TOTAL AMOUNT</p>
                    </div>
                    <div className={`flex flex-col gap-1 ${darkMode ? "text-light-TEXT" : "dark:text-dark-TEXT"}`}>
                      <p className="text-sm ml-auto">{formatDate(transaction.transaction_date)}</p>
                      <p className="text-sm ml-auto">{transaction.customer ? transaction.customer.name.toUpperCase() : "None"}</p>
                      <p className="text-sm ml-auto"> ₱ {transaction.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  <div className={`px-4 py-2 flex flex-col items-center justify-center ${darkMode ? "bg-light-CARD" : "bg-dark-CARD"} w-[50%] rounded-lg`}>
    <p className={`text-2xl ${darkMode ? "text-light-TEXT" : "dark:text-dark-TEXT"}`}>Net Sales vs Gross Sales</p>
    <BarChartComponent netSalesData={netSalesData} grossSalesData={grossSalesData} />
  </div>
</div>

      </div>
    </div>
  );
};

export default AdminHome;
