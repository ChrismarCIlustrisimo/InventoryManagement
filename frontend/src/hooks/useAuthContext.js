import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ensure the path is correct

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw Error('AuthContextProvider must be used inside an AuthContextProvider');
    }

    return context;
};
