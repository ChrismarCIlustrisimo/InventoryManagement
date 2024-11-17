import React, { useState, useEffect } from 'react';  
import PasswordInput from '../components/PasswordInput';
import { RiUserLine } from 'react-icons/ri'; 
import loginLogo from '../assets/iControlLight.png'; 
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom'; 
import { FaUser } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';  // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Import styles for toast

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const { login, resetPassword, checkUserExistence } = useLogin();
    const [isAccountValid, setIsAccountValid] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('user');
    }, []);

    const handleCancel = () => {
        setForgotPassword(false);
        setUsername('');
        setEmail('');
        setNewPassword('');
        setIsAccountValid(false); 
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await login(username, password, 'admin');
        if (response) {
            if (response.role === 'admin' || response.role === 'super-admin') {
                toast.success('Login successful!');  // Success toast on successful login
                navigate('/admin-dashboard');
            }
        } else {
            toast.error('Invalid credentials');  // Error toast for invalid credentials
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
    
        try {
            const user = await checkUserExistence(username, email);
            
            if (user) {
                if (user.role !== 'admin') {
                    setIsAccountValid(false);
                    toast.error('Password reset is only available for admins.');  // Error toast for non-admin users
                } else {
                    setIsAccountValid(true);
                    toast.info('Account found, you can reset the password now.');  // Info toast for valid account
                }
            } else {
                setIsAccountValid(false);
                toast.error('Username or email not found');  // Error toast for account not found
            }
        } catch (error) {
            toast.error('An error occurred while checking the account. Please try again.');  // Error toast on failure
        }
    };
    
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const response = await resetPassword(username, email, newPassword);
        if (response) {
            toast.success('Password reset successful!');  // Success toast on successful password reset
            setForgotPassword(false);
            setUsername('');
            setEmail('');
            setNewPassword('');
            navigate('/admin-login');
        } else {
            toast.error('Failed to reset password');  // Error toast on password reset failure
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100 flex-col">
            <div className=" flex flex-col items-center">
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
                            Admin
                        </div>
                    </>
                ) : (
                    <h1 className="text-4xl font-bold text-gray-800 text-center py-4">Reset Password</h1>
                )}

                {forgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6 text-black">
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
                        {!isAccountValid && (
                            <>
                            <button
                                type="submit"
                                className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600"
                            >
                                Check Account
                            </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full py-3 text-white bg-gray-500 rounded-lg font-semibold hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        {isAccountValid && (
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
                                    onClick={handleCancel}
                                    className="w-full py-3 text-white bg-gray-500 rounded-lg font-semibold hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className='flex flex-col ga-2'>
                            <div className='text-black'>
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
                            <div className='py-4'>
                                <label htmlFor="password" className="block text-gray-700">Password</label>
                                <PasswordInput
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

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
                                onClick={() => setForgotPassword(true)} // Shows the reset password flow
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default AdminLogin;
