import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import PosLogin from './pages/PosLogin';
import Dashboard from './pages/AdminHome'; // Assuming Dashboard is for Admin
import Cashier from './pages/PosHome'; // Assuming Cashier is for the cashier view
import SalesOrder from './pages/SalesOrder';
import Transaction from './pages/dashboardPos';
import AddProduct from './components/AddProduct';
import SignUp from './pages/SignUp';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute ';
const App = () => {
    return (
      <AuthContextProvider>
      <ThemeProvider>
          <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PosLogin />} />
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
                          <Transaction />
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

              {/* Catch-All Route */}
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </ThemeProvider>
  </AuthContextProvider>
    );
};

export default App;
