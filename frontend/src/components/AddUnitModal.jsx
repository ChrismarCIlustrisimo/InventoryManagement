import React, { useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { BiImages } from 'react-icons/bi';
import axios from 'axios';  // Assuming you are using axios for making HTTP requests
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const AddUnitModal = ({ isOpen, onClose, productId }) => {
  const [quantity, setQuantity] = useState('');  // Changed to an empty string
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [serialNumberImages, setSerialNumberImages] = useState([]);
  const [localInputs, setLocalInputs] = useState([]);
  const [editModes, setEditModes] = useState([]);
  const baseURL = "http://localhost:5555";
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false); // Track if saving

  const handleQuantityChange = (value) => {
    if (value >= 0) {
      setQuantity(value);
      const newSerialNumbers = Array.from({ length: value }, (_, i) => ({ serialNumber: '' }));
      const newLocalInputs = Array.from({ length: value }, () => '');
      const newEditModes = Array.from({ length: value }, () => false);
      setSerialNumbers(newSerialNumbers);
      setLocalInputs(newLocalInputs);
      setEditModes(newEditModes);
      setSerialNumberImages(Array.from({ length: value }, () => null));
      setSavedCount(0) 
    }
  };

  const handleInputChange = (index, value) => {
    const updatedInputs = [...localInputs];
    updatedInputs[index] = value;
    setLocalInputs(updatedInputs);
  };

  const handleSerialNumberImageChange = (index, file) => {
    const updatedImages = [...serialNumberImages];
    updatedImages[index] = file;
    setSerialNumberImages(updatedImages);
  };
  
  const handleEditClick = (index) => {
    setEditModes(prevEditModes => {
      const updatedEditModes = [...prevEditModes];
      updatedEditModes[index] = false; // Set edit mode to false
      return updatedEditModes;
    });
  };
  
  const handleSaveClick = (index) => {
    setEditModes(prevEditModes => {
      const updatedEditModes = [...prevEditModes];
      updatedEditModes[index] = true; // Set edit mode to true
      return updatedEditModes;
    });
  };
  





  const isInputDisabled = (index) => editModes[index] || isSaving;


  const upload = async () => {
    // Make sure quantity is greater than 0
    if (quantity <= 0) {
      toast.warning("Please enter a valid number of units."); // Use toast to display warning
      return;
  }

  // Check for empty serial numbers or images
  for (let i = 0; i < localInputs.length; i++) {
      if (!localInputs[i] || !serialNumberImages[i]) {
          toast.warning(`Please fill in Serial Number ${i + 1} and upload its image.`); // Toast notification for empty fields
          return;
      }
  }

    // Create FormData object to handle file uploads
    const formData = new FormData();
    localInputs.forEach((serialNumber, index) => {
      formData.append('serial_number[]', serialNumber);  // Append serial numbers
      formData.append('serial_number_image', serialNumberImages[index]);  // Append images
    });

    try {
      // Send POST request to the server
      const response = await axios.post(`${baseURL}/product/${productId}/unit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Important for file uploads
        },
      });

      if (response.status === 201) {
        alert('Units added successfully!');
        onClose();  // Close the modal after successful upload
      }
    } catch (error) {
      console.error('Error adding units:', error);
      alert('Error adding units.');
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };



  if (!isOpen) return null; 

  return (
    <div className={`fixed inset-0 flex items-center justify-start flex-col ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
      <div className='w-full py-2'>
         <button className={`flex gap-2 items-center py-2 px-4 rounded-md ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} hover:underline`} onClick={() => handleBackClick()}>
             <IoCaretBackOutline /> Back to inventory
          </button>
      </div>
      <div className={`w-full h-full flex items-start justify-center border-12   ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
      <div className={`rounded-lg z-10 px-6 w-[70%] h-[92%] ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
      <div className='w-full flex items-center justify-between gap-2 py-2 px-6 '>
        <p className='text-2xl text-center font-semibold'>Add New Unit</p>
        <div className='flex items-center justify-center gap-2'>
          <p htmlFor="quantity">Units:</p>
          <div className={`flex items-center border rounded-md overflow-hidden px-2 ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className={`px-2 py-1 ${darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-dark-activeLink text-dark-primary'}`}
            >
              -
            </button>
            <input
              type='number'
              placeholder='Unit number'
              id="quantity"
              className={`bg-transparent p-2 text-center w-16 outline-none ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className={`px-2 py-1 ${darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-dark-activeLink text-dark-primary'}`}
            >
              +
            </button>
          </div>
        </div>
      </div>



      <div className='max-h-[550px] h-[500px] overflow-y-auto py-6 p-4 rounded-md'>
        {quantity <= 0 ? (
          <div className='w-full h-[90%] flex items-center justify-center'>
            <p className='text-4xl'>Please Input Units Quantity</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-4 w-full'>
            {serialNumbers.map((serial, index) => (
              <div key={index} className={`flex flex-col mb-4 items-center justify-center p-4 border rounded-md ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                <label htmlFor={`serialNumber-${index}`} className="font-medium">Serial Number {index + 1}</label>
                {serialNumberImages[index] ? (
                  <img src={URL.createObjectURL(serialNumberImages[index])} alt={`Serial ${index + 1}`} className="w-64 h-64 object-cover my-2" />
                ) : (
                  <BiImages className="w-64 h-64 text-gray-500 my-2" />
                )}
                <div className='flex gap-4 items-center justify-center w-full'>
                  <p className="w-[30%] flex items-center justify-center mb-2 h-full">SERIAL NUMBER</p>
                  <input
                      id={`serialNumber-${index}`}
                      type="text"
                      placeholder={`Serial Number ${index + 1}`}
                      value={localInputs[index] !== undefined ? localInputs[index] : serial.serialNumber}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className={`border-2 rounded-md p-2 mb-2 w-[70%] 
                        ${darkMode ? 'bg-transparent placeholder-gray' : 'bg-transparent placeholder-white'}`}
                      disabled={isInputDisabled(index)} // Use the function to determine if the input should be disabled
                    />
                </div>

                <label htmlFor={`serialNumberImage-${index}`} className="mb-2 bg-blue-500 hover:scale-95 text-white rounded-md p-2 px-6 flex items-center justify-center gap-2 cursor-pointer w-full">
                  <AiOutlineUpload className='text-2xl' />
                  {serialNumberImages[index] ? 'Change Image' : 'Upload Image'}
                </label>
                
                {editModes[index] ? (
                  <button onClick={() => handleEditClick(index)} className={`px-2 py-3 w-full bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Edit</button>
                ) : (
                  <button onClick={() => handleSaveClick(index)} className={`px-2 py-3 w-full rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Save</button>
                )}
                <input
                  id={`serialNumberImage-${index}`}
                  name="serial_number_image"  
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSerialNumberImageChange(index, e.target.files[0])}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        )}
      </div>



        <div className={`w-full absolute bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-8 py-2 border ${darkMode ? 'bg-light-container border-light-border' : 'bg-dark-container border-dark-border'}`}>
          <button className={`px-2 py-3 w-[100px] bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`} onClick={onClose}>Cancel</button>
          <button className={`px-2 py-3 w-[100px] rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`} onClick={upload}>Save</button>
        </div>
      </div>
      </div>
          <ToastContainer />
    </div>
  );
};

export default AddUnitModal;
