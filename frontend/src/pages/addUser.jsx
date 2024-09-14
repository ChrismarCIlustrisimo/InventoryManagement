import React, { useState } from 'react';
import { useSignUp } from '../hooks/useSignup';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AddUser = () => {
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [role, setRole] = useState('cashier');
    const [error, setError] = useState('');
    const { signup, loading } = useSignUp();
    const { setActiveButton } = useAppContext();  // Use context here

    const handleBackClick = () => {
        navigate('/profile');
    };

    const handleAddUser = async () => {
        setError('');
    
        if (!username || !password || !name || !contact) {
            setError('All fields are required.');
            return;
        }
    
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long, include a capital letter, a number, and a symbol.');
            return;
        }
    
        try {
            await signup({ username, password, name, contact, role });
            localStorage.setItem('nextView', 'users'); // Set next view in local storage
            navigate('/profile');
        } catch (error) {
            setError(error.message || 'Failed to add user');
        }
    };
    
  

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-BG text-light-TEXT' : 'bg-dark-BG text-dark-TEXT'}`}>
        <div className={`pt-[70px] pt-4 h-full w-full flex flex-col items-center justify-between`}>
            <div className='w-full h-[88%] flex flex-col items-center justify-center gap-4'>
                <h3 className='text-2xl font-semibold'>ADD USER</h3>
                <div className={`px-4 py-8 rounded-lg shadow-lg w-[30%] flex flex-col gap-4 items-center justify-center ${darkMode ? 'bg-light-CARD text-light-TEXT' : 'bg-dark-CARD text-dark-TEXT'}`}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                    />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                    />
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Contact"
                        className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}
                    >
                        <option value="cashier">Cashier</option>
                        <option value="admin">Admin</option>
                    </select>
                    {error && <p className='mt-2 text-red-500'>{error}</p>}
                </div>
            </div>
            <div className={`px-4 py-6 border-t w-full flex items-center justify-end h-[12%] ${darkMode ? 'bg-light-CARD border-light-ACCENT' : 'bg-dark-CARD border-dark-ACCENT'}`}>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleBackClick}
                        className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-ACCENT text-light-ACCENT' : 'border-dark-ACCENT text-dark-ACCENT'}`}
                    >
                        Cancel
                    </button>
                    <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}></div>
                    <button
                        disabled={loading}
                        onClick={handleAddUser}
                        className={`w-full px-4 py-2 rounded ${darkMode ? 'text-dark-TEXT bg-light-ACCENT' : 'text-light-TEXT bg-dark-ACCENT'}`}
                    >
                        ADD USER
                    </button>
                </div>
            </div>
        </div>
    </div>
);

};

export default AddUser;
