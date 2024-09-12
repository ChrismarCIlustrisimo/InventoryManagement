import React, { useState, useEffect } from 'react';
import { useSignUp } from '../hooks/useSignup';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const addUser = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [role, setRole] = useState('user'); // Default role
    const { signup, error, loading } = useSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(username, password, name, contact, role);
    };

    const handleBackClick = () => {
        navigate('/profile');
      };
    

return (
<div className={`w-full h-full ${darkMode ? 'bg-light-BG' : 'bg-dark-BG'}`}>
   <div className={`pt-[70px] pt-4 h-full w-full flex flex-col items-center jusity-between`}>
      <div className='w-full h-[88%] flex flex-col items-center justify-center gap-4'>
          <h3 className='text-2xl font-semibold'>ADD USER</h3>
        <form onSubmit={handleSubmit} className={`p-4 rounded-lg shadow-lg w-[30%] flex flex-col gap-4 items-center justify-center ${darkMode ? 'bg-light-CARD text-light-TEXT' : 'bg-dark-CARD text-dark-TEXT'}`}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"  className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Password" className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`} />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`} />
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact" className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`} />
            <select value={role} onChange={(e) => setRole(e.target.value)} className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}>
                <option value="cashier">Cashier</option>
                <option value="admin">Admin</option> 
            </select>
            {error && <div className='mt-2 text-red-500'>{error}</div>}
        </form>
       </div>
       <div className={`px-4 py-6 border-t w-full flex items-center justify-end h-[12%] ${darkMode ? 'bg-light-CARD border-light-ACCENT' : 'bg-dark-CARD border-dark-ACCENT'}`}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleBackClick} className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-ACCENT text-light-ACCENT' : 'border-dark-ACCENT text-dark-ACCENT'}`}>Cancel</button>
          <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-ACCENT' : 'border-dark-ACCENT'}`}></div>
          <button disabled={loading} type="submit" className={`w-full p-2 bg-blue-600 rounded hover:bg-blue-500 ${darkMode ? 'text-light-TEXT bg-light-ACCENT' : 'text-dark-TEXT bg-dark-ACCENT'}`}>ADD USER</button>        
        </div>
      </div>
    </div>
</div>
);
};

export default addUser;
