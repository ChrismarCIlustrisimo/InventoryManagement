import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
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

const categories = [
  { name: "Components" },
  { name: "Peripherals" },
  { name: "Accessories" },
  { name: "PC Furniture" },
  { name: "OS & Software" },
  { name: "Laptops" },
  { name: "Desktops" }
];

const categoryColors = {
  "Components": "#007BFF",
  "Peripherals": "#28A745",
  "Accessories": "#FFC107",
  "PC Furniture": "#17A2B8",
  "OS & Software": "#DC3545",
  "Laptops": "#6F42C1",
  "Desktops": "#6C757D",
};

const BarChart1 = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme(); 
  const baseURL = API_DOMAIN;

  const fetchProducts = async () => {
    try {
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        params: {
          startDate: startOfMonth,
          endDate: endOfMonth
        }
      });

      const products = response.data.data;

      const salesByCategory = categories.reduce((acc, category) => {
        acc[category.name] = 0;
        return acc;
      }, {});

      products.forEach(product => {
        salesByCategory[product.category] += product.sales;
      });

      const labels = categories.map(category => category.name);
      const data = labels.map(label => salesByCategory[label] || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Sales',
            data,
            backgroundColor: labels.map(label => categoryColors[label] || '#E84C19'),
            borderColor: labels.map(label => categoryColors[label] || '#E84C19'),
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
        titleColor: darkMode ? '#000' : '#fff',
        bodyColor: darkMode ? '#000' : '#fff',
        callbacks: {
          title: (tooltipItem) => {
            return ''; // Optionally hide the title if not needed
          },
          label: (tooltipItem) => {
            // Display "Unit Sales" or "Units Sold" instead of "Sales"
            return `Units Sold: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 50, // Set the maximum value to 80
        ticks: {
          color: darkMode ? '#000000' : '#ffffff',
          stepSize: 10, // Display ticks at every 10 units
          font: {
            size: 14,
          },
          callback: function(value) {
            // Avoid showing "0 units" by skipping it
            if (value === 0) {
              return '';  // Empty string means no label for 0
            }
            return `${value} units`; // Append 'units' for values greater than 0
          },
        },
        grid: {
          color: darkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        type: 'category',
        labels: chartData.labels,
        ticks: {
          color: darkMode ? '#000' : '#fff',
          font: {
            size: 14,
          },
        },
      },
    },
  };
  
  
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexGrow: 1 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart1;
