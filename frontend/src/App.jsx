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
import DashboardTransaction from './pages/DashboardTransaction';
import AdminProfile from './pages/AdminProfile';
import Customer from './pages/dashboardCustomer';
import ReportPage from './pages/reportPage';
import { AppProvider } from './context/AppContext';
import UpdateUser from './pages/UpdateUser';
import ViewNetSalesTran from './pages/NetSalesTransactions';
import Receipt from './pages/Receipt';
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
import StoreLocation from './onlineListing/pages/StoreLocation';
import Laptops from './onlineListing/pages/productPage/Laptops';
import ViewProducts from './onlineListing/components/ViewProducts';
import ContactUs from './onlineListing/pages/ContactUs';
import Faq from './onlineListing/pages/Faq';
import ReturnPolicy from './onlineListing/pages/ReturnPolicy';
import Warranty from './onlineListing/pages/Warranty';
import CartPage from './onlineListing/pages/CartPage';
import Erceipt from './onlineListing/components/Erceipt';
import Accessories from './onlineListing/pages/productPage/Accessories';
import Components from './onlineListing/pages/productPage/Components';
import Desktops from './onlineListing/pages/productPage/Desktops';
import OSAndSoftware from './onlineListing/pages/productPage/OSAndSoftware';
import PCFurniture from './onlineListing/pages/productPage/PCFurniture';
import Peripherals from './onlineListing/pages/productPage/Peripherals';
import ProductProvider from './onlineListing/page.jsx';
import { StockAlertsProvider } from './context/StockAlertsContext.jsx';
import RefundedOrReplaced from './pages/RefundedOrReplaced.jsx';
import AdminRefund from './pages/AdminRefund.jsx';
import { DateFilterProvider } from './context/DateFilterContext.jsx';
import SuperAdminLogin from './pages/SuperAdminLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import CashierLogin from './pages/CashierLogin.jsx';
import AdminDashboard from './pages/AdminDashboard';
import AdminInventory from './pages/AdminInventory.jsx';
import AdminTransaction from './pages/AdminTransaction.jsx';
import RefundAdmin from './pages/AdminRefundPage.jsx';
import AdminSalesReport from './pages/AdminSalesReport.jsx';
import AdminInventoryReport from './pages/AdminInventoryReport.jsx';
import AdminAddProduct from './pages/AdminAddProduct.jsx';
import PendingProducts from './pages/PendingProducts.jsx';
import ArchivedProducts from './pages/ArchivedProducts.jsx';
import AdminViewProduct from './pages/AdminViewProduct.jsx';
import ReservationReceipt from './pages/ReservationReceipt.jsx';
import FrontPage from './pages/FrontPage.jsx';
import AdminSupplier from './pages/adminSupplier.jsx';
const App = () => {
    const { user } = useAuthContext();

    return (
        <AppProvider>
            <StockAlertsProvider>
                <DateFilterProvider>
                    <ProductProvider>
                        <AuthContextProvider>
                            <ThemeProvider>
                                <AdminThemeProvider>
                                    <Routes>
                                        {/* Route for login page */}
                                        <Route path="/" element={<FrontPage />} />

                                        {/* Route for different role logins */}
                                        <Route 
                                            path="/super-admin-login" 
                                            element={user ? <Navigate to="/super-admin-dashboard" /> : <SuperAdminLogin />} 
                                        />
                                        <Route 
                                            path="/admin-login" 
                                            element={user ? <Navigate to="/admin-dashboard" /> : <AdminLogin />} 
                                        />
                                        <Route 
                                            path="/cashier-login" 
                                            element={user ? <Navigate to="/cashier" /> : <CashierLogin />} 
                                        />

                                        {/* Private routes for authenticated users */}
                                        <Route path="/super-admin-dashboard" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><Dashboard /></PrivateRoute>} />
                                        <Route path="/cashier" element={<PrivateRoute allowedRoles={['cashier']}><Cashier /></PrivateRoute>} />
                                        <Route path="/transaction/:id" element={<PrivateRoute allowedRoles={['cashier']}><SingleTransaction /></PrivateRoute>} />
                                        <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
                                        <Route path="/admin-inventory" element={<PrivateRoute allowedRoles={['admin']}><AdminInventory /></PrivateRoute>} />
                                        <Route path="/admin-transaction" element={<PrivateRoute allowedRoles={['admin']}><AdminTransaction /></PrivateRoute>} />
                                        <Route path="/admin-refund" element={<PrivateRoute allowedRoles={['admin']}><RefundAdmin /></PrivateRoute>} />
                                        <Route path="/admin-sales-report" element={<PrivateRoute allowedRoles={['admin']}><AdminSalesReport /></PrivateRoute>} />
                                        <Route path="/admin-inventory-report" element={<PrivateRoute allowedRoles={['admin']}><AdminInventoryReport /></PrivateRoute>} />
                                        <Route path="/admin-add-product" element={<PrivateRoute allowedRoles={['admin']}><AdminAddProduct /></PrivateRoute>} />
                                        <Route path="/admin-view-product/:productId" element={<PrivateRoute allowedRoles={['admin']}><AdminViewProduct /></PrivateRoute>} />
                                        <Route path="/admin-supplier" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><AdminSupplier /></PrivateRoute>} />

                                        
                                        {/* Additional routes */}
                                        <Route path="/transaction" element={<PrivateRoute allowedRoles={['cashier']}><Transaction /></PrivateRoute>} />
                                        <Route path="/orders" element={<PrivateRoute allowedRoles={['cashier']}><SalesOrder /></PrivateRoute>} />
                                        <Route path="/receipt" element={<PrivateRoute allowedRoles={['cashier']}><Receipt /></PrivateRoute>} />
                                        <Route path="/reservation-receipt" element={<PrivateRoute allowedRoles={['cashier']}><ReservationReceipt /></PrivateRoute>} />
                                        <Route path="/refund" element={<PrivateRoute allowedRoles={['cashier']}><Refund /></PrivateRoute>} />
                                        <Route path="/cashier-rma" element={<PrivateRoute allowedRoles={['cashier']}><CashierRMA /></PrivateRoute>} />
                                        <Route path="/cashier-sales-report" element={<PrivateRoute allowedRoles={['cashier']}><CashierSalesReport /></PrivateRoute>} />

                                        {/* Admin routes */}
                                        <Route path="/addproduct" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><AddProduct /></PrivateRoute>} />
                                        <Route path="/update-product/:productId" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><UpdateProduct /></PrivateRoute>} />
                                        <Route path="/inventory/supplier" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><Supplier /></PrivateRoute>} />
                                        <Route path="/products" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><Product /></PrivateRoute>} />
                                        <Route path="/inventory/product" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><DashboardProductList /></PrivateRoute>} />
                                        <Route path="/transactions" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><DashboardTransaction /></PrivateRoute>} />
                                        <Route path="/customer" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><Customer /></PrivateRoute>} />
                                        <Route path="/profile" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><AdminProfile /></PrivateRoute>} />
                                        <Route path="/report-page" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><ReportPage /></PrivateRoute>} />
                                        <Route path="/add-user" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><AddUser /></PrivateRoute>} />
                                        <Route path="/update-user/:userId" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><UpdateUser /></PrivateRoute>} />
                                        <Route path="/net-sales-transactions" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><ViewNetSalesTran /></PrivateRoute>} />
                                        <Route path="/view-product/:productId" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><ViewProduct /></PrivateRoute>} />
                                        <Route path="/units-product/:productId" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><UnitsTable /></PrivateRoute>} />
                                        <Route path="/view-transaction/:transactionId" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><ViewTransaction /></PrivateRoute>} />
                                        <Route path="/rma" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><RMA /></PrivateRoute>} />
                                        <Route path="/sales-report" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><SalesReport /></PrivateRoute>} />
                                        <Route path="/rma-report" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><RMAReport /></PrivateRoute>} />
                                        <Route path="/inventory-report" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><InventoryReport /></PrivateRoute>} />
                                        <Route path="/rma-form" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><RMAForm /></PrivateRoute>} />
                                        <Route path="/refund-replace-units" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><RefundedOrReplaced /></PrivateRoute>} />
                                        <Route path="/refund-list" element={<PrivateRoute allowedRoles={['super-admin', 'admin']}><AdminRefund /></PrivateRoute>} />
                                        <Route path="/inventory/not-approved" element={<PrivateRoute allowedRoles={['super-admin']}><PendingProducts /></PrivateRoute>} />
                                        <Route path="/inventory/archive" element={<PrivateRoute allowedRoles={['super-admin']}><ArchivedProducts /></PrivateRoute>} />

                                        

                                        {/* Ecommerce routes */}
                                        <Route path="/iRIG" element={<Ecommerce />} />
                                        <Route path="/Ereceipt" element={<Erceipt />} />
                                        <Route path="/iRIG/products/view/:id" element={<ViewProducts />} />

                                        <Route path="*" element={<Navigate to="/iRIG" />} />
                                        <Route path="/unauthorized" element={<Unauthorized />} />
                                        <Route path="/iRIG/our-store" element={<StoreLocation />} />
                                        <Route path="/iRIG/contact-us" element={<ContactUs />} />
                                        <Route path="/iRIG/warranty" element={<Warranty />} />
                                        <Route path="/iRIG/return-policy" element={<ReturnPolicy />} />
                                        <Route path="/iRIG/faq" element={<Faq />} />
                                        <Route path="/iRIG/cart" element={<CartPage />} />
                                        <Route path="/iRIG/laptops" element={<Laptops />} />
                                        <Route path="/iRIG/desktops" element={<Desktops />} />
                                        <Route path="/iRIG/accessories" element={<Accessories />} />
                                        <Route path="/iRIG/peripherals" element={<Peripherals />} />
                                        <Route path="/iRIG/pc-furniture" element={<PCFurniture />} />
                                        <Route path="/iRIG/os-software" element={<OSAndSoftware />} />
                                        <Route path="/iRIG/components" element={<Components />} />

                                        
                                    </Routes>
                                </AdminThemeProvider>
                            </ThemeProvider>
                        </AuthContextProvider>
                    </ProductProvider>
                </DateFilterProvider>
            </StockAlertsProvider>
        </AppProvider>
    );
};

export default App;
