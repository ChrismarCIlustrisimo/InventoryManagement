import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (username, password, role) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5555/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
                setLoading(false);
                return;
            }

            const { token, name, contact, _id } = json;

            // Store user information including _id
            localStorage.setItem('user', JSON.stringify({ username, name, token, role, contact, _id }));
            dispatch({ type: 'LOGIN', payload: { username, name, token, role, contact, _id } });

            // Redirect based on the role
            if (role === 'admin') {
                navigate('/dashboard');
            } else if (role === 'cashier' || role === 'admin') {
                navigate('/cashier');
            } else {
                navigate('/');
            }

            setLoading(false);
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    return { error, loading, login };
};
