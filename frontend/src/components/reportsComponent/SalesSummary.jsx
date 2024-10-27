import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const SalesSummary = ({ salesData }) => {
  const { darkMode } = useAdminTheme();

  // Initialize summary variables
  let totalSalesGross = 0;
  let totalTransactions = salesData.length; // Number of transactions
  let totalUnitsSold = 0;
  let totalDiscountApplied = 0;
  let totalVAT = 0; // Total VAT calculated directly from product sales
  let totalNetSales = 0; // To store net sales after discount and VAT

  // Loop through sales data to calculate summary
  salesData.forEach((transaction) => {
    transaction.products.forEach((item) => {
      const itemPrice = item.product.selling_price || 0; // Ensure item price is a number
      const itemQuantity = item.quantity || 0; // Ensure item quantity is a number

      // Calculate total sales gross
      const itemTotal = itemPrice * itemQuantity;
      totalSalesGross += itemTotal;

      // Calculate total units sold
      totalUnitsSold += itemQuantity;


      // Calculate VAT for each item and accumulate total VAT
      const vat = itemTotal * 0.12; // 12% VAT on the total for the item
      totalVAT += vat; // Accumulate VAT for all items
    });

    // Calculate total discounts applied for this transaction
    const transactionDiscount = transaction.discount || 0; // Ensure transaction discount is a number
    totalDiscountApplied += transactionDiscount;

    // Calculate net sales for this transaction (gross - discounts + VAT)
    const transactionNetSales = totalSalesGross - transactionDiscount + totalVAT; 
    totalNetSales += transactionNetSales; 
  });

  // Calculate Net Sales (Excluding VAT)
  const netSalesExcludingVAT = totalSalesGross - totalVAT;

  return (
    
    <div className={`flex flex-col w-full border-b-2 py-2 pb-6 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}>
      <p className='text-2xl font-bold py-4'>Sales Summary</p>
      <div className='flex flex-col w-[50%] gap-2'>
        <div className={`flex justify-between font-semibold py-2`}>
          <p className='border-b w-[60%]'>Total Sales (Gross)</p>
          <p className='w-[40%] text-start border-b'>₱ {totalSalesGross.toFixed(2)}</p>
        </div>
        <div className={`flex justify-between font-semibold py-2`}>
          <p className='border-b w-[60%]'>Total Transactions</p>
          <p className='w-[40%] text-start border-b'>{totalTransactions}</p>
        </div>
        <div className={`flex justify-between font-semibold py-2`}>
          <p className='border-b w-[60%]'>Total Units Sold</p>
          <p className='w-[40%] text-start border-b'>{totalUnitsSold}</p>
        </div>
        <div className={`flex justify-between font-semibold py-2`}>
          <p className='border-b w-[60%]'>Total Discount Applied</p>
          <p className='w-[40%] text-start border-b'>₱ {totalDiscountApplied.toFixed(2)}</p>
        </div>
        <div className={`flex justify-between font-semibold py-2`}>
          <p className='border-b w-[60%]'>Total VAT (12%)</p>
          <p className='w-[40%] text-start border-b'>₱ {totalVAT.toFixed(2)}</p>
        </div>
        <div className={`flex justify-between font-semibold py-2`}>
          <p className='border-b w-[60%]'>Net Sales (Excluding VAT)</p>
          <p className='w-[40%] text-start border-b'>₱ {netSalesExcludingVAT.toFixed(2)}</p>
        </div>
        <div className={`flex justify-between font-semibold py-2`}>
          <p className='border-b w-[60%]'>Net Sales (After Discount & VAT)</p>
          <p className='w-[40%] text-start border-b'>₱ {totalNetSales.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
