import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPersonCircle } from 'react-icons/bs';
import ConfirmationDialog from './ConfirmationDialog'; // Adjust if necessary
import AdminSearchBar from './adminSearchBar';
import { useAdminTheme } from '../context/AdminThemeContext'; // Import context
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Import the required CSS

const ArchivedUsers = () => {
    const { darkMode } = useAdminTheme(); // Access darkMode from context
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
    const [userToRestore, setUserToRestore] = useState(null);
    const baseURL = "http://localhost:5555";

    const getIconColor = (role) => {
        switch (role) {
            case 'super admin':
                return darkMode ? 'text-blue-600' : 'text-blue-400';  // Color for super admin
            case 'admin':
                return darkMode ? 'text-red-600' : 'text-red-400';  // Color for admin
            case 'cashier':
                return darkMode ? 'text-green-600' : 'text-green-400';  // Color for cashier
            default:
                return darkMode ? 'text-gray-600' : 'text-gray-400';  // Default color for other roles
        }
    };
    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch all archived users
                const response = await axios.get(`${baseURL}/user?archived=true`); // Pass archived=true for archived users
                setUsers(response.data);  // Set all fetched users
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
    
        fetchUsers();
    }, []);  // Empty dependency array means this runs only once when the component mounts
    
    

    // Handle restore button click
    const handleRestoreUser = (userId) => {
        setUserToRestore(userId); // Set the user to restore
        setIsRestoreDialogOpen(true); // Open the confirmation dialog
    };

    // Confirm the restoration of the user
    const handleConfirmRestore = async () => {
        if (userToRestore) {
            try {
                // Send PATCH request to restore the user
                await axios.patch(`${baseURL}/user/${userToRestore}/restore`);
                setUsers(users.filter(user => user._id !== userToRestore)); // Remove the restored user from the list
                toast.success('User restored successfully!');  // Toast on success
                console.log('Restored user', userToRestore);
            } catch (error) {
                toast.error('Error restoring user!');  // Toast on error
                console.error('Error restoring user:', error);
            }
        }
        setIsRestoreDialogOpen(false); // Close the dialog after confirming
    };

    // Cancel the restoration
    const handleCancelRestore = () => {
        setUserToRestore(null);
        setIsRestoreDialogOpen(false); // Close the dialog
    };

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between'>
                <p className={`text-4xl w-[50%] ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Archived Users</p>
                <div className='w-full flex justify-end gap-4 my-4'>
                    <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search Archived User by name'} />
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <div className={`w-full max-h-[480px] overflow-auto rounded-lg ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                    <table className='w-full border-collapse'>
                        <thead className={`sticky top-0 rounded-lg py-6 border-b ${darkMode ? 'border-light-primary bg-light-container text-light-textPrimary' : 'border-dark-primary bg-dark-container text-dark-textPrimary'}`}>
                            <tr>
                                <th style={{ width: '40%' }} className={`p-2 py-4 text-left`}>NAME</th>
                                <th style={{ width: '20%' }} className={`p-2 py-4 text-center`}>ROLE</th>
                                <th style={{ width: '20%' }} className={`p-2 py-4 text-center`}>CONTACT</th>
                                <th style={{ width: '20%' }} className={`p-2 py-4 text-center`}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody className='h-full'>
                            {users
                                .filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())) // Apply search filter
                                .map((user) => (
                                    <tr key={user._id} className={`border-b ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}>
                                        <td style={{ width: '50%' }} className={`p-2 py-4 flex gap-4 items-center text-left ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                            <BsPersonCircle className={`w-10 h-10 ${getIconColor(user.role)}`} />
                                            <p>{user.name}</p>
                                        </td>
                                        <td style={{ width: '20%' }} className={`p-2 py-4 text-center ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{user.role}</td>
                                        <td style={{ width: '20%' }} className={`p-2 py-4 text-center ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{user.contact}</td>
                                        <td style={{ width: '20%' }} className='text-center gap-4'>
                                            <button
                                                className={`px-4 py-2 rounded-md font-semibold mr-4 transform transition-transform duration-150 ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'} hover:scale-105`}
                                                onClick={() => handleViewUserClick(user._id)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className={`px-4 py-2 rounded-md font-semibold transform transition-transform duration-150 ${darkMode ? 'bg-green-500' : 'bg-green-600'}`}
                                                onClick={() => handleRestoreUser(user._id)}
                                            >
                                                Restore
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Dialog for Restoring User */}
            <ConfirmationDialog
                isOpen={isRestoreDialogOpen}
                onConfirm={handleConfirmRestore}
                onCancel={handleCancelRestore}
                message="Are you sure you want to restore this user?"
            />

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default ArchivedUsers;
