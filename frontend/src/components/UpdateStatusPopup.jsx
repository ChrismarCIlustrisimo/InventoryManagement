import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UpdateStatusPopup = ({ onClose, rmaId, currentStatus, onUpdate }) => {
    const [newStatus, setNewStatus] = useState(currentStatus);
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = () => {
        onUpdate(newStatus);
        onClose();
    };


    const getStatusStyles = (status) => {
        switch (status) {
            case 'Approved':
                return {
                    textClass: 'text-[#14AE5C]',
                    bgClass: 'bg-[#CFF7D3]', 
                };
            case 'Pending':
                return {
                    textClass: 'text-[#BF6A02]',
                    bgClass: 'bg-[#FFF1C2]',
                };
            case 'In Progress':
                return {
                    textClass: 'text-[#007BFF]',
                    bgClass: 'bg-[#C2D7FF]', 
                };
            case 'Completed':
                return {
                    textClass: 'text-[#8E8E93]',
                    bgClass: 'bg-[#E5E5EA]',
                };
            default:
                return {
                    textClass: 'text-[#8E8E93]',
                    bgClass: 'bg-[#E5E5EA]',
                };
        }
    };
    const { textClass, bgClass } = getStatusStyles(currentStatus);


    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
            <div className={`bg-white shadow-lg rounded-lg p-6 w-[30%] relative flex flex-col gap-4 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} `}>
                <h2 className="text-2xl font-semibold mb-4">Update RMA Status</h2>
                <div className='flex'>
                    <div className={`flex items-center justify-between w-[40%] flex-col font-medium gap-4 pb-2 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                        <p className="font-medium w-full ">CURRENT STATUS</p>
                        <p className="font-medium w-full ">NEW STATUS</p>
                    </div>
                    <div className={`flex items-center justify-between w-[60%] flex-col font-medium  gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                        <p className='w-full'>
                            <span className={`p-2 rounded-md ${textClass} ${bgClass}`}>{currentStatus}</span>
                        </p>
                        <select
                            id="status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border rounded px-4 py-2 w-full"
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 w--full">
                    <button
                        className={`text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-2 
                        ${darkMode ? 'bg-light-primary' : 'bg-light-primary'} 
                        hover:bg-opacity-80 active:bg-opacity-90`}
                        onClick={() => handleSubmit()}
                    >
                        Update
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md flex w-full items-center justify-center gap-2 border 
                         ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-light-primary'} 
                          hover:bg-opacity-10 active:bg-opacity-20`}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateStatusPopup;
