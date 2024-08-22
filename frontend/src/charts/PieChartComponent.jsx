import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useAdminTheme } from '../context/AdminThemeContext';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';

// Register Chart.js components and the data labels plugin
ChartJS.register(Tooltip, Legend, ArcElement, ChartDataLabels);

const PieChartComponent = () => {
  const { darkMode } = useAdminTheme();
  const [data, setData] = useState({
    highStock: 0,
    nearLowStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = 'http://localhost:5555';
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${baseURL}/product`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        const products = response.data.data;

        const categorizedData = products.reduce((acc, product) => {
          const {
            quantity_in_stock,
            low_stock_threshold,
            near_low_stock_threshold
          } = product;

          let status;

          if (quantity_in_stock <= 0) {
            status = 'OUT OF STOCK';
          } else if (quantity_in_stock <= low_stock_threshold) {
            status = 'LOW STOCK';
          } else if (quantity_in_stock <= near_low_stock_threshold) {
            status = 'NEAR LOW STOCK';
          } else {
            status = 'HIGH STOCK';
          }

          switch (status) {
            case 'HIGH STOCK':
              acc.highStock += 1;
              break;
            case 'NEAR LOW STOCK':
              acc.nearLowStock += 1;
              break;
            case 'LOW STOCK':
              acc.lowStock += 1;
              break;
            case 'OUT OF STOCK':
              acc.outOfStock += 1;
              break;
            default:
              console.error('Unexpected stock status:', status);
              break;
          }
          return acc;
        }, {
          highStock: 0,
          nearLowStock: 0,
          lowStock: 0,
          outOfStock: 0,
        });

        setData(categorizedData);
        
        // Update stock statuses automatically after fetching the data
        await updateStockStatuses();
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };

    const updateStockStatuses = async () => {
      try {
        await axios.post(`${baseURL}/product/update-stock-status`, null, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        console.log('Stock statuses updated successfully.');
        // Optionally, you could re-fetch the data after updating
        // fetchProductData();
      } catch (error) {
        console.error('Error updating stock statuses:', error);
        alert('Failed to update stock statuses.');
      }
    };

    fetchProductData();
  }, [user]);

  const chartData = {
    labels: ["High Stock", "Near Low Stock", "Low Stock", "Out of Stock"],
    datasets: [{
      backgroundColor: ["#28a745", "#fd7e14", "#ffc107", "#dc3545"],
      data: [data.highStock, data.nearLowStock, data.lowStock, data.outOfStock],
      borderWidth: 0,
    }]
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = chartData.labels[tooltipItem.dataIndex];
            const value = tooltipItem.raw;
            return `${label}: ${value} products`;
          }
        }
      },
      datalabels: {
        display: false,
      },
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
    cutout: '80%',
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex items-start">
      <div className="flex-1 flex justify-center">
        <div className="w-[210px] h-[210px] relative">
          <Doughnut data={chartData} options={options} />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col gap-2">
            <span className={`${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'} text-5xl`}>
              {data.highStock + data.nearLowStock + data.lowStock + data.outOfStock}
              {console.log(data)}
            </span> {/* Overall Product Count */}
            <span className={`${darkMode ? 'text-dark-CARD1' : 'text-light-CARD1'} text-sm`}>
              TOTAL PRODUCTS
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <ul className="list-none p-0">
          <li className="mb-3">
            <div className="flex flex-col items-start justify-start">
              <span className="text-xs">HIGH STOCK PRODUCT</span>
              <div className="w-full">
                <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
                  <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-full rounded"
                      style={{
                        width: `${(data.highStock / (data.highStock + data.nearLowStock + data.lowStock + data.outOfStock)) * 100}%`,
                        backgroundColor: '#28a745',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs">{data.highStock} products</p>
              </div>
            </div>
          </li>
          <li className="mb-3">
            <div className="flex flex-col items-start justify-start">
              <span className="text-xs">NEAR LOW STOCK PRODUCT</span>
              <div className="w-full">
                <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
                  <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-full rounded"
                      style={{
                        width: `${(data.nearLowStock / (data.highStock + data.nearLowStock + data.lowStock + data.outOfStock)) * 100}%`,
                        backgroundColor: '#fd7e14',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs">{data.nearLowStock} products</p>
              </div>
            </div>
          </li>
          <li className="mb-3">
            <div className="flex flex-col items-start justify-start">
              <span className="text-xs">LOW STOCK PRODUCT</span>
              <div className="w-full">
                <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
                  <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-full rounded"
                      style={{
                        width: `${(data.lowStock / (data.highStock + data.nearLowStock + data.lowStock + data.outOfStock)) * 100}%`,
                        backgroundColor: '#ffc107',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs">{data.lowStock} products</p>
              </div>
            </div>
          </li>
          <li className="mb-3">
            <div className="flex flex-col items-start justify-start">
              <span className="text-xs">OUT OF STOCK PRODUCT</span>
              <div className="w-full">
                <div className="relative flex items-center justify-start text-xs font-semibold h-3 py-2">
                  <div className="relative flex-1 h-1.5 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-full rounded"
                      style={{
                        width: `${(data.outOfStock / (data.highStock + data.nearLowStock + data.lowStock + data.outOfStock)) * 100}%`,
                        backgroundColor: '#dc3545',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs">{data.outOfStock} products</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PieChartComponent;
