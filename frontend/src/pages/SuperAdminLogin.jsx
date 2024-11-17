import React, { useState, useEffect } from 'react';  
import PasswordInput from '../components/PasswordInput';
import { RiUserLine } from 'react-icons/ri'; 
import loginLogo from '../assets/iControlLight.png'; 
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom'; 
import { FaUser } from "react-icons/fa";

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const { login, resetPassword, checkUserExistence, error } = useLogin();
    const [resetError, setResetError] = useState('');
    const [isAccountValid, setIsAccountValid] = useState(false); // Account validation flag
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('user');
    }, []);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await login(username, password, 'super-admin');
        if (response && response.role === 'super-admin') {
            navigate('/super-admin-dashboard');
        } else {
            setResetError('Invalid credentials');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const user = await checkUserExistence(username, email); // Ensure the user exists
            if (user) {
                if (user.role !== 'super-admin') {
                    setResetError('Password reset is only available for super-admins.');
                    setIsAccountValid(false); // Only allow reset for super-admins
                } else {
                    setIsAccountValid(true); // Account exists and is a super-admin
                    setResetError('');
                }
            } else {
                setResetError('Username or email not found');
                setIsAccountValid(false); // Account doesn't exist
            }
        } catch (error) {
            setResetError('An error occurred while checking the account. Please try again.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const response = await resetPassword(username, email, newPassword);
        if (response) {
            setForgotPassword(false);
            setResetError('');
            setUsername('');
            setEmail('');
            setNewPassword('');
            navigate('/super-admin-login');
        } else {
            setResetError('Failed to reset password');
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="absolute top-10 flex flex-col items-center">
                <img src={loginLogo} alt="Login Logo" className="w-32 mb-2" />
            </div>

            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {!forgotPassword ? (
                    <>
                        <h1 className="text-4xl font-bold text-gray-800 text-center">Login</h1>
                        <div className="flex justify-center">
                            <div className="flex items-center my-2 w-full">
                                <hr className="flex-grow h-[1px] bg-gray-300" />
                                <span className="flex-grow-0 mx-1 text-gray-500">As</span>
                                <hr className="flex-grow h-[1px] bg-gray-300" />
                            </div>
                        </div>
                        <div className="px-6 py-2 mb-4 font-bold rounded-full flex items-center justify-center gap-2 text-xl text-light-primary">
                            <FaUser />
                            Super Admin
                        </div>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-gray-700">Username</label>
                                <div className="flex items-center mt-1 border border-gray-300 rounded-lg p-2">
                                    <RiUserLine className="text-xl text-black" />
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter Username"
                                        className="w-full pl-3 bg-transparent text-sm outline-none text-black"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-gray-700">Password</label>
                                <PasswordInput
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {resetError && <p className="text-red-500 text-xs mt-1">{resetError}</p>}
                            <button
                                type="submit"
                                className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600"
                            >
                                Login
                            </button>
                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    className="text-blue-500 hover:underline"
                                    onClick={() => setForgotPassword(true)} // Switch to the reset password flow
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="text-4xl font-bold text-gray-800 text-center py-4">Reset Password</h1>
                        <form onSubmit={handleForgotPassword} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-gray-700">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter Username"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter Email"
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {resetError && <p className="text-red-500 text-xs mt-1">{resetError}</p>}
                            {!isAccountValid ? (
                                <>
                                    <button
                                        type="submit"
                                        className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600"
                                    >
                                        Check Account
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForgotPassword(false)} // Cancel and go back to login
                                        className="w-full py-3 text-white bg-gray-500 rounded-lg font-semibold hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <div>
                                    <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                                    <PasswordInput
                                        id="newPassword"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        onClick={handleResetPassword}
                                        className="w-full py-3 my-6 text-white bg-green-500 rounded-lg font-semibold hover:bg-green-600"
                                    >
                                        Reset Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForgotPassword(false)} // Cancel and go back to login
                                        className="w-full py-3 text-white bg-gray-500 rounded-lg font-semibold hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default SuperAdminLogin;
