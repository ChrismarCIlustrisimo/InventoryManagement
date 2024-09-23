// components/CustomerModal.js
import React from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';

const CustomerModal = ({ isOpen, onClose, customer, onUpdate }) => {
    if (!isOpen) return null;
    const { darkMode } = useAdminTheme();

    const handleUpdate = () => {
        const updatedCustomer = {
            name: document.getElementById('modalName').value,
            email: document.getElementById('modalEmail').value,
            phone: document.getElementById('modalPhone').value,
            address: document.getElementById('modalAddress').value,
        };
        onUpdate(updatedCustomer);
        onClose();
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}>
            <div className={`rounded-lg p-6 w-1/3 ${darkMode ? 'bg-light-container text-light-textPrimary' : 'bg-dark-container text-dark-textPrimary'}`}>
                <h2 className="text-2xl font-semibold mb-4 w-full text-center">Update Customer</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="modalName" className={`block mb-1 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Name</label>
                        <input id="modalName" type="text" defaultValue={customer.name} className={`border rounded-md p-2 w-full ${darkMode ? 'bg-light-bg border-light-primary' : 'bg-transparent border-dark-primary'}`} />
                    </div>
                    <div>
                        <label htmlFor="modalEmail" className={`block mb-1 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Email</label>
                        <input id="modalEmail" type="text" defaultValue={customer.email} className={`border rounded-md p-2 w-full ${darkMode ? 'bg-light-bg border-light-primary' : 'bg-transparent border-dark-primary'}`} />
                    </div>
                    <div>
                        <label htmlFor="modalPhone" className={`block mb-1 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Contact Number</label>
                        <input id="modalPhone" type="text" defaultValue={customer.phone} className={`border rounded-md p-2 w-full ${darkMode ? 'bg-light-bg border-light-primary' : 'bg-transparent border-dark-primary'}`} />
                    </div>
                    <div>
                        <label htmlFor="modalAddress" className={`block mb-1 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Address</label>
                        <input id="modalAddress" type="text" defaultValue={customer.address} className={`border rounded-md p-2 w-full ${darkMode ? 'bg-light-bg border-light-primary' : 'bg-transparent border-dark-primary'}`} />
                    </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <button onClick={onClose} className={`px-4 py-2 rounded ${darkMode ? 'text-white bg-red-500' : 'text-white bg-red-600'}`}>Cancel</button>
                    <button onClick={handleUpdate} className={`px-4 py-2 rounded ${darkMode ? 'text-white bg-blue-500' : 'text-white bg-blue-600'}`}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;
