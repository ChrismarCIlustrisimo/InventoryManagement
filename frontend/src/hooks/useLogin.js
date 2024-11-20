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

    const verifyCode = async (email, verificationCode) => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`${baseURL}/user/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode }), // Use 'code' here
            });
    
            const json = await response.json();
            console.log('Verification code verification response:', json); // Check the response
    
            if (!response.ok) {
                setError(json.message || 'Error verifying code');
                setLoading(false);
                return { success: false };
            }
    
            setLoading(false);
            return { success: true }; // Code verified successfully
        } catch (error) {
            console.error('Error verifying code:', error);
            setError('Server error. Please try again.');
            setLoading(false);
            return { success: false }; // Error occurred
        }
    };
    



    // Add this to your useLogin hook

    const sendVerificationCode = async (email) => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`${baseURL}/user/send-verification-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
    
            const json = await response.json();    
            if (!response.ok) {
                setError(json.message || 'Error sending verification code');
                setLoading(false);
                return false;
            }
    
            setLoading(false);
            return true;  // Verification code sent successfully
        } catch (error) {
            console.error('Error sending verification code:', error);
            setError('Server error. Please try again.');
            setLoading(false);
            return false;  // Error occurred
        }
    };
    
    const resetPassword = async (email, newPassword) => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`${baseURL}/user/reset-password`, {
                method: 'PUT', // Change to PUT
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
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
    
    

    return { error, loading, login, resetPassword, sendVerificationCode, verifyCode  };
};