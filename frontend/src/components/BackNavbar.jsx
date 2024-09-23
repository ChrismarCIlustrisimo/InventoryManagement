import React from 'react';
import { IoCaretBackOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const BackNavbar = ({ id }) => {
  const navigate = useNavigate();
  const baseURL = 'http://localhost:5555';
  const { darkMode } = useTheme(); // Access darkMode from context

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`${baseURL}/transaction/${id}`);
      navigate('/orders');
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full flex justify-between px-2 py-4 items-center ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`} >
      <button className={`flex gap-2 items-center py-4 px-6 outline-none ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'} hover:underline`}  onClick={handleBackClick}>
        <IoCaretBackOutline />
        Back to sales order
      </button>
        <button className='text-4xl outline-none hover:text-white text-red-600'>
          <MdDelete onClick={handleDeleteClick}/>
        </button>
    </div>
  );
}

export default BackNavbar;