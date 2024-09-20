import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

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
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const baseURL = "http://localhost:5555";

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
                setError('An unknown error occurred');
            });
    }, [userId]);

    const handleBackClick = () => {
        navigate('/profile');
    };

    const handleUpdateUser = () => {
        axios.put(`${baseURL}/user/${userId}`, { username, name, contact, role })
            .then(() => {
                navigate('/profile');
            })
            .catch(err => {
                console.error('Error updating user:', err.response ? err.response.data : err.message);
                setError('An unknown error occurred');
            });
    };

    const toggleChangePassword = async () => {
        if (isChangingPassword) {
            // Check if fields are filled
            if (!currentPassword || !password || !confirmPassword) {
                setError('All password fields must be filled.');
                return;
            }
            // Check if new passwords match
            if (password !== confirmPassword) {
                setError('New passwords do not match.');
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
                    setError('Current password is incorrect.');
                }
            } catch (error) {
                setError('Error validating current password: ' + (error.response ? error.response.data.error : error.message));
            }
        }
        setIsChangingPassword(prev => !prev);
    };
    

    const saveChanges = async (endpoint, data, successMessage, errorMessage) => {
        try {
            // Change from POST to PATCH
            const response = await axios.patch(`${baseURL}${endpoint}`, data);
            setMessage(successMessage);
            setError('');
            console.log(successMessage, response.data);
        } catch (error) {
            setError(errorMessage + (error.response ? error.response.data : error.message));
            setMessage('');
            console.error(errorMessage, error.response ? error.response.data : error.message);
        }
    };
    

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-BG text-light-TEXT' : 'bg-dark-BG text-dark-TEXT'}`}>
            <div className={`pt-4 h-full w-full flex flex-col items-center justify-between`}>
                <div className='w-full h-[88%] flex flex-col items-center justify-center gap-4'>
                    <h3 className='text-2xl font-semibold'>{showPasswordForm ? 'CHANGE PASSWORD' : 'UPDATE USER'}</h3>
                    <div className={`px-4 py-8 rounded-lg shadow-lg w-[30%] flex flex-col gap-4 items-center justify-center ${darkMode ? 'bg-light-CARD text-light-TEXT' : 'bg-dark-CARD text-dark-TEXT'}`}>
                        {showPasswordForm ? (
                            <>
                                <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                                    Current Password
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Current Password"
                                            className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </div>
                                    </div>
                                </label>
                                <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                                    New Password
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="New Password"
                                            className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </div>
                                    </div>
                                </label>
                                <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                                    Confirm Password
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm Password"
                                            className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </div>
                                    </div>
                                </label>
                                    {message && <p className='text-green-600'>{message}</p>}
                                    {error && <p className='text-red-600'>{error}</p>}
                                <div className='flex items-center justify-center gap-2'>
                                    <button
                                        onClick={togglePasswordForm}
                                        className={`px-4 py-2 rounded ${darkMode ? 'text-dark-TEXT bg-light-ACCENT' : 'text-light-TEXT bg-dark-ACCENT'}`}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={toggleChangePassword}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded ${darkMode ? 'text-dark-TEXT bg-light-ACCENT' : 'text-light-TEXT bg-dark-ACCENT'}`}
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                                />
                                <input
                                    type="text"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder="Contact"
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                                />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                                >
                                    <option value="cashier">Cashier</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {error && <p className='mt-2 text-red-500'>{error}</p>}
                                <button
                                    onClick={togglePasswordForm}
                                    className={`px-4 py-2 mt-4 rounded ${darkMode ? 'text-dark-TEXT bg-light-ACCENT' : 'text-light-TEXT bg-dark-ACCENT'}`}
                                >
                                    Change Password
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {!showPasswordForm && (
                <div className={`px-4 py-6 border-t w-full flex items-center justify-end h-[12%] ${darkMode ? 'bg-light-CARD border-light-ACCENT' : 'bg-dark-CARD border-dark-ACCENT'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-ACCENT text-light-ACCENT' : 'border-dark-ACCENT text-dark-ACCENT'}`}
                        >
                            Cancel
                        </button>
                        <div className="flex-grow border-l h-[38px]"></div>
                            <button
                                onClick={handleUpdateUser}
                                className={`w-full px-4 py-2 rounded ${darkMode ? 'text-dark-TEXT bg-light-ACCENT' : 'text-light-TEXT bg-dark-ACCENT'}`}
                            >
                                UPDATE USER
                            </button>
                    </div>
                </div>
               )}
            </div>
        </div>
    );
};

export default UpdateUser;
