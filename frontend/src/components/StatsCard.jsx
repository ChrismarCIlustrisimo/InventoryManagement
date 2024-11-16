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
  width = 'w-72', 
  bgColor = 'bg-white', 
  showPercent = true, 
  currency = false, 
  warning = false, 
  percent = false,
  onClick, 
  valueStyle = 'text-6xl' // Add default class for text size
}) => {
  const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
  const textColor = bgColor === 'bg-white' ? 'text-black' : 'text-white';
  const cursorStyle = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`flex flex-col items-start justify-between gap-4 p-4 rounded-lg shadow-lg h-full ${cursorStyle} ${width} ${bgColor} ${className} 
        ${onClick ? 'transition-transform transform hover:scale-105' : ''}`} 
      onClick={onClick} 
    >
      <h3 className={`text-lg font-normal ${textColor}`}>{title}</h3>
      <div className={`mt-2 ${textColor}`}>
        <span className={`font-medium ${valueStyle} ${warning ? `flex gap-2 items-center justify-center`: ``} ${percent ? `flex gap-2 items-center justify-center`: ``}`}>
          {currency ? `₱` : ''}
          {value}
          {warning ? <AiOutlineAlert size={46}/> : ''}
          {percent ? ` %` : ''}
        </span>
      </div>
      <div className='mt-2'>
        {showPercent ? ( 
          <div className="flex items-center text-sm">
            {changeType === 'increase' ? (
              <span className={`text-${textColor}`}><AiOutlineArrowUp /></span>
            ) : (
              <span className={`text-${textColor}`}><AiOutlineArrowDown /></span> 
            )}
            <span className="ml-1">{changePercent}% {changeType === 'increase' ? 'increase' : 'decrease'} {percenText}</span>
          </div>
        ) : (
          <p className={`text-${textColor} invisible`}>Make this hidden</p> 
        )}
      </div>
    </div>
  );
};


export default StatsCard;
