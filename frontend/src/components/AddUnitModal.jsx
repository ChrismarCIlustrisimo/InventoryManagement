import React, { useState, useEffect, useRef } from 'react'; // Add useEffect and useRef
import axios from 'axios';  // Assuming you are using axios for making HTTP requests
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { IoCameraOutline } from "react-icons/io5";
import { API_DOMAIN } from '../utils/constants';


const AddUnitModal = ({ isOpen, onClose, productId }) => {
  const [quantity, setQuantity] = useState('');  // Changed to an empty string
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [serialNumberImages, setSerialNumberImages] = useState([]);
  const [localInputs, setLocalInputs] = useState([]);
  const [editModes, setEditModes] = useState([]);
  const baseURL = API_DOMAIN;
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false); // Track if saving
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(false);

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
    setSavedCount(0);
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
  

  const upload = async () => {
    if (quantity <= 0) {
      toast.warning("Please enter a valid number of units.");
      return;
    }
  
    for (let i = 0; i < localInputs.length; i++) {
      if (!localInputs[i] || !serialNumberImages[i]) {
        toast.warning(`Please fill in Serial Number ${i + 1} and upload its image.`);
        return;
      }
    }
  
    const formData = new FormData();
    localInputs.forEach((serialNumber, index) => {
      formData.append('serial_number[]', serialNumber);
      formData.append('serial_number_image', serialNumberImages[index]);
    });
  
    setLoading(true); // Set loading state to true when uploading starts
  
    try {
      const response = await axios.post(`${baseURL}/product/${productId}/unit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 201) {
        toast.success("Units added successfully!");
        setTimeout(() => {
          onClose();
        }, 1000); // 1000ms = 1 second
      }
    } catch (error) {
      console.error('Error adding units:', error);
      toast.error('Error adding units.');
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };
  
  
  const handleBackClick = () => {
    navigate(-1);
  };
  const videoRefs = useRef([]);

  useEffect(() => {
      const streams = [];
      const setupVideo = async () => {
          try {
              for (let index = 0; index < serialNumbers.length; index++) {
                  if (videoRefs.current[index]) {
                      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                      videoRefs.current[index].srcObject = stream;
                      streams.push(stream);
                  }
              }
          } catch (error) {
              console.error('Error accessing the camera: ', error);
          }
      };

      setupVideo();

      return () => {
          streams.forEach(stream => {
              stream.getTracks().forEach(track => track.stop());
          });
      };
  }, [serialNumbers]);

  const captureImage = (index) => {
      const video = videoRefs.current[index];

      if (video && video.srcObject && video.srcObject.active) {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = canvas.toDataURL('image/png');

          fetch(imageData)
              .then(res => res.blob())
              .then(blob => {
                  const file = new File([blob], `serial_number_${index}.png`, { type: 'image/png' });
                  handleSerialNumberImageChange(index, file);
              });
      } else {
          console.error(`Video element at index ${index} is not available or not loaded.`);
      }
  };

  const handleReuploadImage = (index) => {
      // Clear the current image
      handleSerialNumberImageChange(index, null); // Pass null to clear the image
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
      <div className='w-full flex items-center justify-between gap-2 py-2 px-6'>
      <p className='text-2xl text-center font-semibold'>Add New Unit</p>
                    <div className='flex items-center justify-center gap-2'>
                        <p htmlFor="quantity">Units:</p>
                        <div className={`flex items-center border rounded-md overflow-hidden px-2 ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                            <button onClick={() => handleQuantityChange(quantity - 1)} className={`px-2 py-1 ${darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-dark-activeLink text-dark-primary'}`}>-</button>
                            <input
                                type="number"
                                placeholder="0"
                                id="quantity"
                                className={`bg-transparent p-2 text-center w-16 outline-none ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(Math.min(Number(e.target.value), 50))}
                                max={50}
                            />
                            <button onClick={() => handleQuantityChange(quantity + 1)} className={`px-2 py-1 ${darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-dark-activeLink text-dark-primary'}`}>+</button>
                        </div>
                    </div>
                </div>

                {quantity <= 0 ? (
                    <div className='w-full h-[90%] flex items-center justify-center'>
                        <p className='text-4xl'>Please Input Units Quantity</p>
                    </div>
                ) : (
                    <div className='max-h-[520px] overflow-y-auto py-6 px-8 w-full'>
                        <div className='grid grid-cols-2 gap-4 w-full'>
                            {serialNumbers.map((serial, index) => (
                                <div key={serial.serialNumber || index} className="flex flex-col mb-4 items-center justify-center bg-white p-4 border rounded-md">
                                    <label htmlFor={`serialNumber-${index}`} className="font-medium">Serial Number {index + 1}</label>

                                    {serialNumberImages[index] ? (
                                        <div>
                                            <img src={URL.createObjectURL(serialNumberImages[index])} alt={`Captured ${index + 1}`} className="w-full h-64 object-cover my-2" />
                                        </div>
                                    ) : (
                                        <div>
                                            <video
                                                ref={(el) => (videoRefs.current[index] = el)}
                                                id={`video-${index}`}
                                                className="w-full h-64 mb-2"
                                                autoPlay
                                            />
                                        </div>
                                    )}

                                    <div className='flex gap-4 items-center justify-center w-full'>
                                        <p className="w-[30%] flex items-center justify-center mb-2 h-full">SERIAL NUMBER</p>
                                        <input
                                            id={`serialNumber-${index}`}
                                            type="text"
                                            placeholder={`Serial Number ${index + 1}`}
                                            value={localInputs[index] !== undefined ? localInputs[index] : serial.serialNumber}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            className="border rounded-md p-2 mb-2 w-[70%]"
                                            disabled={editModes[index]}
                                        />
                                    </div>
                                    {serialNumberImages[index] ? (  
                                    <button onClick={() => handleReuploadImage(index)} className={`px-2 py-3 w-full bg-transparent border rounded-md mb-2 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Edit Image</button>

                                    ) : (
                                        <button onClick={() => captureImage(index)} className="bg-blue-500 hover:scale-95 text-white rounded-md p-2 px-6 flex items-center justify-center gap-2 cursor-pointer w-full mb-2"> <IoCameraOutline size={30} />Capture Image</button>

                                    )}

                                      {editModes[index] ? (
                                          <button onClick={() => handleEditClick(index)} className={`px-2 py-3 w-full bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Edit Serial Number</button>
                                      ) : (
                                          <button onClick={() => handleSaveClick(index)} className={`px-2 py-3 w-full rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Save Serial Number</button>
                                      )}

                                </div>
                            ))}
                        </div>
                    </div>
                )}


            {loading && (
                    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50`}>
                        <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'text-dark-textPrimary bg-dark-container'}`}>
                            <div className="flex justify-center items-center gap-2">
                                {/* Moving Loading Animation */}
                                <div className="relative w-8 h-8">
                                    <div className="absolute w-full h-full rounded-full border-4 border-t-4 border-white border-t-light-primary animate-spin"></div>
                                </div>
                                <span className="text-black">Please wait while the unit are being added...</span>
                            </div>
                        </div>
                    </div>
                )}


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
