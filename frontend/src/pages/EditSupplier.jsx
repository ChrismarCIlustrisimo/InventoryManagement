import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoCloseOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // If you haven't imported the styles
import { useAdminTheme } from '../context/AdminThemeContext';
import { API_DOMAIN } from '../utils/constants';
import { useAuthContext } from '../hooks/useAuthContext';

const EditSupplier = ({ supplier, onClose }) => {
    const [supplierName, setSupplierName] = useState(supplier.supplier_name || '');
    const [contactPerson, setContactPerson] = useState(supplier.contact_person || '');
    const [phoneNumber, setPhoneNumber] = useState(supplier.phone_number || '');
    const [productsAndServices, setProductsAndServices] = useState(supplier.products_and_services || '');
    const [category, setCategory] = useState(supplier.categories || []);
    const [isUploading, setIsUploading] = useState(false);
    const { darkMode } = useAdminTheme();
    const [email, setEmail] = useState(supplier.email || '');
    const [remarks, setRemarks] = useState(supplier.remarks || 'No remarks provided');
    const { user } = useAuthContext();

    const categoryOptions = [
        "Components", "Peripherals", "Accessories", "PC Furniture", "OS & Software", "Laptops", "Desktops"
    ];

    const handleCategoryChange = (index, event) => {
        const newCategories = [...category];
        newCategories[index] = event.target.value;
        setCategory(newCategories);
    };

    const addCategory = () => {
        setCategory([...category, '']);
    };

    const removeCategory = (index) => {
        const newCategories = category.filter((_, i) => i !== index);
        setCategory(newCategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        setIsUploading(true); // Disable button during upload
      
        const updatedSupplier = {
          supplier_name: supplierName,
          contact_person: contactPerson,
          phone_number: phoneNumber,
          email: email,
          categories: category,
          remarks: remarks,
        };
      
        // Compare previous and updated values to capture only the changed fields
        const changes = {
          supplier_name: supplierName !== supplier.supplier_name ? { previous: supplier.supplier_name, updated: supplierName } : null,
          contact_person: contactPerson !== supplier.contact_person ? { previous: supplier.contact_person, updated: contactPerson } : null,
          phone_number: phoneNumber !== supplier.phone_number ? { previous: supplier.phone_number, updated: phoneNumber } : null,
          email: email !== supplier.email ? { previous: supplier.email, updated: email } : null,
          categories: JSON.stringify(category) !== JSON.stringify(supplier.categories) ? { previous: supplier.categories, updated: category } : null,
          remarks: remarks !== supplier.remarks ? { previous: supplier.remarks, updated: remarks } : null,
        };
      
        // Remove null values from the changes object
        const filteredChanges = Object.fromEntries(Object.entries(changes).filter(([_, value]) => value !== null));
      
        // Create the event string based on the changed fields
        const events = Object.keys(filteredChanges)
          .map((field) => `Updated ${field.replace('_', ' ')} of supplier ${supplier.supplier_id}`)
          .join(', ');
      
        // Set the audit log entry
        const auditData = {
          user: user.name, // Assuming you have the current user information
          action: 'Update',
          module: 'Supplier',
          event: events || 'Updated supplier info', // Default if no field is updated
          previousValue: Object.fromEntries(
            Object.entries(filteredChanges).map(([key, value]) => [key, { previous: value.previous }])
          ),
          updatedValue: Object.fromEntries(
            Object.entries(filteredChanges).map(([key, value]) => [key, { updated: value.updated }])
          ),
        };
      
        try {
          // Update supplier data
          await axios.put(`${API_DOMAIN}/supplier/${supplier._id}`, updatedSupplier);
          toast.success('Supplier updated successfully');
      
          // Log the audit data
          await axios.post(`${API_DOMAIN}/audit`, auditData);
      
          // Close the modal after a delay
          setTimeout(() => {
            onClose();
            setIsUploading(false); // Re-enable button after closing
          }, 2000);
        } catch (err) {
          toast.error('Error updating supplier');
          setIsUploading(false); // Re-enable button if there's an error
        }
      };
      
      

    return (
        <div className={`h-full w-full flex flex-col justify-between ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
            <div className='w-full h-[82%] flex flex-col items-center justify-start p-6 px-4 '>
                <div className='w-full border-b-2 border-gray-300 py-2'>
                    <p className='w-full text-center font-bold text-3xl'>Editing Supplier</p>
                </div>
                <div className={`overflow-y-auto w-full`}>
                    <div className='flex flex-col gap-6 w-full p-4'>
                    <div className='flex items-center justify-start'>
                            <label htmlFor="id" className={`text-md font-semibold w-[36%]  ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SUPPLIER ID</label>
                            <p className="p-2 w-[50%]">{supplier.supplier_id}</p>
                        </div>
                        <div className='flex items-center justify-start'>
                            <label htmlFor="supplierName" className={`text-md font-semibold w-[36%]  ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SUPPLIER NAME</label>
                            <input
                                id="supplierName"
                                type="text"
                                value={supplierName}
                                onChange={(e) => setSupplierName(e.target.value)}
                                placeholder="Enter supplier name"
                                className="input-field border-2 p-2 w-[50%]"
                            />
                        </div>
                        <div className='flex items-center justify-start'>
                            <label htmlFor="contactPerson" className={`text-md font-semibold w-[36%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Contact Person</label>
                            <input
                                id="contactPerson"
                                type="text"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                placeholder="Enter contact person"
                                className="input-field border-2 p-2 w-[50%]"
                            />
                        </div>
                        <div className='flex items-center justify-start'>
                            <label htmlFor="phoneNumber" className={`text-md font-semibold w-[36%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Phone Number</label>
                            <input
                                id="phoneNumber"
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="input-field border-2 p-2 w-[50%]"
                            />
                        </div>
                        <div className='flex items-center justify-start'>
                            <label htmlFor="email" className={`text-md font-semibold w-[36%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Email Address</label>
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
                        <div className='flex flex-col '>
                            <label className={`text-md font-semibold ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Categories</label>
                            <div className='flex items-center justify-start'>
                                <div className='w-[36%]'></div>
                                <div className='flex flex-col items-start justify-center w-ful gap-2 w-[64%]  '>
                                {category.map((cat, index) => (
                                    <div key={index} className="flex items-center gap-2 w-[80%]">
                                        <select
                                            value={cat}
                                            onChange={(e) => handleCategoryChange(index, e)}
                                            className="input-field border-2 p-2 w-[100%]"
                                        >
                                            <option value="">Select Category</option>
                                            {categoryOptions.map((option, i) => (
                                                <option key={i} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        {category.length > 1 && (
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
                                    className="py-2 text-white bg-blue-500 rounded-md mt-2 w-[80%] flex items-center px-2 gap-2"
                                >
                                    <AiOutlinePlus size={25} />
                                    Add More Category
                                </button>
                            </div>
                            </div>

                        </div>
                        <div className='flex items-start justify-start'>
                            <label htmlFor="remarks" className={`text-md font-semibold text-left w-[36%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>Remarks</label>
                            <textarea
                                id="remarks"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter remarks"
                                className="input-field border-2 p-2 w-[64%] h-[86px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-between flex-col w-full px-4 py-2 gap-2'>
                <button
                    onClick={handleSubmit}
                    className={`w-full py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
                    disabled={isUploading}
                >
                    {isUploading ? 'Updating Supplier...' : 'Save Changes'}
                </button>
                <button onClick={onClose} className={`w-full py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button>
            </div>

            <ToastContainer />
        </div>
    );
};

export default EditSupplier;
