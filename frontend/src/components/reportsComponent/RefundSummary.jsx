import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const RefundSummary = ({ salesData }) => {
  const { darkMode } = useAdminTheme();

  // Filter the salesData to only include refunded transactions
  const refundedSalesData = salesData.filter(refund => refund.status === 'Refunded');

  return (
  <div className='border-b-2 border-black w-full pb-12'>
    <div className='flex flex-col w-full'>
      <p className='text-2xl font-bold py-2'>Refund Summary</p>
      <div className=' text-xs'>
        {refundedSalesData.length > 0 ? (
          refundedSalesData.map((refund, index) => (
            <div key={index} className='border-b p-2'>
              <div className='flex justify-between'>
                <span className='font-bold'>Transaction ID:</span>
                <span>{refund.transaction_id || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-bold'>Refund Amount:</span>
                <span>₱{refund.total_amount_paid || 0}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-bold'>Reason:</span>
                <span>{refund.reason_for_refund || 'N/A'}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No refunds available.</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default RefundSummary;
