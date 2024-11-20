import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import ReactToPrint from 'react-to-print';
import { IoCaretBackOutline } from 'react-icons/io5';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_DOMAIN } from '../utils/constants';

const baseURL = API_DOMAIN;

const ReservationReceipt = () => {
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const componentRef = useRef();
  const { state } = useLocation();
  const transaction = state.transaction;
  const transactionId = state.transactionId;
  const totalVAT = state.totalVAT;
  const discount = state.discount;
  const products = state.products;  // Sample data for products
  const [customer, setCustomer] = useState(null);

    // Trigger success toast on successful transaction
    useEffect(() => {
        toast.success('Transaction was successful!')
    }, [transaction]);


  const handleBackClick = () => {
    navigate('/orders');
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${baseURL}/customer/${transaction.customer._id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [transaction.customer._id]);
  // Calculate Subtotal: Sum of all product amounts (price * quantity)
  const calculateSubtotal = () => {
    return products.reduce((acc, product) => {
      return acc + (product.selling_price * product.quantity || 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  // Calculate VAT (12%)
  const taxRate = 0.12; // 12%
  const vatAmount = subtotal * taxRate;

  // Apply discount to subtotal
  const discountedSubtotal = subtotal - discount;

  // Calculate Total Amount (Subtotal + VAT - Discount)
  const totalAmount = discountedSubtotal + vatAmount;

  return (
    <div className={`w-full flex items-center justify-center flex-col ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <div className='p-6 flex flex-col items-center justify-start w-full min-h-screen'>
        <div className='flex items-center justify-between w-full mb-4'>
          <button
            className={`flex gap-2 items-center py-2 px-4 rounded-md ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
            onClick={handleBackClick}
          >
            <IoCaretBackOutline /> Back to Previous Page
          </button>
          <ReactToPrint
            trigger={() => (
              <button className={`py-2 px-4 rounded-md ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'bg-light-primary text-dark-textPrimary'}`}>
                Print ReservationReceipt
              </button>
            )}
            content={() => componentRef.current}
            pageStyle={`@media print {
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                width: 3in; 
                overflow: hidden; 
              }
              table {
                width: 100%;
              }
              th, td {
                padding: 8px; 
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            }`}
          />
        </div>

        <div ref={componentRef} className={`w-full items-center flex flex-col justify-start border px-12 ${darkMode ? 'text-light-textPrimary border-light-border' : 'text-dark-textPrimary border-dark-border'} p-4 rounded-md`}>
          
          <div className='flex w-full items-center justify-between border-b-2 border-black'>
                <div className='text-left mb-6'>
                  <h2 className='font-bold'>Irig Computer Trading</h2>
                  <p>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
                  <p>Tel. No. 8-364-6039</p>
                  <p>CP. No. 0923-444-1030</p>
                  <p>irigcomputers@gmail.com</p>
                </div>

                <div className='text-right mb-6'>
                  <h2 className='text-2xl font-bold'>Invoice No:</h2>
                  <p className='text-xl font-bold'>{transactionId || 'SO-301'}</p>
                  <p>Issued date:</p>
                  <p className='font-bold'>{new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
                </div>
          </div>

          {/* Transaction Details */}
          <div className='w-full flex justify-start py-4 border-b-2 border-black'>
            <div>
              <h4 className='font-bold'>Billed to</h4>
              {customer ? (
                <>
                  <p>Name: {customer.name || ''}</p>
                  <p>Address: {customer.address || ''}</p>
                  <p>Phone Number: {customer.phone || ''}</p>
                  <p>Email: {customer.email || ''}</p>
                </>
              ) : (
                <p>Loading customer details...</p>
              )}
            </div>
          </div>

          <div className='w-full w-min-[500px] py-4'>
            {/* Products Table */}
            <table className='w-full text-left mb-6'>
              <thead>
                <tr className={`${darkMode ? 'bg-dark-header' : 'bg-light-header'}`}>
                  <th className='p-2 text-left' style={{ width: '60%' }}>Product</th>
                  <th className='p-2 text-center' style={{ width: '15%' }}>Price</th>
                  <th className='p-2 text-center' style={{ width: '10%' }}>Quantity</th>
                  <th className='p-2 text-center' style={{ width: '15%' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
              {products && products.length > 0 ? products.map((product, index) => {
                    const amount = (product.product.selling_price || 0) * (product.quantity || 0);
                    let serialNumbers = product.serial_number.join(', ');
                    return (
                        <tr key={product._id} className={`border-b-2 border-black ${index % 2 === 0 ? (darkMode ? 'bg-dark-row' : 'bg-light-row') : (darkMode ? 'bg-light-row' : 'bg-dark-row')}`}>
                            <td className='p-2 flex flex-col gap-2 text-left'>
                                <p>{product.product_name || ''}</p>
                                <p>{serialNumbers || ''}</p>
                            </td>
                            <td className='p-2 text-center'>₱ {product.product.selling_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ''}</td>
                            <td className='p-2 text-center'>{product.quantity || ''}</td>
                            <td className='p-2 text-center'>₱ {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ''}</td>
                        </tr>
                    );
                }) : (
                    <tr>
                        <td colSpan={4} className='border p-2 text-center'>No products found for this transaction.</td>
                    </tr>
                )}
                </tbody>
            </table>
          </div>

          <div className='w-full flex items-center justify-end'>
            <div className='w-[40%] h-[120px]'>
              <div className='flex justify-between py-2'>
                <span>Vatable Sales</span>
                <span>₱ {(transaction.total_price / 1.12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ''}</span>
              </div>
              <div className='flex justify-between py-2'>
                <span>VAT (12%)</span>
                <span>₱ {totalVAT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || ''}</span>
              </div>
              <div className='flex justify-between py-2'>
                <span>Discount</span>
                <span>₱ {discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}</span>
                </div>
              <div className='flex justify-between border-t-2 border-black py-4 font-semibold'>
                <span>Total Amount</span>
                <span>₱ {((transaction.total_price)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}</span>
              </div>
            </div>
          </div>

          <div className='w-full flex items-center justify-start pt-12'>
            <div className='w-[40%] h-[120px] flex flex-col'>
                <span className='text-xl font-semibold'>Payment method:</span>
                <div className='flex flex-col justify-between py-2'>
                    <div className='flex items-center justify-start gap-4'>
                        <p className='text-light-textSecondary mr-4'>PAYMENT METHOD</p>
                        <p className='uppercase font-semibold'>{transaction.payment_method}</p>
                        <p className='bg-[#EBFFEE] p-1 rounded-md text-[#14AE5C] italic px-4 font-semibold'>Paid</p>
                    </div>
                    {transaction.payment_method !== 'Cash' ? (
                        <div className='flex items-center justify-start gap-4'>
                            <p className='text-light-textSecondary mr-4'>REFERENCE NUMBER</p>
                            <p className='uppercase font-semibold'>{transaction.reference_number}</p>
                        </div>
                    ) : ''}
                </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

    </div>
  );
};

export default ReservationReceipt;
