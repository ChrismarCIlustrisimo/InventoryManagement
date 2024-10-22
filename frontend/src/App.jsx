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
import { AppProvider } from './context/AppContext';
import UpdateUser from './pages/UpdateUser'
import ViewNetSalesTran from './pages/NetSalesTransactions'
import Receipt from './pages/Receipt'
import ViewProduct from './pages/ViewProduct';
import UnitsTable from './pages/UnitsTable';
import ViewTransaction from './components/ViewTransaction';
import RMA from './pages/rma';
import SalesReport from './pages/SalesReport';
import Ecommerce from './onlineListing/pages/Ecommerce';
import RMAForm from './pages/RMAForm';
import RMAReport from './pages/RMAReport';
import InventoryReport from './pages/InventoryReport';
import Refund from './pages/Refund';
import CashierRMA from './pages/CashierRMA';
import CashierSalesReport from './pages/CashierSalesReport';
import OurStore from './onlineListing/pages/Products';
import ViewProducts from './onlineListing/components/ViewProducts';
const App = () => {
      const { user } = useAuthContext();

      return (
            <AppProvider>
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
                                          <Route path="/receipt" element={<PrivateRoute requiredRole="cashier"><Receipt /></PrivateRoute>} />
                                          <Route path="/refund" element={<PrivateRoute requiredRole="cashier"><Refund /></PrivateRoute>} />
                                          <Route path="/cashier-rma" element={<PrivateRoute requiredRole="cashier"><CashierRMA /></PrivateRoute>} />\
                                          <Route path="/cashier-SalesReport" element={<PrivateRoute requiredRole="cashier"><CashierSalesReport /></PrivateRoute>} />
                                          <Route path="/addproduct" element={<PrivateRoute requiredRole="admin"><AddProduct /></PrivateRoute>} />
                                          <Route path="/update-product/:productId" element={<PrivateRoute requiredRole="admin"><UpdateProduct /></PrivateRoute>} />
                                          <Route path="/inventory/supplier" element={<PrivateRoute requiredRole="admin"><Supplier /></PrivateRoute>} />
                                          <Route path="/add-supplier" element={<PrivateRoute requiredRole="admin"><AddSupplier /></PrivateRoute>} />
                                          <Route path="/update-supplier/:supplierId" element={<PrivateRoute requiredRole="admin"><UpdateSupplier /></PrivateRoute>} />
                                          <Route path="/Products" element={<PrivateRoute requiredRole="admin"><Product /></PrivateRoute>} />
                                          <Route path="/inventory/product" element={<PrivateRoute requiredRole="admin"><DashboardProductList /></PrivateRoute>} /> {/* Updated usage */}
                                          <Route path="/sales" element={<PrivateRoute requiredRole="admin"><DashboardTransaction /></PrivateRoute>} />
                                          <Route path="/customer" element={<PrivateRoute requiredRole="admin"><Customer /></PrivateRoute>} />
                                          <Route path="/profile" element={<PrivateRoute requiredRole="admin"><AdminProfile /></PrivateRoute>} />
                                          <Route path="/report-page" element={<PrivateRoute requiredRole="admin"><ReportPage /></PrivateRoute>} />
                                          <Route path="/addUser" element={<PrivateRoute requiredRole="admin"><AddUser /></PrivateRoute>} />
                                          <Route path="/update-user/:userId" element={<PrivateRoute requiredRole="admin"><UpdateUser /></PrivateRoute>} />
                                          <Route path="/net-sales-transactions" element={<PrivateRoute requiredRole="admin"><ViewNetSalesTran /></PrivateRoute>} />
                                          <Route path="/view-product/:productId" element={<PrivateRoute requiredRole="admin"><ViewProduct /></PrivateRoute>} />
                                          <Route path="/units-product/:productId" element={<PrivateRoute requiredRole="admin"><UnitsTable /></PrivateRoute>} />
                                          <Route path="/view-transaction/:transactionId" element={<PrivateRoute requiredRole="admin"><ViewTransaction /></PrivateRoute>} />
                                          <Route path="/rma" element={<PrivateRoute requiredRole="admin"><RMA /></PrivateRoute>} />
                                          <Route path="/SalesReport" element={<PrivateRoute requiredRole="admin"><SalesReport /></PrivateRoute>} />
                                          <Route path="/RMAReport" element={<PrivateRoute requiredRole="admin"><RMAReport /></PrivateRoute>} />
                                          <Route path="/InventoryReport" element={<PrivateRoute requiredRole="admin"><InventoryReport /></PrivateRoute>} />
                                          <Route path="/RMAForm" element={<PrivateRoute requiredRole="admin"><RMAForm /></PrivateRoute>} />
                                          <Route path="/ecommerce/irigpc/" element={<Ecommerce />} />
                                          <Route path="*" element={<Navigate to="/" />} />
                                          <Route path="/unauthorized" element={<Unauthorized />} />
                                          <Route path="/ecommerce/irigpc/products" element={<OurStore />} />
                                          <Route path="/ecommerce/irigpc/products/view/:id" element={<ViewProducts />} />
                                    </Routes>
                              </AdminThemeProvider>
                        </ThemeProvider>
                  </AuthContextProvider>
            </AppProvider>
      );
};

export default App;

