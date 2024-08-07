import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
    const { dispatch } = useAuthContext(); // Destructure dispatch from context
    const navigate = useNavigate(); // Hook for navigation

    const logout = () => {
        // Remove user from local storage
        localStorage.removeItem('user');

        // Dispatch logout action
        dispatch({ type: 'LOGOUT' });

        // Optional: Redirect user to the login page or home page
        navigate('/login'); // Or another route like '/'
    };

    return { logout };
};
