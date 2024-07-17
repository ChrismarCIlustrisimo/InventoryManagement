import React from 'react';
import BackNavbar from '../components/BackNavbar';
import demoImage from '../assets/Demo.png'; // Adjust the path as per your actual file location
import demo2 from '../assets/demo2.jpg';
import { PiPlusBold } from 'react-icons/pi';

const Transaction = () => {
  return (
    <div className='pt-20 px-20 pb-5 h-screen w-full'>
      <BackNavbar />
      <div className='flex justify-center items-center h-full gap-6'>
        {/* Left Section */}
        <div className='flex flex-col items-start justify-between h-full w-[40%] p-4'>
          {/* Order Number */}
          <div>
            <p className='text-xl font-bold'>Order Number: SO-654</p>
          </div>
          {/* Order Details */}
          <div className='flex flex-col gap-2 w-[60%]'>
            <h4>Order Details</h4>
            <div className='flex items-center justify-between'>
              <p className='text-sm'>SOURCE</p>
              <p className='text-sm'>ICONTROL</p>
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-sm'>DUE DATE</p>
              <p className='text-sm'>17 April, 2024</p>
            </div>
          </div>
          {/* Order Items */}
          <div className='flex flex-col gap-2 w-full'>
            <h3>Order Items</h3>
            <div className='overflow-y-auto h-[260px] w-full'>
              <table className='min-w-full border-collapse table-fixed h-full'>
                <thead>
                  <tr className='border-b border-primary'>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Product</th>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Unit Price</th>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Qty</th>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b border-primary gap-2'>
                    <td className='px-4 py-2 flex gap-4 py-4 items-center justify-start'>
                      <img src={demoImage} alt='Demo' className='w-16 h-16 object-cover rounded-lg' />
                      <p className='text-sm w-full'>NVIDIA GeForce RTX 3060 T</p>
                    </td>
                    <td className='px-4 py-2'>$10.00</td>
                    <td className='px-4 py-2'>2</td>
                    <td className='px-4 py-2'>$20.00</td>
                  </tr>
                  <tr className='border-b border-primary gap-2'>
                    <td className='px-4 py-2 flex gap-4 py-4 items-center justify-start'>
                      <img src={demo2} alt='Demo 2' className='w-16 h-16 object-cover rounded-lg' />
                      <p className='text-sm'>Demo Product</p>
                    </td>
                    <td className='px-4 py-2'>$15.00</td>
                    <td className='px-4 py-2'>1</td>
                    <td className='px-4 py-2'>$15.00</td>
                  </tr>
                  <tr className='border-b border-primary gap-2'>
                    <td className='px-4 py-2 flex gap-4 py-4 items-center justify-start'>
                      <img src={demo2} alt='Demo 2' className='w-16 h-16 object-cover rounded-lg' />
                      <p className='text-sm'>Demo Product</p>
                    </td>
                    <td className='px-4 py-2'>$15.00</td>
                    <td className='px-4 py-2'>1</td>
                    <td className='px-4 py-2'>$15.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Subtotal and Total */}
            <div className='flex items-end justify-end w-full border border-primary p-4'>
              <div className='h-auto w-[50%] flex flex-col'>
                <div className='flex justify-between h-auto w-full'>
                  <p>SUBTOTAL</p>
                  <p>$60.00</p>
                </div>
                <div className='flex justify-between h-auto w-full'>
                  <p>TOTAL</p>
                  <p>$639.00</p>
                </div>
              </div>
            </div>
          </div>
          {/* Order Terms */}
          <div className='flex flex-col gap-2 w-full'>
            <h3 className='w-full'>Order Terms</h3>
            <p className='w-full'>Terms and Conditions: All sales are final. No refunds or exchanges after 30 days.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className='h-full w-[40%] bg-[#120e0d] p-6 rounded-2xl'>
          {/* Invoices */}
          <div className='flex flex-col gap-2'>
            <p className='text-2xl'>Invoices</p>
            <div className='flex flex-col w-full px-4 py-4 bg-[#1e1b1b] rounded-2xl gap-4'>
              <div className='flex w-full justify-between items-center'>
                <p>Discount</p>
                <button className='bg-[#7a3724] border-none text-white outline-none py-1 px-2 rounded-lg flex gap-2 items-center'>
                  <PiPlusBold />
                  Add
                </button>
              </div>
              <div className='flex w-full'>
                <div className='flex flex-col gap-4 w-[50%] flex-start'>
                  <p>Amount</p>
                  <p>TAX</p>
                  <p>Total Amount</p>
                  <p>Total Amount Paid</p>
                  <p>Change</p>
                </div>
                <div className='flex flex-col gap-4 w-[50%] items-end'>
                  <p>63,000</p>
                  <p>923.00</p>
                  <p>63,923.00</p>
                  <p>64,000</p>
                  <p>77.00</p>
                </div>
              </div>
              <div className='flex gap-3 justify-between pt-6 w-full'>
                <button className='border border-red-600 w-[50%] py-3 rounded font-semibold text-red-600 
                                  hover:bg-red-600 hover:text-white 
                                  active:bg-red-700 active:text-red-200'>
                  Cancel Order
                </button>
                <button className='bg-primary w-[50%] py-3 rounded text-black font-semibold 
                                hover:bg-primary-opacity hover:text-black-opacity 
                                active:bg-primary-active'>
                  Pay
                </button>
              </div>
            </div>
          </div>
          {/* Customer */}
          <div className='flex flex-col gap-2 mt-4'>
            <p className='text-2xl'>Customer</p>
            <div className='flex flex-col w-full px-4 py-4 bg-[#1e1b1b] rounded-2xl gap-4'>
             <p className='text-2xl'>Maria Santos</p>
            <div className='flex w-full'>
                  <div className='flex flex-col gap-2 w-[50%] flex-start'>
                    <p>Amount</p>
                    <p>TAX</p>
                    <p>Total Amount</p>
                  </div>
                  <div className='flex flex-col gap-3 w-[50%] items-end'>
                    <p>63,000</p>
                    <p>923.00</p>
                    <p>63,923.00</p>
                  </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
