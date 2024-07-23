import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackNavbar from '../components/BackNavbar';
import Spinner from '../components/Spinner';


const Transaction = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = 'http://localhost:5555';


  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/transaction/${id}`);
        setTransaction(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setLoading(false);
      } 
    };

    fetchTransaction();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!transaction) {
    return (
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
      >
        Transaction not found
      </div>
    );
  }

  return (
    <div className='pt-20 px-20 pb-5 h-screen w-full'>
      <BackNavbar id={transaction._id}/>
      <div className='flex justify-center items-center h-full gap-6'>
        {/* Left Section */}
        <div className='flex flex-col items-start justify-between h-full w-[40%] p-4'>
          {/* Order Number */}
          <div>
            <p className='text-xl font-bold'>Order Number: {transaction.transaction_id}</p>
          </div>
          {/* Order Details */}
          <div className='flex flex-col gap-2 w-[60%]'>
            <h4>Order Details</h4>
            <div className='flex items-center justify-between'>
              <p className='text-sm'>TRANSACTION DATE</p>
              <p className='text-sm tracking-wider'>{new Date(transaction.transaction_date).toLocaleDateString()}</p>
            </div>
          </div>
          {/* Order Items */}
          <div className='flex flex-col gap-2 w-full'>
            <h3>Order Items</h3>
            <div className='overflow-y-auto h-[260px] w-full'>
              <table className='m-w-full border-collapse table-fixed h-auto'>
                <thead>
                  <tr className='border-b border-primary'>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Product</th>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Unit Price</th>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Qty</th>
                    <th className='sticky top-0 px-4 py-2 text-left bg-primaryBackground'>Total</th>
                  </tr>
                </thead>
                <tbody>
                {transaction.products.map((item, idx) => (
                  <tr key={idx} className='border-b border-primary gap-2'>
                    <td className='px-4 py-2 flex gap-4 py-4 items-center justify-start'>
                      {/* Ensure the image path is correctly constructed */}
                      <img
                          src={`${baseURL}/images/${item.product.image.substring(14)}`}
                          className='w-16 h-16 object-cover rounded-lg'
                        />
                      <p className='text-sm w-full'>{item.product.name}</p>
                    </td>
                    <td className='px-4 py-2'>{item.product.selling_price}</td>
                    <td className='px-4 py-2'>{item.quantity}</td>
                    <td className='px-4 py-2'>{(item.quantity * item.product.selling_price).toFixed(2)}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            {/* Subtotal and Total */}
            <div className='flex items-end justify-end w-full p-4 tracking-wider'>
              <div className='h-auto w-[50%] flex flex-col gap-2'>
                <div className='flex justify-between h-auto w-full'>
                  <p>SUBTOTAL</p>
                  <p>₱ {(transaction.total_price - (transaction.total_price * 0.12)).toFixed(2)}</p>
                </div>
                <div className='flex justify-between h-auto w-full text-primary'>
                  <p>TOTAL</p>
                  <p>₱ {transaction.total_price.toFixed(2)}</p>
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
                <p>NONE</p>
              </div>
              <div className='flex w-full'>
                <div className='flex flex-col gap-4 w-[50%] flex-start'>
                  <p>Total Amount</p>
                  <p>Total Amount Paid</p>
                  <p>Change</p>
                </div>
                <div className='flex flex-col gap-4 w-[50%] items-end tracking-wider'>
                <p>₱ {(transaction.total_price - (transaction.total_price * 0.12)).toFixed(2)}</p>
                <p>₱ {transaction.total_amount_paid}</p>
                <p>₱ {(transaction.total_amount_paid - (transaction.total_price)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Customer */}
          <div className='flex flex-col gap-2 mt-4'>
            <p className='text-2xl'>Customer Info</p>
            <div className='flex flex-col w-full px-4 py-4 bg-[#1e1b1b] rounded-2xl gap-4'>
              <p className='text-2xl'>{transaction.customer.name}</p>
              <div className='flex w-full'>
                <div className='flex flex-col gap-3 w-[50%] flex-start'>
                  <p>Email</p>
                  <p>Phone</p>
                  <p>Address</p>
                </div>
                <div className='flex flex-col gap-3 w-[50%] items-end'>
                  <p>{transaction.customer.email}</p>
                  <p>{transaction.customer.phone}</p>
                  <p>{transaction.customer.address}</p>
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
