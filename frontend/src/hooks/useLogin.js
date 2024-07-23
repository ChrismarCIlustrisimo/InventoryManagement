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

        const response = await fetch(`http://localhost:5555/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setLoading(false);
            return;
        }

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            setLoading(false);
        }
    };

    return { error, loading, login };
};
