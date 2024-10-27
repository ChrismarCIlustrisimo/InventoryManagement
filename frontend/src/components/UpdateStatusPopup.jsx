import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { toast, ToastContainer } from 'react-toastify';  // Importing toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Importing styles for the toast

const UpdateStatusPopup = ({ onClose, onUpdate }) => {
    const [newProcess, setNewProcess] = useState('');  // Initialize as an empty string
    const { darkMode } = useAdminTheme();

    const handleSubmit = () => {
        // Check if a valid process is selected
        if (!newProcess) {
            toast.error("Please select a valid status.");  // Use toast instead of alert
            return;
        }

        onUpdate(newProcess, 'Approved');
        toast.success("Status updated successfully!");  // Notify on successful update
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white shadow-lg rounded-lg p-6 w-[30%] relative flex flex-col gap-4 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                <h2 className="text-2xl font-semibold mb-4">Approved Action</h2>
                <div className='flex'>
                    <div className={`flex items-center justify-between w-full flex-col font-medium gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                        <select
                            id="process"
                            value={newProcess}
                            onChange={(e) => setNewProcess(e.target.value)}
                            className="border rounded px-4 py-2 w-full"
                        >
                            <option value="">Select Status</option>
                            <option value="Refund">Refund</option>
                            <option value="Replacement">Replacement</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4 w-full">
                    <button
                        className={`text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-2 
                        ${darkMode ? 'bg-light-primary' : 'bg-light-primary'} 
                        hover:bg-opacity-80 active:bg-opacity-90`}
                        onClick={handleSubmit}
                    >
                        Confirm
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
            <ToastContainer /> {/* Place the ToastContainer here */}
        </div>
    );
};

export default UpdateStatusPopup;
