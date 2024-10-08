import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext'; // Import the theme context
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart3 = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme(); // Access darkMode from AdminThemeContext
  const baseURL = "http://localhost:5555";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      const products = response.data.data;

      // Ensure products is an array before mapping
      if (!Array.isArray(products)) {
        console.error('Expected products to be an array, but got:', products);
        return; // Exit if products is not an array
      }

      console.log(products);

      // Calculate total sales for each product and filter out products with 0 sales
      const productSales = products
        .map(product => ({
          name: product.name,
          sales: product.sales || 0, // Default to 0 if sales is undefined
        }))
        .filter(product => product.sales > 0); // Filter out products with 0 sales

      // Sort products by sales in descending order and take the top 5
      const topSellingProducts = productSales
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 8);

      // Prepare data for the chart
      const labels = topSellingProducts.map(product => product.name);
      const salesData = topSellingProducts.map(product => product.sales);

      // Update chart data state
      setData({
        labels,
        datasets: [
          {
            label: 'Units Sold',
            data: salesData,
            backgroundColor: darkMode ? '#4A90E2' : '#E84C19', // Adjust color based on dark mode
            borderColor: darkMode ? '#4A90E2' : '#E84C19', // Adjust color based on dark mode
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user.token]); // Add user.token as a dependency

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? '#fff' : 'rgba(0,0,0,0.7)', // Tooltip background in dark mode
        titleColor: darkMode ? '#000' : '#fff', // Tooltip title color in dark mode
        bodyColor: darkMode ? '#000' : '#fff',  // Tooltip body text color in dark mode
      },
    },
    scales: {
      x: {
        min: 0,
        max: data.datasets.length > 0 ? Math.max(...data.datasets[0].data) + 10 : 50,
        ticks: {
          color: darkMode ? '#000' : '#fff', // Adjust axis label color in dark mode
        },
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)', // Grid lines color in dark mode
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#000' : '#fff', // Adjust axis label color in dark mode
        },
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)', // Grid lines color in dark mode
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      {data.datasets.length === 0 ? (
        <p>No sales data available.</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default BarChart3;
