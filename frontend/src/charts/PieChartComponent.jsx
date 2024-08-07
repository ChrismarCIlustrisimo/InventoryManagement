import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement);

const PieChartComponent = () => {
  const data = {
    labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    datasets: [{
      backgroundColor: ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"],
      data: [55, 49, 44, 24, 15]
    }]
  };

  const options = {
    plugins: {
      legend: {
        display: false // Hide the legend from the chart
      }
    }
  };

  return (
    <div className="flex items-start">
      <div className="flex-1 flex justify-center">
        <div className="w-[250px] h-[250px]">
          <Doughnut data={data} options={options} />
        </div>
      </div>
      <div className="flex-1 pl-5">
        <h3 className="text-xl font-semibold mb-4">World Wide Wine Production 2018</h3>
        <ul className="list-none p-0">
          {data.labels.map((label, index) => (
            <li key={index} className="mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-2" style={{ color: data.datasets[0].backgroundColor[index] }}>
                  &#9679;
                </span>
                <span className="flex-1 text-lg">{label}:</span>
                <div className="flex-2 ml-2 w-full">
                  <div className="relative h-2 w-full bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-full rounded"
                      style={{
                        width: `${data.datasets[0].data[index]}%`,
                        backgroundColor: data.datasets[0].backgroundColor[index]
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChartComponent;
