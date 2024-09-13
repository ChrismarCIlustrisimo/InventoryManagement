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
import AddUser from './pages/addUser';
import { ThemeProvider } from './context/ThemeContext';
import { AdminThemeProvider } from './context/AdminThemeContext';
import PrivateRoute from './components/PrivateRoute';
import SingleTransaction from './pages/Transaction';
import { useAuthContext } from './hooks/useAuthContext';
import Unauthorized from './pages/Unauthorized';
import DashboardProductList from './pages/dashboardProductList';
import UpdateProduct from './pages/UpdateProduct';
import Supplier from './pages/dashboardSupplier';
import AddSupplier from './pages/AddSupplier'
import UpdateSupplier from './pages/UpdateSupplier';
import DashboardTransaction from './pages/DashboardTransaction';
import DashboardSales from './pages/dashboardSales';
import AdminProfile from './pages/AdminProfile';
import Customer from './pages/dashboardCustomer';
import ReportPage from './pages/reportPage';

const App = () => {
    const { user } = useAuthContext();
  
    return (
      <AuthContextProvider>
        <ThemeProvider>
          <AdminThemeProvider>
            <Routes>
              <Route path="/" element={<PosLogin />} />
              <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/dashboard' : '/cashier'} /> : <PosLogin />} />
              <Route path="/dashboard" element={<PrivateRoute requiredRole="admin"><Dashboard /></PrivateRoute>} />
              <Route path="/cashier" element={<PrivateRoute requiredRole="cashier"><Cashier /></PrivateRoute>} />
              <Route path="/transaction/:id" element={<PrivateRoute requiredRole="cashier"><SingleTransaction /></PrivateRoute>} />
              <Route path="/transaction" element={<PrivateRoute requiredRole="cashier"><Transaction /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute requiredRole="cashier"><SalesOrder /></PrivateRoute>} />
              <Route path="/addproduct" element={<PrivateRoute requiredRole="admin"><AddProduct /></PrivateRoute>} />
              <Route path="/update-product/:productId"  element={<PrivateRoute requiredRole="admin"><UpdateProduct /></PrivateRoute>} />
              <Route path="/inventory/supplier" element={<PrivateRoute requiredRole="admin"><Supplier /></PrivateRoute>} />
              <Route path="/add-supplier" element={<PrivateRoute requiredRole="admin"><AddSupplier /></PrivateRoute>} />
              <Route path="/update-supplier/:supplierId" element={<PrivateRoute requiredRole="admin"><UpdateSupplier /></PrivateRoute>} />
              <Route path="/Products" element={<PrivateRoute requiredRole="admin"><Product /></PrivateRoute>} />
              <Route path="/inventory/product" element={<PrivateRoute requiredRole="admin"><DashboardProductList /></PrivateRoute>} /> {/* Updated usage */}
              <Route path="/transaction-list" element={<PrivateRoute requiredRole="admin"><DashboardTransaction /></PrivateRoute>} />
              <Route path="/sales" element={<PrivateRoute requiredRole="admin"><DashboardSales /></PrivateRoute>} />
              <Route path="/customer" element={<PrivateRoute requiredRole="admin"><Customer /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute requiredRole="admin"><AdminProfile /></PrivateRoute>} />
              <Route path="/report-page" element={<PrivateRoute requiredRole="admin"><ReportPage /></PrivateRoute>} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </AdminThemeProvider>
        </ThemeProvider>
      </AuthContextProvider>
    );
  };

export default App;

