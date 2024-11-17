import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginLogo from '../assets/iControlLight.png';

const FrontPage = () => {
    const navigate = useNavigate();

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
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transform transition-transform duration-200 hover:scale-110"
                    >
                        Super Admin Login
                    </button>
                    <button
                        onClick={() => navigate('/admin-login')}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transform transition-transform duration-200 hover:scale-110"
                    >
                        Admin Login
                    </button>
                    <button
                        onClick={() => navigate('/cashier-login')}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transform transition-transform duration-200 hover:scale-110"
                    >
                        Cashier Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrontPage;
