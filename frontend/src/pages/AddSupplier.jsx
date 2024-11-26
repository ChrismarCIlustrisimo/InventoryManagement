import React, { useState } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useNavigate } from 'react-router-dom';
import { IoCaretBackOutline } from "react-icons/io5";
import { API_DOMAIN } from '../utils/constants';

const AddSupplier = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [productsAndServices, setProductsAndServices] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useAdminTheme();

  const upload = async () => {
    try {
      const supplierData = {
        company_name: name,
        contact_person: contact,
        phone_number: contact,
        products_and_services: productsAndServices,
        account_status: accountStatus,
        email,
      };

      const response = await axios.post(`${API_DOMAIN}/supplier`, supplierData);
      navigate('/inventory/supplier');
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'An unknown error occurred');
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className={`h-full w-full flex flex-col gap-2 ${darkMode ? 'text-light-TEXT bg-light-BG' : 'text-dark-TEXT bg-dark-BG'}`}>
      <div className='flex items-center justify-start h-[8%]'>
        <button className={`flex gap-2 items-center py-4 px-6 outline-none ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`} onClick={handleBackClick}>
          <IoCaretBackOutline />
          Back to suppliers
        </button>
      </div>

      <div className='w-full h-[82%] flex flex-col items-center justify-center gap-2'>
        <p className='text-3xl'>Add New Supplier</p>
        <div className={`w-[36%] h-[70%] rounded-md p-4 ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'}`}>
          <div className='flex flex-col w-full gap-4 h-full'>
            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="name">Supplier Name</label>
              <input
                type='text'
                placeholder='Name'
                className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="contact">Contact Number</label>
              <input
                type='text'
                placeholder='Contact Number'
                className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="email">Email</label>
              <input
                type='email'
                placeholder='Email'
                className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="productsAndServices">Products and Services</label>
              <input
                type='text'
                placeholder='Products and Services'
                className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                value={productsAndServices}
                onChange={(e) => setProductsAndServices(e.target.value)}
              />
            </div>

            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="accountStatus">Account Status</label>
              <input
                type='text'
                placeholder='Account Status'
                className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                value={accountStatus}
                onChange={(e) => setAccountStatus(e.target.value)}
              />
            </div>

            {error && <p className={`text-red-500 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>}
          </div>
        </div>
      </div>

      <div className={`w-full h-[10%] px-4 py-6 border-t flex items-center justify-end ${darkMode ? 'bg-light-CARD border-light-ACCENT' : 'bg-dark-CARD border-dark-ACCENT'}`}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleBackClick} className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-ACCENT text-light-ACCENT' : 'border-dark-ACCENT text-dark-ACCENT'}`}>Cancel</button>
          <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}></div>
          <button type="button" className={`px-6 py-2 rounded-md ${darkMode ? 'bg-light-ACCENT text-light-TEXT' : 'bg-dark-ACCENT text-dark-TEXT'}`} onClick={upload}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;
