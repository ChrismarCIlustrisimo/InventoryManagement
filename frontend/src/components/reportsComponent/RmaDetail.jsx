import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const RmaDetail = ({ filteredRMA }) => {
  const { darkMode } = useAdminTheme();

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

  return (
    <div className='border-b-2 border-black w-full pb-12 pt-6'>
      <div className='flex flex-col w-full'>
        <p className='text-2xl font-bold py-2'>Sales Breakdown</p>
        <table className={`min-w-full table-auto text-xs`}>
          <thead className={`sticky top-[-10px] bg-gray-400`}>
         <tr className='border-b'>
              <th className='text-center p-2'>RMA ID</th>
              <th className='text-center p-2'>Customer Name</th>
              <th className='text-center p-2'>Product Name</th>
              <th className='text-center p-2'>Date Requested</th>
              <th className='text-center p-2'>Reason</th>
              <th className='text-center p-2'>Status</th>
              <th className='text-center p-2'>Action Taken</th>
            </tr>
          </thead>
          <tbody>
            {filteredRMA.length > 0 ? (
              filteredRMA.map((rma) => (
                <tr key={rma.id}>
                  <td className='p-2 text-center'>{rma.rma_id}</td>
                  <td className='p-2 text-center'>{rma.customer_name}</td>
                  <td className='p-2 text-center'>{rma.product}</td>
                  <td className='p-2 text-center'>{formatDate(rma.createdAt)}</td>
                  <td className='p-2 text-center'>{rma.reason}</td>
                  <td className='p-2 text-center'>{rma.status}</td>
                  <td className='p-2 text-center'>{rma.process}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className='p-2 text-center' colSpan="7">No sales data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RmaDetail;
