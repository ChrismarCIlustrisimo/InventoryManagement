import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
