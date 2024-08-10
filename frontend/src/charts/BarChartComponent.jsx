import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useAdminTheme } from '../context/AdminThemeContext';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin if used

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin if used
);

const DashboardChart = () => {
  const { darkMode } = useAdminTheme();

  // Sample data with values fitting within 0 - 100k range
  const data = {
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    datasets: [
      {
        label: 'Net Sales',
        data: [12000, 25000, 35000, 45000, 55000, 65000, 75000],
        backgroundColor: '#CD5837',
        borderColor: 'none',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Gross Sales',
        data: [15000, 30000, 40000, 55000, 70000, 85000, 95000],
        backgroundColor: '#DBA695',
        borderColor: 'none',
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 10,
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          }
        }
      },
      datalabels: {
        display: false
      },
    },
    scales: {
      x: {
        stacked: false,
        ticks: {
          color: darkMode ? '#120A08' : '#F7EFED',
        }
      },
      y: {
        stacked: false,
        beginAtZero: true,
        max: 100000,
        ticks: {
          callback: function (value) {
            return value >= 1000 ? `${value / 1000}k` : value;
          }
        }
      }
    }
  };
  

  return (
      <Bar data={data} options={options} />
  );
};

export default DashboardChart;