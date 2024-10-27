import React from 'react';

const RmaSummaryMatrics = ({ filteredRMA }) => {
  // Calculate totals based on the filteredRMA data
  const totalPending = filteredRMA.filter(rma => rma.status === 'Pending').length;
  const totalApproved = filteredRMA.filter(rma => rma.status === 'Approved').length;
  const totalCompleted = filteredRMA.filter(rma => rma.status === 'Completed').length;

  return (
    <div className='flex flex-col w-[30%] mt-4'>
      <p className='text-2xl font-bold py-2'>RMA Summary Metrics</p>
      <div className='mt-4 text-xs'>
        <div className='flex justify-between border-b p-2'>
          <span className='font-bold'>Total Pending RMAs</span>
          <span>{totalPending}</span>
        </div>
        <div className='flex justify-between border-b p-2'>
          <span className='font-bold'>Total Approved RMAs</span>
          <span>{totalApproved}</span>
        </div>
        <div className='flex justify-between border-b p-2'>
          <span className='font-bold'>Total Rejected RMAs</span>
          <span>{filteredRMA.filter(rma => rma.status === 'Rejected').length}</span>
        </div>
        <div className='flex justify-between border-b p-2'>
          <span className='font-bold'>Total Completed RMAs</span>
          <span>{totalCompleted}</span>
        </div>
      </div>
    </div>
  );
}

export default RmaSummaryMatrics;
