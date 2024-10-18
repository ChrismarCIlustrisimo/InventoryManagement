import React from 'react';
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"; // Import both arrow icons
import { AiOutlineAlert } from "react-icons/ai";

const StatsCard = ({ 
  title, 
  value, 
  changeType, 
  changePercent, 
  className = '', 
  percenText = '', 
  width = 'w-72', // default width if not passed
  bgColor = 'bg-white', // default background color if not passed
  showPercent = true, // control to display percentage
  currency = false, // control to display currency symbol
  warning = false, // control to display warning component
  percent = false
}) => {
  // Set the color for increase or decrease
  const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';

  // Map background colors to text colors
  const textColor = bgColor === 'bg-white' ? 'text-black' : 'text-white';

  return (
    <div className={`flex flex-col items-start justify-between gap-4 p-4 rounded-lg shadow-lg h-full ${width} ${bgColor} ${className}`}>
      <h3 className={`text-lg font-normal ${textColor}`}>{title}</h3>
      <div className={`mt-2 ${textColor}`}>
        <span className={`text-6xl font-medium ${warning ? `flex gap-2 items-center justify-center`: ``} ${percent ? `flex gap-2 items-center justify-center`: ``}`}>
          {currency ? `₱` : ''}
          {value}
          {warning ? <AiOutlineAlert size={46}/> : ''}
          {percent ? ` %` : ''}
        </span>
      </div>
      <div className='mt-2'>
        {showPercent ? ( // Show percentage only if showPercent is true
          <div className="flex items-center text-sm">
            {changeType === 'increase' ? (
              <span className={`text-${textColor}`}><AiOutlineArrowUp /></span>
            ) : (
              <span className={`text-${textColor}`}><AiOutlineArrowDown /></span> // Use down arrow for decrease
            )}
            <span className="ml-1">{changePercent}% {changeType === 'increase' ? 'increase' : 'decrease'} {percenText}</span>
          </div>
        ) : (
          <p className={`text-${textColor} invisible`}>Make this hidden</p> // Invisible text with same color as bgColor
        )}
      </div>
    </div>
  );
};

export default StatsCard;
