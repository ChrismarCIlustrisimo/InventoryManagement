import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const PrivateRoute = ({ allowedRoles, children }) => {
    const { user } = useAuthContext();

    // Define the login routes for each role
    const loginRoutes = {
        'super-admin': '/super-admin-login',
        'admin': '/admin-login',
        'cashier': '/cashier-login',
    };

    // Redirect to the appropriate login route if no user is authenticated
    if (!user) {
        const loginRoute = allowedRoles.map(role => loginRoutes[role]).find(Boolean);
        return <Navigate to={loginRoute || '/login'} />;
    }

    // Check if the user's role is included in allowedRoles
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children; // Render the children if the role is allowed
};

export default PrivateRoute;
