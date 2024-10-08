import React from 'react';

const StatsCard = ({ title, value, changeType, changePercent, className, percenText }) => {
  // Set the color for increase or decrease
  const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
  
  return (
    <div className={`flex flex-col items-start justify-between gap-4 p-4 rounded-lg shadow-md w-72 h-52 ${className}`}>
      <h3 className="text-lg font-normal">{title}</h3>
      <div className="mt-2">
        <span className="text-6xl font-bold">{value}</span>
      </div>
      <div className="flex items-center mt-2 text-sm">
        {changeType === 'increase' ? (
          <span className={changeColor}>▲</span>
        ) : (
          <span className={changeColor}>▼</span>
        )}
        <span className="ml-1">{changePercent}% {changeType === 'increase' ? 'increase' : 'decrease'}  {percenText}</span> 
      </div>
    </div>
  );
};

export default StatsCard;
