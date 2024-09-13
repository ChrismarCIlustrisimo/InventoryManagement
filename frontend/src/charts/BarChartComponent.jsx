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
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const BarChartComponent = ({ netSalesData, grossSalesData }) => {
  const { darkMode } = useAdminTheme();

  // Days of the week for the x-axis
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Initialize datasets with zero values
  const netSalesDataComplete = new Array(7).fill(0);
  const grossSalesDataComplete = new Array(7).fill(0);

  // Map existing data to their respective days
  netSalesData.forEach((value, index) => {
    netSalesDataComplete[index] = value || 0; // Default to 0 if undefined
  });
  
  grossSalesData.forEach((value, index) => {
    grossSalesDataComplete[index] = value || 0; // Default to 0 if undefined
  });

  // Prepare the chart data
  const data = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Net Sales',
        data: netSalesDataComplete,
        backgroundColor: '#CD5837',
        borderColor: 'none',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Gross Sales',
        data: grossSalesDataComplete,
        backgroundColor: '#DBA695',
        borderColor: 'none',
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const roundedValue = Math.round(tooltipItem.raw);
            return `${tooltipItem.dataset.label}: ${roundedValue}`;
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
      },
      y: {
        stacked: false,
        beginAtZero: true,
        min: 0,
        max: 30000,
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

export default BarChartComponent;
