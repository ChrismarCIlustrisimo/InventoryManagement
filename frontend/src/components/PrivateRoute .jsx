import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext'; // Adjust the path if necessary

const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useAuthContext();

    // Check if the user is authenticated and has the required role
    if (!user || user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
