import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext'; // Adjust the path if necessary

const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useAuthContext();

    // Redirect based on authentication and role
    if (!user) {
        // User is not authenticated
        return <Navigate to="/login" />;
    }

    if (user.role !== requiredRole) {
        // User does not have the required role
        return <Navigate to="/unauthorized" />;
    }

    // User is authenticated and has the required role
    return children;
};

export default PrivateRoute;
