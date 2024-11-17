import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios'; // Ensure axios is imported
import { useAuthContext } from '../hooks/useAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { API_DOMAIN } from '../utils/constants';
// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart1 = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme(); // Access darkMode from AdminThemeContext
  const baseURL = API_DOMAIN;

  // Fetch products and prepare chart data
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const products = response.data.data;

      // Filter products with low stock and at least one unit in stock
      const lowStockProducts = products.filter(product => {
        const inStockUnits = product.units.filter(unit => unit.status === 'in_stock');
        return inStockUnits.length > 0 && inStockUnits.length <= product.low_stock_threshold;
      });

      const labels = lowStockProducts.map(product => product.name);
      const data = lowStockProducts.map(product => 
        product.units.filter(unit => unit.status === 'in_stock').length
      );

      // Update chart data state
      setChartData({
        labels,
        datasets: [
          {
            label: 'Units',
            data,
            backgroundColor: '#E84C19', // Adjust color for dark mode
            borderColor: '#E84C19', // Adjust border color
            borderWidth: 1,
          },
        ],
      });

    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  // Configuration options
  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)', // Adjust tooltip background
        titleColor: darkMode ? '#000' : '#fff',
        bodyColor: darkMode ? '#000' : '#fff',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 8,
        ticks: {
          color: darkMode ? '#000' : '#fff', // Adjust tick color for dark mode
          stepSize: 1,
        },
        
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)', // Adjust grid line color
        },
        
      },
      y: {
        type: 'category',
        labels: chartData.labels, // Use dynamic labels from state
        ticks: {
          color: darkMode ? '#000' : '#fff', // Adjust tick color for dark mode
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart1;
