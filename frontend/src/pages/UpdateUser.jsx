import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import { API_DOMAIN } from '../utils/constants';

const UpdateUser = () => {
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const { userId } = useParams();
    
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [role, setRole] = useState('cashier');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const baseURL = API_DOMAIN;

    useEffect(() => {
        axios.get(`${baseURL}/user/${userId}`)
            .then(res => {
                setUsername(res.data.username);
                setName(res.data.name);
                setContact(res.data.contact);
                setRole(res.data.role);
            })
            .catch(err => {
                console.error('Error fetching user:', err.response ? err.response.data : err.message);
            });
    }, [userId]);

    const handleBackClick = () => {
        navigate('/profile');
    };

    const handleUpdateUser = () => {
        axios.patch(`${baseURL}/user/${userId}`, { username, name, contact, role })
            .then(() => {
                toast.success('User updated successfully!'); // Success toast
                setTimeout(() => {
                    navigate(-1); // Delay navigation by 3 seconds
                }, 3000); 
            })
            .catch(err => {
                console.error('Error updating user:', err.response ? err.response.data : err.message);
                toast.error('Error updating user.'); // Error toast
            });
    };

    const toggleChangePassword = async () => {
        if (isChangingPassword) {
            // Check if fields are filled
            if (!currentPassword || !password || !confirmPassword) {
                toast.error('All password fields must be filled.'); // Show error toast
                return;
            }
            // Check if new passwords match
            if (password !== confirmPassword) {
                toast.error('New passwords do not match.'); // Show error toast
                return;
            }
    
            try {
                // Validate current password
                const response = await axios.post(`${baseURL}/user/${userId}/validate-password`, { currentPassword });
                if (response.data.valid) {
                    // Proceed to change password
                    await saveChanges(`/user/${userId}/change-password`, { currentPassword, newPassword: password },
                        'Password changed successfully.', 
                        'Error changing password:');
                } else {
                    toast.error('Current password is incorrect.'); // Show error toast
                }
            } catch (error) {
                toast.error('Error validating current password: ' + (error.response ? error.response.data.error : error.message)); // Show error toast
            }
        }
        setIsChangingPassword(prev => !prev);
    };
    

    const saveChanges = async (endpoint, data, successMessage, errorMessage) => {
        try {
            const response = await axios.patch(`${baseURL}${endpoint}`, data);
            setMessage(successMessage);
            toast.success(successMessage); // Show success toast
        } catch (error) {
            setMessage('');
            toast.error(errorMessage); // Show error toast
        }
    };
    
    

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg text-light-textPrimary' : 'bg-dark-bg text-dark-textPrimary'}`}>
            <div className={`pt-4 h-full w-full flex flex-col items-center justify-between`}>
                <div className='w-full h-[88%] flex flex-col items-center justify-center gap-4'>
                    <h3 className='text-2xl font-semibold'>{showPasswordForm ? 'CHANGE PASSWORD' : 'UPDATE USER'}</h3>
                    <div className={`px-4 py-8 rounded-lg shadow-lg w-[30%] flex flex-col gap-4 items-center justify-center ${darkMode ? 'bg-light-CARD text-light-textPrimary' : 'bg-dark-CARD text-dark-textPrimary'}`}>
                        {showPasswordForm ? (
                            <>
                                <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                    Current Password
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Current Password"
                                            className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </div>
                                    </div>
                                </label>
                                <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                    New Password
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="New Password"
                                            className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </div>
                                    </div>
                                </label>
                                <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                    Confirm Password
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm Password"
                                            className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </div>
                                    </div>
                                </label>
                                <div className='flex items-center justify-center gap-2'>
                                    <button
                                        onClick={togglePasswordForm}
                                        className={`px-4 py-2 rounded ${darkMode ? 'text-dark-textPrimary bg-light-primary' : 'text-light-textPrimary bg-dark-primary'}`}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={toggleChangePassword}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded ${darkMode ? 'text-dark-textPrimary bg-light-primary' : 'text-light-textPrimary bg-dark-primary'}`}
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-full">
                                <label
                                    htmlFor="username"
                                    className={`block mb-2 text-sm font-medium ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                />
                                </div>

                                <div className="w-full">
                                <label
                                    htmlFor="name"
                                    className={`block mb-2 text-sm font-medium ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                />
                                </div>

                                <div className="w-full">
                                <label
                                    htmlFor="contact"
                                    className={`block mb-2 text-sm font-medium ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
                                >
                                    Contact
                                </label>
                                <input
                                    id="contact"
                                    type="text"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder="Contact"
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                />
                                </div>

                                <div className="w-full">
                                <label
                                    htmlFor="role"
                                    className={`block mb-2 text-sm font-medium ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
                                >
                                    Role
                                </label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="admin">Admin</option>
                                </select>
                                </div>

                                <button
                                    onClick={togglePasswordForm}
                                    className={`px-4 py-2 mt-4 rounded ${darkMode ? 'text-dark-textPrimary bg-light-primary' : 'text-light-textPrimary bg-dark-primary'}`}
                                >
                                    Change Password
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {!showPasswordForm && (
                <div className={`px-4 py-6 border-t w-full flex items-center justify-end h-[12%] ${darkMode ? 'bg-light-CARD border-light-primary' : 'bg-dark-CARD border-dark-primary'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                        >
                            Cancel
                        </button>
                        <div className="flex-grow border-l h-[38px]"></div>
                            <button
                                onClick={handleUpdateUser}
                                className={`w-full px-4 py-2 rounded ${darkMode ? 'text-dark-textPrimary bg-light-primary' : 'text-light-textPrimary bg-dark-primary'}`}
                            >
                                UPDATE USER
                            </button>
                    </div>
                </div>
               )}
            </div>
            <ToastContainer /> {/* Toast container to show notifications */}

        </div>
    );
};

export default UpdateUser;
