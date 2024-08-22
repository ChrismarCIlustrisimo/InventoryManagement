import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const PrivateRoute = ({ requiredRole, children }) => {
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== requiredRole) {
     return <Navigate to="/unauthorized" />; // redirect to a specific unauthorized route
    }

    return children;
};

export default PrivateRoute;
