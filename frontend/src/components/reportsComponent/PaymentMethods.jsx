import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const PaymentMethods = ({ salesData }) => {
  const { darkMode } = useAdminTheme();

  // Aggregate data by payment method
  const aggregatedData = salesData.reduce((acc, transaction) => {
    const paymentMethod = transaction.payment_method || 'N/A';
    const totalAmount = transaction.total_price || 0;

    if (!acc[paymentMethod]) {
      acc[paymentMethod] = {
        method: paymentMethod,
        transactionCount: 0,
        totalAmount: 0,
      };
    }

    acc[paymentMethod].transactionCount += 1;
    acc[paymentMethod].totalAmount += totalAmount;

    return acc;
  }, {});

  // Convert aggregated data back to array
  const aggregatedArray = Object.values(aggregatedData);

  return (
  <div className='border-b-2 border-black w-full pb-12'>
        <div className='flex flex-col w-[60%] '>
      <p className='text-2xl font-bold py-2'>Payment Methods</p>
      <table className={`min-w-full table-auto  text-xs`}>
      <thead className={`sticky top-[-10px] bg-gray-400`}>
      <tr className='border-b'>
            <th className='text-left p-2'>Payment Method</th>
            <th className='text-left p-2'>No. of Transactions</th>
            <th className='text-left p-2'>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedArray.map((method, index) => (
            <tr key={index} className='border-b'>
              <td className='p-2 text-left'>{method.method}</td>
              <td className='p-2 text-left'>{method.transactionCount}</td>
              <td className='p-2 text-left'>₱{method.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default PaymentMethods;
