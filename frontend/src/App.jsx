import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import PosLogin from './pages/PosLogin';
import Dashboard from './pages/AdminHome';
import Cashier from './pages/PosHome';
import SalesOrder from './pages/SalesOrder';
import Transaction from './pages/dashboardPos';
import Product from './pages/Product';
import AddProduct from './pages/AddProduct';
import SignUp from './pages/SignUp';
import { ThemeProvider } from './context/ThemeContext';
import { AdminThemeProvider } from './context/AdminThemeContext';
import PrivateRoute from './components/PrivateRoute';
import SingleTransaction from './pages/Transaction';
import { useAuthContext } from './hooks/useAuthContext';
import Unauthorized from './pages/Unauthorized';
import DashboardProductList from './pages/dashboardProductList';
import UpdateProduct from './pages/UpdateProduct';
import Supplier from './pages/dashboardSupplier';

const App = () => {
    const { user } = useAuthContext();
  
    return (
      <AuthContextProvider>
        <ThemeProvider>
          <AdminThemeProvider>
            <Routes>
              <Route path="/" element={<PosLogin />} />
              <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/dashboard' : '/cashier'} /> : <PosLogin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<PrivateRoute requiredRole="admin"><Dashboard /></PrivateRoute>} />
              <Route path="/cashier" element={<PrivateRoute requiredRole="cashier"><Cashier /></PrivateRoute>} />
              <Route path="/transaction/:id" element={<PrivateRoute requiredRole="cashier"><SingleTransaction /></PrivateRoute>} />
              <Route path="/transaction" element={<PrivateRoute requiredRole="cashier"><Transaction /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute requiredRole="cashier"><SalesOrder /></PrivateRoute>} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/update-product/:productId"  element={<UpdateProduct />} />
              <Route path="/inventory/supplier" element={<Supplier />} />
              <Route path="/Products" element={<PrivateRoute requiredRole="admin"><Product /></PrivateRoute>} />
              <Route path="/inventory/product" element={<PrivateRoute requiredRole="admin"><DashboardProductList /></PrivateRoute>} /> {/* Updated usage */}
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </AdminThemeProvider>
        </ThemeProvider>
      </AuthContextProvider>
    );
  };

export default App;

