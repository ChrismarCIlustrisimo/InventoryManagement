import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const location = useLocation();
  const [selected, setSelected] = useState('MN');

  useEffect(() => {
    // Update selected state based on current pathname
    if (location.pathname === '/pos') {
      setSelected('AT');
    } else if (location.pathname === '/orders') {
      setSelected('MN');
    } else {
      setSelected('');
    }
  }, [location.pathname]);

  useEffect(() => {
    const formatDate = (date) => {
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      };
      return date.toLocaleString('en-US', options).replace(',', ',').toUpperCase();
    };

    const today = new Date();
    setCurrentDate(formatDate(today));
  }, []);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleSearch = () => {
    console.log("Searching for:", inputValue);
  };

  return (
    <div className='flex gap-4 justify-center items-center'>
        <div className="flex border border-primary rounded w-[20%]">
          <Link to="/orders" className="flex-1">
            <button
              className={`text-sm p-2 ${selected === 'MN' ? 'bg-primary text-white' : 'text-primary'} rounded-l w-full`}
              onClick={() => setSelected('MN')}
            >
              AT
            </button>
          </Link>

          <Link to="/pos" className="flex-1">
            <button
              className={`text-sm p-2 ${selected === 'AT' ? 'bg-primary text-white' : 'text-primary'} rounded-r w-full`}
              onClick={() => setSelected('AT')}
            >
              MN
            </button>
          </Link>
        </div>


      <div className='w-[480px] flex items-center px-4 bg-[#0d171a] rounded-md'>
        <input 
          type="text"
          placeholder='Search Notes'
          className='w-full text-xs bg-transparent py-[11px] outline-none'
          value={inputValue}
          onChange={handleChange}       
        />
        {inputValue ? (
          <IoMdClose className="ftext-slate-400 cursor-pointer hover:text-black" onClick={handleClear} />
        ) : (
          <FaSearch className="text-slate-400 cursor-pointer hover:text-black" onClick={handleSearch} />
        )}
      </div>
      
      <p className='text-[#7f8284] min-w-max'>{currentDate}</p>
      
    </div>
  );
};

export default SearchBar;
