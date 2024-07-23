import { useState } from 'react';
import { useSignUp } from '../hooks/useSignup';

const SignUp = () => {
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

    return (
        <form onSubmit={handleSubmit} className='p-4 bg-gray-900 text-white rounded-lg shadow-lg'>
            <h3 className='text-xl mb-4'>Signup</h3>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className='w-full p-2 mb-2 rounded bg-gray-700 outline-none'
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className='w-full p-2 mb-2 rounded bg-gray-700 outline-none'
            />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className='w-full p-2 mb-2 rounded bg-gray-700 outline-none'
            />
            <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contact"
                className='w-full p-2 mb-2 rounded bg-gray-700 outline-none'
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none'
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button disabled={loading} type="submit" className='w-full p-2 bg-blue-600 rounded hover:bg-blue-500'>
                Sign Up
            </button>
            {error && <div className='mt-2 text-red-500'>{error}</div>}
        </form>
    );
};

export default SignUp;
