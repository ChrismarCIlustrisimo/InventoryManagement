import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';
import { API_DOMAIN } from "../utils/constants";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    const baseURL = API_DOMAIN;

    // Login function
    const login = async (username, password, role) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${baseURL}/user/login`, {
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
            if (role === 'super-admin') {
                navigate('/super-admin-dashboard');
            } else if (role === 'admin') {
                navigate('/admin-dashboard');
            } else if (role === 'cashier') {
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

    // Check if user exists
    const checkUserExistence = async (username, email) => {
        try {
            const response = await fetch(`${baseURL}/user/check-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email }),
            });
            
    
            const json = await response.json();
    
            if (!response.ok) {
                setError(json.message || 'Error checking user existence');
                return null;  // Return null when the user doesn't exist
            }
    
            return json.exists ? json.user : null; // Return the user if exists, or null otherwise
        } catch (error) {
            console.error('Error checking user existence:', error);
            setError('Server error. Please try again.');
            return null;  // Return null in case of error
        }
    };
    
    // Reset password
    const resetPassword = async (username, email, newPassword) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${baseURL}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, newPassword }),
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.message || 'Error resetting password');
                setLoading(false);
                return false;
            }

            setLoading(false);
            return true; // Password reset successful
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Server error. Please try again.');
            setLoading(false);
            return false;
        }
    };

    return { error, loading, login, checkUserExistence, resetPassword };
};