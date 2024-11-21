import React, { useState, useEffect } from 'react';  
import PasswordInput from '../components/PasswordInput';
import { RiUserLine } from 'react-icons/ri'; 
import loginLogo from '../assets/iControlLight.png'; 
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import { LiaUserShieldSolid } from "react-icons/lia";

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [forgotPassword, setForgotPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, resetPassword, sendVerificationCode, verifyCode } = useLogin();
    const [isAccountValid, setIsAccountValid] = useState(false);
    const navigate = useNavigate();
    const [codeSent, setCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

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

    const handleLogin = async () => {
        setLoading(true);
        const response = await login(username, password, 'super-admin');
        setLoading(false);
        if (response) {
            if (response.role === 'super-admin') {
                toast.success('Login successful!');
                navigate('/super-admin-dashboard');
            }
        } else {
            toast.error('Invalid credentials');
        }
    };

    const handleForgotPassword = async () => {
        setLoading(true);
        const response = await sendVerificationCode(email);
        setLoading(false);
        if (response) {
            setCodeSent(true);
            toast.success('Verification code sent!');
        } else {
            toast.error('Failed to send verification code');
        }
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        const response = await verifyCode(email, verificationCode);
        setLoading(false);
        if (response?.success) {
            setIsAccountValid(true);
            toast.success('Code verified! You can now reset your password.');
        } else {
            toast.error(response?.message || 'Invalid verification code');
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !email) {
            toast.error('Please fill in all the fields');
            return;
        }
        setLoading(true);
        try {
            const response = await resetPassword(email, newPassword);
            setLoading(false);
            if (response) {
                toast.success('Password reset successful!');
                setForgotPassword(false);
                setUsername('');
                setEmail('');
                setNewPassword('');
                navigate('/super-admin-login');
            } else {
                toast.error(response?.message || 'Failed to reset password');
            }
        } catch (error) {
            setLoading(false);
            toast.error('An error occurred while resetting the password');
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100 flex-col text-black">
            <ToastContainer />
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
                            Super Admin
                        </div>
                    </>
                ) : (
                    <h1 className="text-4xl font-bold text-gray-800 text-center py-4">Reset Password</h1>
                )}

                {forgotPassword ? (
                    <div className="space-y-6 text-black">
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
                                        onClick={handleForgotPassword}
                                        className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600"
                                        disabled={loading}
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
                                            onClick={handleVerifyCode}
                                            className="w-full py-3 text-white bg-blue-500 rounded-lg font-semibold hover:bg-blue-600"
                                            disabled={loading}
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
                                    onClick={handleResetPassword}
                                    className="w-full py-3 text-white bg-green-500 rounded-lg font-semibold hover:bg-green-600"
                                    disabled={loading}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleCancel}
                            className="w-full py-3 text-white bg-gray-500 rounded-lg font-semibold hover:bg-gray-600 mt-4"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 text-black">
                        <div className="mb-4 flex flex-col items-start">
                           <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                            <div className="flex items-center border border-gray-300 rounded-lg w-full px-4">
                                <LiaUserShieldSolid className="text-gray-500 text-2xl" />
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
                                onClick={handleLogin}
                                className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <button
                                onClick={() => setForgotPassword(true)}
                                className="text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminLogin;
