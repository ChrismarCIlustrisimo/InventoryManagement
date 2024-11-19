import { useAuthContext } from './useAuthContext'; 
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const logout = () => {
        // Get user data from localStorage to check their role
        const user = JSON.parse(localStorage.getItem('user'));

        // Redirect to the appropriate login page based on the user's role
        if (user?.role === 'cashier') {
            navigate('/cashier-login');
        } else if (user?.role === 'super-admin') {
           navigate('/super-admin-login');
        } else if (user?.role === 'admin') {
            navigate('/admin-login');
        } else {
            navigate('/cashier-login');
        }


        // Dispatch logout action and remove user data from localStorage
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('user');
        sessionStorage.removeItem('toastShown');


    };
    
    

    return { logout };
};
