import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        window.location.href = '/login'; 
        localStorage.removeItem('user');
    };

    return { logout };
};
