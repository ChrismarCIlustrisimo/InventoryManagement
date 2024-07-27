import React, { useState } from 'react';
import PasswordInput from '../components/PasswordInput';
import { RiUserLine, RiLockPasswordLine } from 'react-icons/ri'; // Importing user and padlock icons from react-icons
import loginImage from '../assets/loginImage.png'; 
import loginLogo from '../assets/iControlLoginLogo.png'; 
import { useLogin } from '../hooks/useLogin';
import { FaUser } from "react-icons/fa";
import { useTheme } from '../context/ThemeContext';
import { PiCashRegisterFill } from "react-icons/pi";



const PosLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    const { darkMode } = useTheme(); // Access darkMode from context


    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password); // Use `email` instead of `username`
    };
    return (
        <div className={`flex items-center justify-center flex-col w-full h-[100%] ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG'}`}>
                    <div className="flex justify-between w-[35%] py-4 h-[10%] font-bold" >
                        <button className={`${darkMode ? 'bg-light-CARD text-light-TEXT' : 'dark:bg-dark-CARD dark:text-dark-TEXT'} w-[48%] rounded-[15px] flex items-center justify-center gap-2`}>
                             <FaUser className={`${darkMode ? 'text-light-ACCENT' : 'dark:text-dark-ACCENT'}`}/>
                             Admin
                            </button>
                        <button className={`${darkMode ? 'bg-light-CARD text-light-TEXT' : 'dark:bg-dark-CARD dark:text-dark-TEXT'} w-[48%] rounded-[15px] flex items-center justify-center gap-2`}>
                            <PiCashRegisterFill className={`${darkMode ? 'text-light-ACCENT' : 'dark:text-dark-ACCENT'}`} />
                            Cashier
                        </button>
                    </div>
            <div className={`flex items-center justify-center w-[35%] h-[80%] flex-col px-11 rounded-[20px] ${darkMode ? 'bg-light-CARD text-light-TEXT' : 'dark:bg-dark-CARD dark:text-dark-TEXT'} `}>
                <img src={loginLogo} alt="Login" className='w-[30%] my-4' />
                <h1 className={`my-4 text-[40px] ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT' }`}>Welcome <br />To <span className='font-bold'>iControl</span></h1>
                <div className='py-10 w-[100%]'>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="username" className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Username</label>
                        <div className={`pl-4 w-[100%] input-box flex gap-1 items-center rounded-xl p-0 mb-6 mt-2 border ${darkMode ? 'border-dark-ACCENT' : 'border-light-ACCENT'}`}>
                        <RiUserLine className="text-lg" />
                            <input 
                                type='text' 
                                placeholder='Username' 
                                className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        
                        <label htmlFor="password" className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Password</label>
                        <PasswordInput 
                            placeholder='Password' 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className='mb-2' 
                        />
                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                        <button type="submit" className={`w-full mt-8 py-4 ${darkMode ? 'dark:text-dark-TEXT bg-light-ACCENT' : 'text-light-TEXT dark:bg-dark-ACCENT'} hover:bg-opacity-[0.6]  rounded-xl font-semibold`}>
                            Login
                        </button>
                 </form>
                </div>
            </div>
        </div>
    );
};

export default PosLogin;
