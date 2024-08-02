// src/hooks/useSignUp.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            // Send login request to the server
            const response = await fetch('http://localhost:5555/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const json = await response.json();

            // Handle non-OK responses
            if (!response.ok) {
                setError(json.error);
                setLoading(false);
                return;
            }

            // Handle successful response
            const { token, name } = json;

            // Store user data including name and token in local storage
            localStorage.setItem('user', JSON.stringify({ username, name, token }));

            // Dispatch login action to update AuthContext
            dispatch({ type: 'LOGIN', payload: { username, name, token } });

            setLoading(false);
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    return { error, loading, login };
};
