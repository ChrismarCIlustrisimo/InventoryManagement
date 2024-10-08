// ProductModal.js
import React from 'react';
import Modal from '@mui/material/Modal'; // Adjust import based on your modal library
import { BiImages } from 'react-icons/bi';
import { AiOutlineUpload } from 'react-icons/ai';
import Button from '@mui/material/Button'; // Adjust import based on your button library

const ProductModal = ({
    openModal,
    handleCloseModal,
    currentProgress,
    quantity,
    handleQuantityChange,
    serialNumbers,
    serialNumberImages,
    localInputs,
    editModes,
    handleInputChange,
    handleEditClick,
    handleCheckClick,
    handleSerialNumberImageChange,
    upload,
    darkMode,
}) => {
    return (
        <Modal open={openModal} onClose={handleCloseModal} className={`flex items-center justify-center ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
            <div className={`w-[70%] h-[84%] bg-container rounded-md p-4 relative ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                <p className='text-3xl text-center mb-6 font-semibold'>Add New Product</p>
                {/* Progress Bar */}
                <div className='flex items-center justify-center'>
                    <div className="w-[50%] bg-gray-200 rounded h-2 mb-4">
                        <div className="bg-green-500 h-2 rounded" style={{ width: `${(currentProgress / quantity || 0) * 100}%` }} />
                    </div>
                </div>
                <div className='w-full flex gap-2 py-2'>
                    <div className='flex flex-col items-end justify-center w-full gap-2'>
                        <p htmlFor="quantity">Add Product Quantity</p>
                        <input
                            type='number'
                            placeholder='Quantity'
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
                            <div key={serial.serialNumber || index} className="flex flex-col mb-4 items-center justify-center bg-white p-4 border rounded-md">
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
                    <Button variant="contained" onClick={upload}>Submit</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ProductModal;
