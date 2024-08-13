import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import PosLogin from './pages/PosLogin';
import Dashboard from './pages/AdminHome'; // Admin view
import Cashier from './pages/PosHome'; // Cashier view
import SalesOrder from './pages/SalesOrder';
import Transaction from './pages/dashboardPos';
import Product from './pages/Product';
import AddProduct from './components/AddProduct';
import SignUp from './pages/SignUp';
import { ThemeProvider } from './context/ThemeContext';
import { AdminThemeProvider } from './context/AdminThemeContext'; // Use the provider here
import PrivateRoute from './components/PrivateRoute';
import SingleTransaction from './pages/Transaction';
import { useAuthContext } from './hooks/useAuthContext';

const App = () => {
    const { user } = useAuthContext();

    return (
        <AuthContextProvider>
            <ThemeProvider>
                <AdminThemeProvider> {/* Use AdminThemeProvider here */}
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<PosLogin />} />
                        <Route path="/login" element={!user ? <PosLogin /> : <Navigate to={user.role === 'admin' ? '/dashboard' : '/cashier'} />} />
                        <Route path="/signup" element={<SignUp />} />

                        {/* Protected Routes */}
                        <Route 
                            path="/dashboard" 
                            element={
                                <PrivateRoute requiredRole="admin">
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/cashier" 
                            element={
                                <PrivateRoute requiredRole="cashier">
                                    <Cashier />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/transaction/:id" 
                            element={
                                <PrivateRoute requiredRole="cashier">
                                    <SingleTransaction />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/transaction" 
                            element={
                                <PrivateRoute requiredRole="cashier">
                                    <Transaction />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/orders" 
                            element={
                                <PrivateRoute requiredRole="cashier">
                                    <SalesOrder />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/addproduct" 
                            element={
                                <PrivateRoute requiredRole="admin">
                                    <AddProduct />
                                </PrivateRoute>
                            } 
                        />

<Route 
                            path="/Products" 
                            element={
                                <PrivateRoute requiredRole="admin">
                                    <Product />
                                </PrivateRoute>
                            } 
                        />

                        {/* Catch-All Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </AdminThemeProvider>
            </ThemeProvider>
        </AuthContextProvider>
    );
};

export default App;
