
import React, { useState } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useNavigate } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";
import { API_DOMAIN } from '../utils/constants';
import { AiOutlinePlus } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../hooks/useAuthContext';

const AddSupplier = ({ onClose }) => {
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [remarks, setRemarks] = useState('');
  const [categories, setCategories] = useState(['']);
  const [isUploading, setIsUploading] = useState(false); // Add state for button disabling
  const navigate = useNavigate();
  const { darkMode } = useAdminTheme();
  const { user } = useAuthContext();

  const categoryOptions = [
    "Components", "Peripherals", "Accessories", "PC Furniture", "OS & Software", "Laptops", "Desktops"
  ];

  const handleCategoryChange = (index, event) => {
    const newCategories = [...categories];
    newCategories[index] = event.target.value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, '']);
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const validateForm = () => {
    if (!supplierName || supplierName.trim() === '') {
      toast.error('Please enter a valid supplier name.');
      return false;
    }
    if (!contactPerson || !contactNumber || !email || categories.some(cat => cat === '') || !remarks) {
      toast.error('Please fill in all required fields.');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^(09\d{9})$/;
    if (!phoneRegex.test(contactNumber)) {
      toast.error('Please enter a valid contact number (e.g., 09123456789).');
      return false;
    }

    return true;
  };

  const upload = async () => {
    if (!validateForm()) return;
  
    // Log the data to verify it's correct before sending
    console.log({ supplierName, contactPerson, contactNumber, email, categories, remarks });
  
    try {
      setIsUploading(true); // Disable button on upload start
  
      // Supplier data to send
      const supplierData = {
        supplier_name: supplierName,
        contact_person: contactPerson,
        phone_number: contactNumber,
        email,
        categories,
        remarks,
      };
  
      // Send the supplier data to the backend
      const response = await axios.post(`${API_DOMAIN}/supplier`, supplierData);
      const createdSupplierId = response.data.supplier_id; // Assuming the response includes the created supplier's ID
      toast.success('Supplier added successfully!');
  
      // Prepare the audit log data
      const auditData = {
        user: user.name,          // Assuming you have the current user information
        action: 'Create',         // Action type
        module: 'Supplier',       // Module name
        event: `Added new supplier`, // Event description
        previousValue: 'N/A',     // No previous value since it's a new entry
        updatedValue: createdSupplierId, // ID of the new supplier
      };
  
      // Send the audit log data to the server
      await axios.post(`${API_DOMAIN}/audit`, auditData);
  
      // Introduce a 2-second delay before closing the modal
      setTimeout(() => {
        onClose();
        setIsUploading(false); // Re-enable button after closing
      }, 2000);
  
    } catch (err) {
      console.error(err);
      toast.error('Error adding supplier. Please try again.');
      setIsUploading(false); // Re-enable button if there's an error
    }
  };
  
  

  return (
    <div className={`h-full w-full flex flex-col justify-between ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
      <div className='w-full h-[82%] flex flex-col items-center justify-start p-6 px-4 '>
        <div className='w-full border-b-2 border-gray-300 py-2'>
          <p className='w-full text-center font-bold text-3xl'>Adding Supplier</p>
        </div>
        <div className={`overflow-y-auto w-full`}>
          <div className='flex flex-col gap-6 w-full p-4'>
            <div className='flex items-center justify-between'>
              <label htmlFor="supplierName" className={`text-md font-semibold ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SUPPLIER NAME</label>
              <input
                  id="supplierName"
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Enter supplier supplierName"
                  className="input-field border-2 p-2 w-[50%]"
                />
            </div>
            <div className='flex items-center justify-between'>
              <label htmlFor="contactPerson" className={`text-md font-semibold ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Contact Person</label>
              <input
                id="contactPerson"
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Enter contact person"
                className="input-field border-2 p-2 w-[50%]"
              />
            </div>
            <div className='flex items-center justify-between'>
              <label htmlFor="contactNumber" className={`text-md font-semibold ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Contact Number</label>
              <input
                id="contactNumber"
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
                className="input-field border-2 p-2 w-[50%]"
              />
            </div>
            <div className='flex items-center justify-between'>
              <label htmlFor="email" className={`text-md font-semibold ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="input-field border-2 p-2 w-[50%]"
              />
            </div>

            {/* Category Section */}
            <div className='flex flex-col'>
              <label className={`text-md font-semibold ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Categories</label>
              <div className='flex flex-col items-end justify-end w-ful gap-2 w-full'>
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center gap-2 w-[50%]">
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(index, e)}
                      className="input-field border-2 p-2 w-[100%] "
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="text-red-500"
                      >
                        <IoCloseOutline size={30} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCategory}
                  className=" py-2 text-white bg-blue-500 rounded-md mt-2 w-[50%] flex items-center px-2 gap-2"
                >
                  <AiOutlinePlus size={25} />
                  Add More Category
                </button>
              </div>
            </div>

            <div className='flex flex-col items-center justify-between'>
              <label htmlFor="remarks" className={`text-md font-semibold text-left w-full ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Remarks</label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks"
                className="input-field border-2 p-2 w-[100%] h-[86px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between flex-col w-full px-4 py-2 gap-2'>
        <button
          onClick={upload}
          className={`w-full py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
          disabled={isUploading} // Disable the button while uploading
        >
          {isUploading ? 'Adding Supplier...' : 'Add Supplier'}
        </button>
        <button onClick={onClose} className={`w-full py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button>

      </div>

      <ToastContainer />
    </div>
  );
};

export default AddSupplier;

