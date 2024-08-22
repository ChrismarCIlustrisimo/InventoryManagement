import React, { useState, useEffect } from 'react';  
import PasswordInput from '../components/PasswordInput';
import { RiUserLine, RiLockPasswordLine } from 'react-icons/ri'; 
import loginLogo from '../assets/iControlLoginLogo.png'; 
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
        await login(email, password, activeButton); // Include role in login
    };

    const handleButtonClick = (role) => {
        setActiveButton(role); // Update activeButton state based on the role
    };

    return (
        <div className="flex items-center justify-center flex-col w-full h-[100%] bg-dark-BG">
            <div className="flex justify-between w-[35%] py-4 h-[10%] font-bold">
                <button className={`bg-dark-CARD w-[48%] rounded-[15px] flex items-center justify-center gap-2 ${activeButton === 'admin' ? 'border-2 border-dark-ACCENT' : ''}`} onClick={() => handleButtonClick('admin')}>
                    <FaUser className="text-dark-ACCENT" />
                    Admin
                </button>
                <button className={`bg-dark-CARD w-[48%] rounded-[15px] flex items-center justify-center gap-2 ${activeButton === 'cashier' ? 'border-2 border-dark-ACCENT' : ''}`} onClick={() => handleButtonClick('cashier')}>
                    <PiCashRegisterFill className="text-dark-ACCENT" />
                    Cashier
                </button>
            </div>
            <div className="flex items-center justify-center w-[35%] h-[80%] flex-col px-11 rounded-[20px] bg-dark-CARD text-dark-TEXT">
                <img src={loginLogo} alt="Login" className='w-[30%] my-4' />
                <h1 className="my-4 text-[40px] text-dark-TEXT">Welcome <br />To <span className='font-bold'>iControl</span></h1>
                <div className='py-10 w-[100%]'>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="username" className="text-dark-TEXT">Username</label>
                        <div className="pl-4 w-[100%] input-box flex gap-1 items-center rounded-xl p-0 mb-6 mt-2 border border-dark-ACCENT">
                            <RiUserLine className="text-lg" />
                            <input
                                id='username' 
                                type='text' 
                                placeholder='Username' 
                                className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        
                        <label htmlFor="password" className="text-dark-TEXT">Password</label>
                        <PasswordInput 
                            id="password"
                            placeholder='Password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className='mb-2' 
                        />
                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                        <button type="submit" className="w-full mt-8 py-4 text-dark-TEXT bg-dark-ACCENT hover:bg-opacity-[0.6] rounded-xl font-semibold">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PosLogin;
