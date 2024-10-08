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

const BarChart2 = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme(); // Access darkMode from AdminThemeContext
  const baseURL = "http://localhost:5555";

  const allCategories = [
    'Components',
    'Peripherals',
    'Accessories',
    'PC Furniture',
    'OS & Software',
    'Laptops',
    'Desktops'
  ];

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const products = response.data.data;

      const categoryUnits = {};
      allCategories.forEach(category => {
        categoryUnits[category] = 0;
      });

      products.forEach(product => {
        const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;
        if (inStockUnits > 0 && categoryUnits[product.category] !== undefined) {
          categoryUnits[product.category] += inStockUnits;
        }
      });

      const labels = Object.keys(categoryUnits);
      const data = Object.values(categoryUnits);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Units',
            data,
            backgroundColor: darkMode ? '#007bff' : '#FFCE56', // Adjust color for dark mode
            borderColor: darkMode ? '#0056b3' : '#FF6384', // Adjust border color
            borderWidth: 1,
          },
        ],
      });

    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        min: 0,
        max: 50,
        ticks: {
          color: darkMode ? '#000' : '#fff', // Adjust tick color for dark mode
        },
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)', // Adjust grid line color
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#000' : '#fff', // Adjust tick color for dark mode
        },
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)', // Adjust grid line color
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart2;
