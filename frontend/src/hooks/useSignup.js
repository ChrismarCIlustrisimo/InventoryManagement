// src/hooks/useSignUp.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignUp = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (username, password, name, contact, role) => {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5555/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, name, contact, role }),
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

    return { error, loading, signup };
};
