import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';

const AddNotes = ({ onClose, rmaId }) => {
    const { darkMode } = useAdminTheme();
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        onClose(notes); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white shadow-lg rounded-lg p-6 w-[30%] relative flex flex-col gap-4 ${darkMode ? 'text-light-textPrimary' : ''}`}>
                <h2 className="text-2xl font-semibold mb-4">Add Notes to {rmaId}</h2>

                {/* Add an input or textarea for adding notes */}
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes here..."
                    className="border border-gray-300 rounded-md p-2 w-full h-28"
                />

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

export default AddNotes;
