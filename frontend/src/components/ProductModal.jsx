import React, { useEffect, useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import { AiOutlineCamera } from 'react-icons/ai';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCameraOutline } from "react-icons/io5";

const ProductModal = ({
    openModal,
    handleCloseModal,
    quantity,
    handleQuantityChange,
    serialNumbers,
    localInputs,
    editModes,
    handleInputChange,
    handleEditClick,
    handleCheckClick,
    handleSerialNumberImageChange,
    serialNumberImages,
    upload,
}) => {
    const { darkMode } = useAdminTheme();
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

    return (
        <Modal open={openModal} onClose={handleCloseModal} className={`flex items-center justify-center ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
            <div className={`w-full h-full flex flex-col items-center justify-start gap-4 bg-container rounded-md p-4 relative ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                <div className='w-full flex items-center justify-between gap-2 py-6 px-12'>
                    <p className='text-2xl text-center font-semibold'>Add New Product</p>
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
                    <div className='max-h-[520px] overflow-y-auto py-6 px-8 w-[80%]'>
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
                                        <button onClick={() => handleCheckClick(index)} className={`px-2 py-3 w-full rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Save Serial Number</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={`w-full absolute bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-8 py-2 border ${darkMode ? 'bg-light-container border-light-border' : 'bg-dark-container border-dark-border'}`}>
                <button onClick={handleCloseModal} className={`px-2 py-3 w-[100px] bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button>
                <button onClick={upload} className={`px-2 py-3 w-[100px] rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Save</button>
                </div>
            </div>
        </Modal>
    );
};

export default ProductModal;
