import { useState } from 'react';
import { API_DOMAIN } from "../utils/constants";

export const useSignUp = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const baseURL = API_DOMAIN;

    const signup = async ({ username, password, name, contact, role, email }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${baseURL}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, name, contact, role, email }), 
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Failed to sign up');
            }

            // You can add any success handling logic here if needed
            // For example, resetting form fields or showing a success message

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { error, loading, signup };
};
