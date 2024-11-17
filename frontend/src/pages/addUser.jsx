import React, { useState } from 'react'; 
import { useSignUp } from '../hooks/useSignup';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'; // Import icons
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS for toastify
import { ToastContainer } from 'react-toastify';

const AddUser = () => {
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState(''); // State for email
    const [role, setRole] = useState('cashier');
    const [error, setError] = useState('');
    const { signup, loading } = useSignUp();
    const { setActiveButton } = useAppContext();  // Use context here
    const [isShowPassword, setIsShowPassword] = useState(false); // State for showing password

    const handleBackClick = () => {
        navigate('/profile');
    };

    const handleAddUser = async () => {
        // Reset error before processing
        setError('');
      
        if (!username || !password || !name || !contact || !email) {
            toast.error('All fields are required.');
            return;
        }
    
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email regex
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 8 characters long, include a capital letter, a number, and a symbol.');
            return;
        }
    
        try {
            await signup({ username, password, name, contact, email, role }); // Pass email here
            // Show success toast
            toast.success('User successfully created!');
            // Wait for 3 seconds before navigating
            setTimeout(() => {
                localStorage.setItem('nextView', 'users');
                navigate('/profile');
            }, 3000);
        } catch (error) {
            toast.error(error.message || 'Failed to add user');
        }
    };

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg text-light-textPrimary' : 'bg-dark-bg text-dark-textPrimary'}`}>
            <div className={`pt-[70px] h-full w-full flex flex-col items-center justify-between`}>
                <div className='w-full h-[88%] flex flex-col items-center justify-center gap-4'>
                    <h3 className='text-2xl font-semibold'>ADD USER</h3>
                    <div className={`px-4 py-8 rounded-lg shadow-lg w-[30%] flex flex-col gap-4 items-center justify-center ${darkMode ? 'bg-light-CARD text-light-textPrimary' : 'bg-dark-CARD text-dark-textPrimary'}`}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                        />
                        <div className="relative w-full">
                            <input
                                type={isShowPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword}>
                                {isShowPassword ? (
                                    <FaRegEyeSlash size={22} className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`} />
                                ) : (
                                    <FaRegEye size={22} className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`} />
                                )}
                            </div>
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                        />
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Contact"
                            className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Email field
                            placeholder="Email"
                            className={`w-full border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={`w-full border rounded-md p-2 bg-transparent 
                                ${darkMode ? 'bg-light-bg text-light-textPrimary border-light-primary' : 'dark:bg-dark-bg dark:text-dark-textPrimary dark:border-dark-primary'}`}
                        >
                            <option value="cashier">Cashier</option>
                            <option value="admin">Admin</option>
                        </select>

                        {error && <p className='mt-2 text-red-500'>{error}</p>}
                    </div>
                </div>
                <div className={`px-4 py-6 border-t w-full flex items-center justify-end h-[12%] ${darkMode ? 'bg-light-CARD border-light-primary' : 'bg-dark-CARD border-dark-primary'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                        >
                            Cancel
                        </button>
                        <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div>
                        <button
                            disabled={loading}
                            onClick={handleAddUser}
                            className={`w-full px-4 py-2 rounded ${darkMode ? 'text-dark-textPrimary bg-light-primary' : 'text-light-textPrimary bg-dark-primary'}`}
                        >
                            ADD USER
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddUser;
