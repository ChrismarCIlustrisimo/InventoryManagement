import React from 'react';
import { getInitials } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';

const ProfileInfo = () => {
    const navigate = useNavigate(); // Call useNavigate as a function
    const { logout } = useLogout(); // Import the logout hook from useLogout.js file

    const onLogout = () => {
        // Handle logout logic here
        console.log('Logging out...');
        logout();
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className='flex items-center gap-3'>
            <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
                {getInitials("John William")}
            </div>
            <div>
                <p className='text-sm font-medium'>John William</p>
                <button className='text-sm text-red-500 underline' onClick={onLogout}>
                    Log out
                </button>
            </div>
        </div>
    );
};

export default ProfileInfo;
