import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserTie, FaCashRegister } from 'react-icons/fa'; // Importing icons
import loginLogo from '../assets/iControlLight.png';
import { LiaUserTieSolid } from "react-icons/lia";

const FrontPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('user');
    }, []);

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100 flex-col">
            <div className="flex flex-col items-center">
                <img src={loginLogo} alt="Login Logo" className="w-32 mb-2" />
            </div>

            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-xl text-black font-semibold text-center mb-6">Choose Your Role</h2>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/super-admin-login')}
                        className="px-6 py-2 font-bold rounded-full flex items-center justify-center gap-2 border border-gray-300 bg-transparent text-gray-600 hover:bg-red-100 hover:text-red-600 transition duration-200"
                    >
                        <FaUserShield className="text-xl" /> Super Admin
                    </button>
                    <button
                        onClick={() => navigate('/admin-login')}
                        className="px-6 py-2 font-bold rounded-full flex items-center justify-center gap-2 border border-gray-300 bg-transparent text-gray-600 hover:bg-red-100 hover:text-red-600 transition duration-200"
                    >
                        <FaUserTie className="text-xl" /> Admin
                    </button>
                    <button
                        onClick={() => navigate('/cashier-login')}
                        className="px-6 py-2 font-bold rounded-full flex items-center justify-center gap-2 border border-gray-300 bg-transparent text-gray-600 hover:bg-red-100 hover:text-red-600 transition duration-200"
                    >
                        <FaCashRegister className="text-xl" /> Cashier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrontPage;
