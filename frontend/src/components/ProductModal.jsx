import React from 'react';
import Modal from '@mui/material/Modal';
import { BiImages } from 'react-icons/bi';
import { AiOutlineUpload } from 'react-icons/ai';
import { useAdminTheme } from '../context/AdminThemeContext';

const ProductModal = ({
    openModal,
    handleCloseModal,
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
}) => {
    const { darkMode } = useAdminTheme();
    
    return (
        <Modal open={openModal} onClose={handleCloseModal} className={`flex items-center justify-center ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
            <div className={`w-full h-full flex flex-col items-center justify-start gap-4 bg-container rounded-md p-4 relative ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                <div className='w-full flex items-center justify-between gap-2 py-6 px-12'>
                    <p className='text-2xl text-center font-semibold'>Add New Product</p>
                    {/* Quantity Input */}
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
                                placeholder='0'
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

                {/* Display message if quantity is less than or equal to 0 */}
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
                                            className="border rounded-md p-2 mb-2 w-[70%]"
                                            disabled={editModes[index]}
                                        />
                                    </div>
                                    <label htmlFor={`serialNumberImage-${index}`} className="bg-blue-500 hover:scale-95 text-white rounded-md p-2 px-6 flex items-center justify-start gap-2 cursor-pointer w-full mb-2">
                                        <AiOutlineUpload className='text-2xl' />
                                        {serialNumberImages[index] ? 'Change Image' : 'Upload Image'}
                                    </label>

                                    {editModes[index] ? (
                                        <button onClick={() => handleEditClick(index)} className={`px-2 py-3 w-full bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Edit</button>
                                    ) : (
                                        <button onClick={() => handleCheckClick(index)} className={`px-2 py-3 w-full rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Save</button>
                                    )}
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
                )}

                <div className={`w-full absolute bottom-0 left-0 right-0 flex items-center justify-end gap-4 px-8 py-2 border ${darkMode ? 'bg-light-container border-light-border' : 'bg-dark-container border-dark-border'}`}>
                    <button onClick={handleCloseModal} className={`px-2 py-3 w-[100px] bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button>
                    <button onClick={upload} className={`px-2 py-3 w-[100px] rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Submit</button>
                </div>
            </div>
        </Modal>
    );
};

export default ProductModal;
