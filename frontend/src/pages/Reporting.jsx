import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import LowStockReport from '../components/reportingComponent/LowStockReport';
import CurrentInventoryReport from '../components/reportingComponent/CurrentInventoryReport';
import SalesByProductReport from '../components/reportingComponent/SalesByProductReport';
import DailyWeeklyMonthlyReport from '../components/reportingComponent/SalesReport';
import RMASummaryReport from '../components/reportingComponent/RMASummaryReport';
import RefundReport from '../components/reportingComponent/RefundReport';
import WarrantyClaimsReport from '../components/reportingComponent/WarrantyClaimsReport';
import SalesRevenueReport from '../components/reportingComponent/SalesRevenueReport';

const Reporting = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();

  // State for report generation
  const [selectedReport, setSelectedReport] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [product, setProduct] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [rmaStatus, setRmaStatus] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [customer, setCustomer] = useState('');
  const [period, setPeriod] = useState('');

  // Reports that require date selection

  const renderReport = () => {
    switch (selectedReport) {
      case 'low-stock':
        return <LowStockReport stockStatus={stockStatus} setStockStatus={setStockStatus} />;
      case 'current-inventory':
        return <CurrentInventoryReport stockStatus={stockStatus} setStockStatus={setStockStatus} />;
      case 'sales-by-product':
        return (
          <SalesByProductReport
            product={product}
            setProduct={setProduct}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        );
      case 'daily-weekly-monthly':
        return (
          <DailyWeeklyMonthlyReport
            period={period}
            setPeriod={setPeriod}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        );
      case 'rma-summary':
        return (
          <RMASummaryReport
            stockStatus={stockStatus}
            setStockStatus={setStockStatus}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            rmaStatus={rmaStatus}
            setRmaStatus={setRmaStatus}
          />
        );
      case 'refund':
        return (
          <RefundReport
            refundReason={refundReason}
            setRefundReason={setRefundReason}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        );
      case 'warranty-claims':
        return (
          <WarrantyClaimsReport
            customer={customer}
            setCustomer={setCustomer}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        );
      case 'sales-revenue':
        return (
          <SalesRevenueReport
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4 w-full h-full'>
        <div className='flex items-center justify-center py-5'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            Reporting
          </h1>
        </div>
        <div className='flex gap-4 items-center justify-center'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
            <div className='flex flex-col gap-6'>
              <div className="flex flex-col mb-4">
                <label className="mb-2">Please select your report criteria</label>
                <select
                  className="border border-gray-300 rounded p-1"
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  aria-placeholder=''
                >
                  <option value="">Select Report</option>
                  <option value="low-stock">Low Stock Report</option>
                  <option value="current-inventory">Current Inventory Report</option>
                  <option value="sales-by-product">Sales by Product Report</option>
                  <option value="daily-weekly-monthly">Sales Report</option>
                  <option value="rma-summary">RMA Summary Report</option>
                  <option value="refund">Refund Report</option>
                  <option value="warranty-claims">Warranty Claims Report</option>
                  <option value="sales-revenue">Sales Revenue Report</option>
                </select>
              </div>



              {renderReport()}


              <button
                className="bg-orange-500 text-lg text-white rounded px-4 py-2 hover:bg-orange-600 transition duration-200"
                onClick={() => {
                  // You can implement the report generation logic here
                }}
              >
                Generate Report
              </button>
            </div>
          </div>
          <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
