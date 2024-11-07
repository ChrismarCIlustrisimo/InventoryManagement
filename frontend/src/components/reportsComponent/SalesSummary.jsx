import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const SalesSummary = ({ salesData }) => {
  const { darkMode } = useAdminTheme();
  
  // Get the current month and year
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter transactions with status 'Completed', 'Replaced', or 'RMA' and payment_status 'paid'
  const filteredSalesData = salesData.filter(transaction =>
    ['Completed', 'Replaced', 'RMA'].includes(transaction.status) && 
    transaction?.payment_status === 'paid'
  );

  // Further filter by current month
  const currentMonthTransactions = filteredSalesData.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  let totalSalesGross = 0;
  let totalDiscountApplied = 0;
  let totalVAT = 0;
  let totalNetSales = 0;
  let totalUnitsSold = 0;
  const totalTransactions = currentMonthTransactions.length;

  // Calculate totals for the current month
  currentMonthTransactions.forEach(transaction => {
    // Accumulate total sales (gross)
    totalSalesGross += transaction.total_price || 0;

    // Calculate VAT (12%) based on total_price
    totalVAT += transaction.total_price ? transaction.total_price * 0.12 : 0;

    // Accumulate total units sold
    transaction.products.forEach(item => {
      totalUnitsSold += item.quantity || 0;
    });

    // Accumulate total discount applied
    totalDiscountApplied += transaction.discount || 0;
  });

  // Calculate net sales after discount
  totalNetSales = (totalSalesGross - totalDiscountApplied) - totalVAT;

  return (
    <div className={`flex flex-col w-full border-b-2 py-2 pb-6 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}>
      <p className='text-2xl font-bold py-4'>Sales Summary</p>
      <div className='flex flex-col w-[50%] gap-2'>
        <div className='flex justify-between font-semibold py-2'>
          <p className='border-b w-[60%]'>Total Sales (Gross)</p>
          <p className='w-[40%] text-start border-b'>₱ {totalSalesGross.toFixed(2)}</p>
        </div>
        <div className='flex justify-between font-semibold py-2'>
          <p className='border-b w-[60%]'>Total Transactions</p>
          <p className='w-[40%] text-start border-b'>{totalTransactions}</p>
        </div>
        <div className='flex justify-between font-semibold py-2'>
          <p className='border-b w-[60%]'>Total Units Sold</p>
          <p className='w-[40%] text-start border-b'>{totalUnitsSold}</p>
        </div>
        <div className='flex justify-between font-semibold py-2'>
          <p className='border-b w-[60%]'>Total Discount Applied</p>
          <p className='w-[40%] text-start border-b'>₱ {totalDiscountApplied.toFixed(2)}</p>
        </div>
        <div className='flex justify-between font-semibold py-2'>
          <p className='border-b w-[60%]'>Total VAT (12%)</p>
          <p className='w-[40%] text-start border-b'>₱ {totalVAT.toFixed(2)}</p>
        </div>
        <div className='flex justify-between font-semibold py-2'>
          <p className='border-b w-[60%]'>Net Sales (After Discount & VAT)</p>
          <p className='w-[40%] text-start border-b'>₱ {totalNetSales.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
