import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useAdminTheme } from '../context/AdminThemeContext';

// Register Chart.js components and the data labels plugin
ChartJS.register(Tooltip, Legend, ArcElement, ChartDataLabels);

const PieChartComponent = () => {
  const { darkMode } = useAdminTheme();

  const data = {
    labels: ["Italy", "France", "Spain", "USA"],
    datasets: [{
      backgroundColor: ["#28a745", "#fd7e14", "#ffc107", "#dc3545"], // Colors for each segment
      data: [55, 49, 44, 24],
      borderWidth: 0, // Remove border width around each segment
    }]
  };

  // Calculate total
  const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);

  const options = {
    plugins: {
      legend: {
        display: false // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${data.labels[tooltipItem.dataIndex]}: ${tooltipItem.raw}%`;
          }
        }
      },
      datalabels: {
        display: false, // Disable data labels inside segments
      },
      // Custom plugin to draw text in the center of the chart
      customText: {
        id: 'customText',
        beforeDraw: (chart) => {
          const { ctx, width, height } = chart;
          const text = 'Total Products';
          const fontSize = 16;
          const fontFamily = 'Arial';

          ctx.save();
          ctx.font = `${fontSize}px ${fontFamily}`;
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, width / 2, height / 2);
          ctx.restore();
        }
      }
    },
    cutout: '80%' // Makes the pie chart thinner  
  };

  return (
    <div className="flex items-start">
      <div className="flex-1 flex justify-center">
        <div className="w-[210px] h-[210px] relative">
          <Doughnut data={data} options={options} />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col gap-2">
            <span className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-5xl`}>350</span>
            <span className={`${darkMode ? 'text-dark-CARD1' : 'text-light-CARD1'} text-sm`}>TOTAL PRODUCTS</span>
          </div>
        </div>
      </div>
      <div className="flex-1">
  <ul className="list-none p-0">
    <li className="mb-3"> {/* Increased margin-bottom */}
      <div className="flex flex-col items-start justify-start">
        <span className="text-xs">HIGH STOCK PRODUCT</span>
        <div className="w-full">
          <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
            <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: '30%', // Adjust as needed
                  backgroundColor: '#28a745' // Adjust as needed
                }}
              ></div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs">10 products</p>
        </div>
      </div>
    </li>
    <li className="mb-3"> {/* Increased margin-bottom */}
      <div className="flex flex-col items-start justify-start">
        <span className="text-xs">NEAR LOW STOCK PRODUCT</span>
        <div className="w-full">
          <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
            <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: '50%', // Adjust as needed
                  backgroundColor: '#fd7e14' // Adjust as needed
                }}
              ></div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs">20 products</p>
        </div>
      </div>
    </li>
    <li className="mb-3"> {/* Increased margin-bottom */}
      <div className="flex flex-col items-start justify-start">
        <span className="text-xs">LOW STOCK PRODUCT</span>
        <div className="w-full">
          <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
            <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: '30%', // Adjust as needed
                  backgroundColor: '#ffc107' // Adjust as needed
                }}
              ></div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs">10 products</p>
        </div>
      </div>
    </li>
    <li className="mb-3"> {/* Increased margin-bottom */}
      <div className="flex flex-col items-start justify-start">
        <span className="text-xs">OUT OF STOCK PRODUCT</span>
        <div className="w-full">
          <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
            <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: '50%', // Adjust as needed
                  backgroundColor: '#dc3545' // Adjust as needed
                }}
              ></div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs">20 products</p>
        </div>
      </div>
    </li>
  </ul>
</div>

    </div>
  );
};

export default PieChartComponent;
