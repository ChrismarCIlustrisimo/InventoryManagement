import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationDialog from '../components/ConfirmationDialog';

const UpdateSupplier = () => {
  const [supplier, setSupplier] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const baseURL = "http://localhost:5555";

  useEffect(() => {
    axios.get(`${baseURL}/supplier/${supplierId}`)
      .then(res => {
        setSupplier(res.data);
      })
      .catch(err => {
        console.error('Error fetching supplier:', err.response ? err.response.data : err.message);
        setError('An unknown error occurred');
      });
  }, [supplierId]);

  const updateSupplier = () => {
    axios.put(`${baseURL}/supplier/${supplierId}`, supplier)
      .then(res => {
        console.log('Update successful:', res.data);
        setIsEditing(false);
      })
      .catch(err => {
        console.error('Error updating supplier:', err.response ? err.response.data : err.message);
        setError('An unknown error occurred');
      });
  };

  const deleteSupplier = () => {
    console.log('Deleting supplier with ID:', supplierId);
    axios.delete(`${baseURL}/supplier/${supplierId}`)
      .then(res => {
        console.log('Delete successful:', res.data);
        navigate('/inventory/supplier');
      })
      .catch(err => {
        console.error('Error deleting supplier:', err.response ? err.response.data : err.message);
        setError('An unknown error occurred');
      });
    setIsDialogOpen(false);
  };

  const handleBackClick = () => {
    navigate('/inventory/supplier');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier(prev => ({ ...prev, [name]: value }));
  };

  if (!supplier) return <p>Loading...</p>;

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'text-light-TEXT bg-light-BG' : 'text-dark-TEXT bg-dark-BG'}`}>
      <div className='flex items-center justify-between h-[8%]'>
        <button className={`flex gap-2 items-center py-4 px-6 outline-none ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`} onClick={handleBackClick}>
          <IoCaretBackOutline /> Back to Supplier List
        </button>
        <div className='flex gap-4 items-center p-4'>
          <button className={`px-4 py-2 rounded-md font-semibold text-sm ${darkMode ? 'bg-light-ACCENT' : 'dark:bg-dark-ACCENT'}`} onClick={() => setIsEditing(true)}> Edit </button>
          <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}></div>
          <button className={`text-2xl ${darkMode ? 'text-light-ACCENT' : 'text-dark-ACCENT'}`} onClick={() => setIsDialogOpen(true)}><FaTrash /></button>
        </div>
      </div>

      <div className='flex w-full h-[90%] items-center justify-center'>
        <div className={`h-[40%] w-[60%] rounded-md flex items-center justify-center px-4 ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD'}`}>
          <div className='w-[36%] flex items-center justify-center h-full'>
            {supplier.image ? (
              <img
                src={`${baseURL}/images/${supplier.image.substring(14)}`}
                alt={supplier.name}
                className="w-48 h-48 object-cover rounded-md"
              />
            ) : (
              <div className={`w-48 h-48 flex items-center justify-center border rounded-md bg-gray-500 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}>
                <p className={`text-lg ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>No image</p>
              </div>
            )}
          </div>
          <div className='flex flex-col px-2 w-full gap-8 justify-center h-full'>
            <p className='text-xl'>
              <input
                type='text'
                name='name'
                value={supplier.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`border bg-transparent rounded-md p-2 w-full text-md ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
              />
            </p>
            <p className='text-md'>
              <input
                type='text'
                name='contact_number'
                value={supplier.contact_number}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`border bg-transparent rounded-md p-2 w-full text-md ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
              />
            </p>
            <p className='text-md'>
              <input
                type='text'
                name='email'
                value={supplier.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`border bg-transparent rounded-md p-2 w-full text-md ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
              />
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={`w-full h-[10%] px-4 py-6 border-t flex items-center justify-end ${darkMode ? 'bg-light-CARD border-light-ACCENT' : 'bg-dark-CARD border-dark-ACCENT'}`}> 
          <div className="flex items-center gap-4"> 
            <button type="button" onClick={() => setIsEditing(false)} className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-ACCENT text-light-ACCENT' : 'border-dark-ACCENT text-dark-ACCENT'}`}>Cancel</button> 
            <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}></div> 
            <button type="button" className={`px-6 py-2 rounded-md ${darkMode ? 'bg-light-ACCENT text-light-TEXT' : 'bg-dark-ACCENT text-dark-TEXT'}`} onClick={updateSupplier}>Save</button> 
          </div> 
        </div>
      )}

      {isDialogOpen && (
        <ConfirmationDialog
          isOpen={isDialogOpen}
          message="Are you sure you want to delete this supplier?"
          onConfirm={deleteSupplier}
          onCancel={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default UpdateSupplier;
