import React, { useState, useEffect } from 'react';
import PasswordInput from '../components/PasswordInput';
import loginLogo from '../assets/iControlLight.png';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PiCashRegister } from "react-icons/pi";
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { API_DOMAIN } from '../utils/constants';

const CashierLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isAccountValid, setIsAccountValid] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state
    const { login, resetPassword, sendVerificationCode, verifyCode } = useLogin();
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const baseURL = API_DOMAIN;

    useEffect(() => {
        localStorage.removeItem('user');
    }, []);

    const handleCancel = () => {
        setForgotPassword(false);
        setUsername('');
        setEmail('');
        setNewPassword('');
        setIsAccountValid(false);
        setVerificationCode('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading state
        const response = await login(username, password, 'cashier');
        setLoading(false); // End loading state
        if (response && response.role === 'cashier') {
            toast.success("Login successful!");
            navigate('/cashier-dashboard');
        } else {
            toast.error("Invalid credentials");
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading state
        const response = await sendVerificationCode(email);
        setLoading(false); // End loading state
        if (response) {
            setCodeSent(true);
            toast.success('Verification code sent!');
        } else {
            toast.error('Failed to send verification code');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading state
        const response = await verifyCode(email, verificationCode);
        setLoading(false); // End loading state
        if (response?.success) {
            setIsAccountValid(true);
            toast.success('Code verified! You can now reset your password.');
        } else {
            toast.error(response?.message || 'Invalid verification code');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
    
        if (!newPassword || !email) {
            toast.error('Please fill in all the fields');
            return;
        }
    
        setLoading(true); // Start loading state
    
        try {
            const response = await resetPassword(email, newPassword);
            setLoading(false); // End loading state
    
            if (response) {
                toast.success('Password reset successful!');
                setForgotPassword(false);
                setEmail('');
                setNewPassword('');
                navigate('/cashier-login');
    
                // Log audit data for password reset
                const auditData = {
                    user: 'N/A', // Replace with the logged-in user's name
                    action: 'Update',
                    module: 'User',
                    event: `Reset password for user with email\n ${email}`,
                    previousValue: 'N/A', // We cannot log the previous password
                    updatedValue: 'N/A', // We cannot log the new password
                };
    
                // Send audit log data to the server
                await axios.post(`${baseURL}/audit`, auditData);
    
            } else {
                toast.error('Failed to reset password');
            }
        } catch (error) {
            setLoading(false); // End loading state
            toast.error('Error resetting password: ' + (error.response ? error.response.data.error : error.message));
        }
    };
    

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100 flex-col text-black">
            <ToastContainer />
            <div className="flex flex-col items-center">
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
                            Cashier
                        </div>
                    </>
                ) : (
                    <h1 className="text-4xl font-bold text-gray-800 text-center py-4">Reset Password</h1>
                )}

                {forgotPassword ? (
                    <form onSubmit={codeSent ? handleVerifyCode : handleForgotPassword} className="space-y-6 text-black">
                        {!isAccountValid && (
                            <>
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
                                {!codeSent && (
                                    <button
                                        type="submit"
                                        className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600"
                                        disabled={loading} // Disable button when loading
                                    >
                                        {loading ? 'Sending...' : 'Send Verification Code'}
                                    </button>
                                )}
                                {codeSent && (
                                    <>
                                        <div>
                                            <label htmlFor="verificationCode" className="block text-gray-700">Verification Code</label>
                                            <input
                                                id="verificationCode"
                                                type="text"
                                                placeholder="Enter Code"
                                                className="w-full border border-gray-300 rounded-lg p-2"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 text-white bg-blue-500 rounded-lg font-semibold hover:bg-blue-600"
                                            disabled={loading} // Disable button when loading
                                        >
                                            {loading ? 'Verifying...' : 'Verify Code'}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        {isAccountValid && (
                            <>
                                <div>
                                    <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                                    <PasswordInput
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleResetPassword}
                                    className="w-full py-3 text-white bg-green-500 rounded-lg font-semibold hover:bg-green-600"
                                    disabled={loading} // Disable button when loading
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full py-3 text-white bg-gray-500 rounded-lg font-semibold hover:bg-gray-600 mt-4"
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6 text-black">
                        <div className="mb-4 flex flex-col items-start">
                           <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                            <div className="flex items-center border border-gray-300 rounded-lg w-full px-4">
                                <PiCashRegister className="text-gray-500 text-2xl" />
                                <input
                                id="username"
                                type="text"
                                placeholder="Enter Username"
                                className="w-full p-2 rounded-lg border-0 focus:outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <PasswordInput
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-4 justify-between items-center">
                            <button
                                type="submit"
                                className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600"
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setForgotPassword(true)}
                                className="text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CashierLogin;
