import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const VATSummary = ({ salesData }) => {
  const { darkMode } = useAdminTheme();

  // Calculate VAT Summary
  const vatSummary = salesData.reduce(
    (acc, transaction) => {
      const vatAmount = transaction.vat || 0;
      const totalPrice = transaction.total_price || 0;
      const vatableSales = totalPrice - vatAmount;

      acc.totalVatableSales += vatableSales;
      acc.totalVat += vatAmount;
      acc.netSales += totalPrice;

      return acc;
    },
    { totalVatableSales: 0, totalVat: 0, netSales: 0 }
  );

  return (
      <div className='flex flex-col w-[40%] '>
        <p className='text-2xl font-bold py-2'>VAT Summary</p>
        <div className=' text-xs'>
          <div className='flex justify-between border-b p-2'>
            <span className='font-bold'>Total Vatable Sales (12% VAT):</span>
            <span>₱ {vatSummary.totalVatableSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className='flex justify-between border-b p-2'>
            <span className='font-bold'>VAT (12%):</span>
            <span>₱ {vatSummary.totalVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className='flex justify-between border-b p-2'>
            <span className='font-bold'>Net Sales:</span>
            <span>₱ {vatSummary.netSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        
      </div>
  );
};

export default VATSummary;
