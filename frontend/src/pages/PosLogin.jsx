import React, { useState, useEffect } from 'react';  
import PasswordInput from '../components/PasswordInput';
import { RiUserLine } from 'react-icons/ri'; 
import loginLogo from '../assets/iControlLight.png'; 
import { useLogin } from '../hooks/useLogin';
import { FaUser } from "react-icons/fa";
import { PiCashRegisterFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom'; 

const PosLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    const [activeButton, setActiveButton] = useState('admin');

    useEffect(() => {
        localStorage.removeItem('user');
    }, []);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password, activeButton);
    };

    const handleButtonClick = (role) => {
        setActiveButton(role);
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            {/* Logo placed outside the container */}
            <div className="absolute top-10 flex flex-col items-center">
                <img src={loginLogo} alt="Login Logo" className="w-32 mb-2" />
            </div>

            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-800 text-center">Login</h1>

                {/* Role Selection */}
                <div className="flex justify-center">
                    <div className="flex items-center my-6 w-full">
                        <hr className='flex-grow h-[1px] bg-gray-300' />
                        <span className="flex-grow-0 mx-1 text-gray-500">As</span>
                        <hr className='flex-grow h-[1px] bg-gray-300' />
                    </div>
                </div>
                <div className="flex flex-col justify-center mb-6 gap-4">
                    <button 
                        className={`px-6 py-2 font-bold rounded-full flex items-center justify-center gap-2 border border-gray-300 ${activeButton === 'admin' ? 'bg-red-100 text-red-600' : 'bg-transparent text-gray-600'}`} 
                        onClick={() => handleButtonClick('admin')}>
                        <FaUser />
                        Admin
                    </button>
                    <button 
                        className={`px-6 py-2 font-semibold rounded-full flex items-center justify-center gap-2 border border-gray-300 ${activeButton === 'cashier' ? 'bg-red-100 text-red-600' : 'bg-transparent text-gray-600'}`} 
                        onClick={() => handleButtonClick('cashier')}>
                        <PiCashRegisterFill />
                        Cashier
                    </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-gray-700">Username</label>
                        <div className="flex items-center mt-1 border border-gray-300 rounded-lg p-2">
                            <RiUserLine className="text-xl text-gray-500" />
                            <input 
                                id="username" 
                                type="text" 
                                placeholder="Enter Username" 
                                className="w-full pl-3 bg-transparent text-sm outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <button 
                        type="submit" 
                        className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PosLogin;
