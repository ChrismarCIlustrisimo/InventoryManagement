import React, { useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { BiImages } from 'react-icons/bi';
import axios from 'axios';  // Assuming you are using axios for making HTTP requests

const AddUnitModal = ({ isOpen, onClose, darkMode, productId }) => {
  const [quantity, setQuantity] = useState(0);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [serialNumberImages, setSerialNumberImages] = useState([]);
  const [localInputs, setLocalInputs] = useState([]);
  const [editModes, setEditModes] = useState([]);
  const baseURL = "http://localhost:5555";

  const handleQuantityChange = (value) => {
    setQuantity(value);
    const newSerialNumbers = Array.from({ length: value }, (_, i) => ({ serialNumber: '' }));
    const newLocalInputs = Array.from({ length: value }, () => '');
    const newEditModes = Array.from({ length: value }, () => false);
    setSerialNumbers(newSerialNumbers);
    setLocalInputs(newLocalInputs);
    setEditModes(newEditModes);
    setSerialNumberImages(Array.from({ length: value }, () => null));
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
    const updatedEditModes = [...editModes];
    updatedEditModes[index] = true;
    setEditModes(updatedEditModes);
  };

  const handleCheckClick = (index) => {
    const updatedEditModes = [...editModes];
    updatedEditModes[index] = false;
    setEditModes(updatedEditModes);
  };

  const upload = async () => {
    // Make sure quantity is greater than 0
    if (quantity <= 0) {
      alert("Please enter a valid number of units.");
      return;
    }

    // Create FormData object to handle file uploads
    const formData = new FormData();
    localInputs.forEach((serialNumber, index) => {
      formData.append('serial_number[]', serialNumber);  // Append serial numbers
      formData.append('serial_number_image', serialNumberImages[index]);  // Append images
    });

    try {
      // Send POST request to the server (adjust the endpoint as per your backend setup)
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

  const progressPercentage = (localInputs.filter(input => input !== '').length / quantity) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`bg-white rounded-lg shadow-md z-10 p-6 w-[70%] h-[84%] ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
        <p className='text-3xl text-center mb-6 font-semibold'>Add New Unit</p>
        <div className='flex items-center justify-center'>
          <div className="w-[50%] bg-gray-200 rounded h-2 mb-4">
            <div className="bg-green-500 h-2 rounded" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
        <div className='w-full flex gap-2 py-2'>
          <div className='flex flex-col items-end justify-center w-full gap-2'>
            <p htmlFor="quantity">How many units?</p>
            <input
              type='number'
              placeholder='Unit number'
              id="quantity"
              className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
            />
          </div>
        </div>

        <div className='max-h-[380px] overflow-y-auto py-6'>
          <div className='grid grid-cols-4 gap-4 w-full'>
            {serialNumbers.map((serial, index) => (
              <div key={index} className="flex flex-col mb-4 items-center justify-center bg-white p-4 border rounded-md">
                <label htmlFor={`serialNumber-${index}`} className="font-medium">Serial Number {index + 1}</label>
                {serialNumberImages[index] ? (
                  <img src={URL.createObjectURL(serialNumberImages[index])} alt={`Serial ${index + 1}`} className="w-36 h-36 object-cover my-2" />
                ) : (
                  <BiImages className="w-36 h-36 text-gray-500 my-2" />
                )}
                <div>
                  <input
                    id={`serialNumber-${index}`}
                    type="text"
                    placeholder={`Serial Number ${index + 1}`}
                    value={localInputs[index] !== undefined ? localInputs[index] : serial.serialNumber}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="border rounded-md p-2 mb-2"
                    disabled={editModes[index]}
                  />
                  {editModes[index] ? (
                    <button onClick={() => handleEditClick(index)} className="bg-blue-400 hover:scale-95 text-white rounded-md p-2 px-6 flex items-center justify-center gap-2 cursor-pointer w-full mb-2">Edit</button>
                  ) : (
                    <button onClick={() => handleCheckClick(index)} className="bg-green-400 hover:scale-95 text-white rounded-md p-2 px-6 flex items-center justify-center gap-2 cursor-pointer w-full mb-2">Save</button>
                  )}
                </div>
                <label htmlFor={`serialNumberImage-${index}`} className="bg-blue-500 hover:scale-95 text-white rounded-md p-2 px-6 flex items-center justify-start gap-2 cursor-pointer w-full">
                  <AiOutlineUpload className='text-2xl' />
                  {serialNumberImages[index] ? 'Change Image' : 'Upload Image'}
                </label>
                <input
                  id={`serialNumberImage-${index}`}
                  name="serial_number_image"  // Ensure the name is the same for all inputs
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSerialNumberImageChange(index, e.target.files[0])}
                  className="hidden" // Hide the input
                />
              </div>
            ))}
          </div>
        </div>

        <div className='w-full absolute bottom-0 left-0 right-0 flex items-center justify-end px-8 py-4'>
          <button className="bg-blue-500 text-white rounded-md px-4 py-2" onClick={upload}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default AddUnitModal;
