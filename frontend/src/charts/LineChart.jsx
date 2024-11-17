import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useAuthContext } from '../hooks/useAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'; 
import axios from 'axios';
import { API_DOMAIN } from '../utils/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ selectedTimeframe, customStart, customEnd }) => {
  const [salesData, setSalesData] = useState([]);
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const baseURL = API_DOMAIN;

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const fetchSalesOrders = async () => {
    try {
      let endDate = new Date();
      let startDate = new Date();
  
      // Adjust date range based on selected timeframe or custom dates
      switch (selectedTimeframe) {
        case 'Last 7 Days':
          startDate.setDate(endDate.getDate() - 6); // Adjust to last 7 days
          break;
        case 'Last 30 Days':
          startDate.setDate(endDate.getDate() - 30); // Adjust to last 30 days
          break;
        case 'Last 3 Months':
          startDate.setMonth(endDate.getMonth() - 2); // Go back 3 months
          break;
        case 'Last 6 Months':
          startDate.setMonth(endDate.getMonth() - 5); // Go back 6 months
          break;
        case 'This Year':
          startDate.setMonth(0, 1); // Start from January 1st of the current year
          break;
        case 'Custom Range':
          if (customStart && customEnd) {
            startDate = new Date(customStart);
            endDate = new Date(customEnd);
          }
          break;
        default:
          break;
      }
  
      const response = await axios.get(`${API_DOMAIN}/transaction`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
  
      const transactions = response.data.data;
  
      // Filter for Completed, RMA, and Replaced transactions
      const validTransactions = transactions.filter(transaction =>
        ['Completed', 'RMA', 'Replaced'].includes(transaction.status) &&
        transaction.payment_status === 'paid'
      );
  
      // Group data for the chart
      const groupedData = validTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.createdAt);
        let label;
        
        // Format label based on selected timeframe
        if (selectedTimeframe === 'Last 7 Days' || selectedTimeframe === 'Last 30 Days') {
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else {
          label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
  
        if (!acc[label]) {
          acc[label] = 0;
        }
        acc[label] += transaction.total_price;
        return acc;
      }, {});
  
      const dateLabels = [];
      const formattedData = [];
      let currentDate = new Date(startDate);
  
      while (currentDate <= endDate) {
        let dateString;
        
        if (selectedTimeframe === 'Last 7 Days' || selectedTimeframe === 'Last 30 Days') {
          dateString = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else {
          dateString = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
  
        dateLabels.push(dateString);
  
        const value = groupedData[dateString] || 0;
        formattedData.push({ date: dateString, value });
  
        if (selectedTimeframe === 'Last 7 Days' || selectedTimeframe === 'Last 30 Days') {
          currentDate.setDate(currentDate.getDate() + 1); // Increment by day
        } else {
          currentDate.setMonth(currentDate.getMonth() + 1); // Increment by month
        }
      }
  
      setSalesData(formattedData);
  
    } catch (error) {
      console.error('Error fetching sales orders:', error);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, [selectedTimeframe, customStart, customEnd]);

  const lineChartData = {
    labels: salesData.map(item => item.date),
    datasets: [
      {
        label: 'Sales Data',
        data: salesData.map(item => item.value),
        borderColor: '#E84C19',
        backgroundColor: 'rgba(232, 76, 25, 0.1)',
        fill: true,
        tension: 0,
        pointRadius: 5,
        pointBackgroundColor: '#E84C19',
        pointBorderColor: '#fff',
      },
    ],
  };

  const getMaxYValue = () => {
    // For "Last 7 Days" and "Last 30 Days", set max Y value to 400k
    if (selectedTimeframe === 'Last 7 Days' || selectedTimeframe === 'Last 30 Days') {
      return 400000;
    }

    // For other timeframes, calculate the max dynamically based on data
    const maxValue = Math.max(...salesData.map(item => item.value));
    return Math.max(maxValue, 800000); // Default to 800k if the max value is lower than 800k
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? '#fff' : '#333',
        titleColor: darkMode ? '#000' : '#fff',
        bodyColor: darkMode ? '#000' : '#fff',
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#000' : '#fff',
        },
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#000' : '#fff',
          callback: (value) => `₱ ${value / 1000}K`,
        },
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
        beginAtZero: true,
        min: 0,
        max: getMaxYValue(), // Dynamically set max value
      },
    },
  };

  return <Line data={lineChartData} options={chartOptions} />;
};

export default LineChart;

