import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoCaretBackOutline } from 'react-icons/io5';
import { API_DOMAIN } from '../utils/constants';

const Transaction = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const baseURL = API_DOMAIN;
  const { darkMode } = useTheme(); 
  const { user } = useAuthContext(); 
  const navigate = useNavigate();
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [total_price, setTotal_price] = useState(0);
  const [units, setUnits] = useState([]);
  const [referenceNumber, setReferenceNumber] = useState('');

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
};

useEffect(() => {
  if (paymentMethod !== 'Cash' && paymentMethod !== '') {
    // Only set the payment amount if the method is valid (non-Cash)
    setPaymentAmount((transaction.vat + transaction.total_price) - discountValue);
  } else {
    // If payment method is 'Cash', leave the payment amount unchanged or reset it
    setPaymentAmount(0);  // or set it to any default value you'd prefer
  }
}, [paymentMethod, discountValue, total_price]);



  // Function to format numbers as currency
const formatNumber = (num) => {
  return num.toLocaleString();
};

const parseNumber = (value) => {
  // Convert the value to a string, then apply replace
  if (value && typeof value === 'string') {
    return value.replace(/[^\d.-]/g, ''); // Example to remove non-numeric characters
  } else if (typeof value === 'number') {
    return value.toString(); // If it's a number, convert to string
  }
  return ''; // Return empty string if value is not valid
};

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`${baseURL}/transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, 
        },
      });
      setTransaction(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to fetch transaction. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id, user.token]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', // Use 'short' for abbreviated month
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit', // Include hour
      minute: '2-digit', // Include minute
      hour12: true, // Use 12-hour clock format (AM/PM)
    }).format(new Date(date));
};


const handlePayButton = () => {
  if (paymentAmount < 0) {
    toast.error('Please enter a valid payment amount.');
    return;
  }

  if(paymentMethod !== 'Cash'){
    if (referenceNumber === '') {
      toast.warning('Please input reference number');
      return;
    }
  }

  setTotal_price(transaction.vat + transaction.total_price);
  console.log(transaction.vat + transaction.total_price)
  processPayment();
};

const handlePayment = () => {
  setShowPaymentSummary(true); //
};



const processPayment = async () => { 
  if (!paymentMethod) {
    toast.error('Please select a payment method.');
    return; 
  }

  try {
    // Update the transaction with payment details
    await axios.put(`${baseURL}/transaction/${id}`, {
      payment_status: 'paid', 
      cashier: user.name, 
      discount: discountValue, 
      status: 'Completed', 
      payment_method: paymentMethod, 
      total_amount_paid: paymentAmount, 
      products: transaction.products, 
      transaction_date: new Date().toISOString(),
      reference_number: referenceNumber,
    }, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    // Fetch the updated transaction
    const response = await axios.get(`${baseURL}/transaction/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const updatedTransaction = response.data;
    console.log(updatedTransaction)
    toast.success('Payment processed successfully.');

    setTimeout(() => {
      navigate('/resercation-receipt', { 
        state: {
          transaction: updatedTransaction,
          transactionId: updatedTransaction.transaction_id,
          totalVAT: updatedTransaction.vat,
          discount: updatedTransaction.discount,
          customer: updatedTransaction.customer,
          products: updatedTransaction.products,
        }
      }); 
    }, 2000);
    
  } catch (error) {
    console.error('Error processing payment:', error);
    toast.error('Failed to process payment. Please try again.');
  }
};





  if (loading) {
    return <p className={`w-full h-full flex items-center justify-center text-4xl ${darkMode ? 'bg-light-BG' : 'dark:bg-dark-BG'}`}>Please Wait</p>;
  }

  if (!transaction) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        Transaction not found
      </div>
    );
  }

  const handleBackClick = () => {
    navigate(-1);
  };

   const totalAmountAuto = (transaction.vat + transaction.total_price);

  return (
    <div className={`w-full items-start justify-center flex-col ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <ToastContainer />
      <div className='px-6 py-4 flex flex-col items-start justify-center w-full '>
        <div className='flex items-center justify-between w-full mb-4'>
          <button
            className={`flex gap-2 items-center py-2 px-4 rounded-md ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
            onClick={handleBackClick}
          >
            <IoCaretBackOutline /> Back to Reservation
          </button>
          <button
            className={`py-2 px-4 rounded-md ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'bg-light-primary text-dark-textPrimary'}`}
            onClick={handlePayment} // Now defined
          >
            Process Payment
          </button>
        </div>
        <div className='w-full h-[90%] flex items-center justify-center'>
                    <div className={`w-[80%] items-center flex flex-col justify-start border px-12  ${darkMode ? 'text-light-textPrimary border-light-border' : 'text-light-textPrimary border-light-border'} p-4 rounded-md`}>
                        <div className='flex flex-col w-full items-start justify-between gap-4'>
                            <div className='flex w-full py-6'>
                                <h2 className='text-2xl font-bold mr-2'>Transaction ID: </h2>
                                <p className='text-2xl font-bold'>{transaction.transaction_id}</p>
                            </div>
                            <div className='flex w-full items-start justify-start  '>
                                    <div className={`w-[15%] flex flex-col gap-2 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                                        <p className='w-full '>RESERVATION DATE</p>
                                        <p className='w-full '>EXPIRATION DATE</p>
                                    </div>
                                    <div className={`w-[30%] flex flex-col gap-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                        <p className='w-full text-start font-semibold'>{formatDate(transaction.transaction_date)}</p>
                                        <p className='w-full text-start font-semibold'>{formatDate(transaction.due_date)}</p>
                                    </div>
                            </div>
                        </div>

                        <div className='w-full flex justify-start pt-8 '>
                            <div className='flex flex-col w-full items-start justify-start  '>
                                <p className='font-bold text-xl py-2'>Customer Information</p>
                                <div className='flex w-[80%] py-2'>
                                  <div className={`w-[30%] flex flex-col gap-2 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                                        <p className='w-full '>CUSTOMER NAME</p>
                                        <p className='w-full '>ADDRESS</p>
                                        <p className='w-full '>EMAIL</p>
                                        <p className='w-full '>PHONE NUMBER</p>
                                    </div>
                                    <div className={`w-70%] flex flex-col gap-2 font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                       <p>{transaction.customer?.name || 'N/A'}</p>
                                        <p>{transaction.customer?.address || 'N/A'}</p>
                                        <p>{transaction.customer?.email || 'N/A'}</p>
                                        <p>{transaction.customer?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-full py-4'>
                            <p className='font-bold text-xl py-6'>Product Ordered</p>
                            <table className='w-full text-left mb-6'>
                                <thead>
                                    <tr className={`${darkMode ? 'bg-dark-header' : 'bg-light-header'} border-y-2`}>
                                        <th className='p-2 text-left'>Product</th>
                                        <th className='p-2 text-center '>Price</th>
                                        <th className='p-2 text-center '>Quantity</th>
                                        <th className='p-2 text-center '>Serial Number</th>
                                        <th className='p-2 text-center '>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaction.products.length > 0 ? (
                                        transaction.products.map((item, index) => {
                                        return (
                                            <tr key={index} className="border-y-2">
                                            <td className="p-2 flex flex-col gap-2 text-left">
                                                     <p>{item.product?.name}</p>
                                            </td>
                                            <td className="p-2 text-center">₱ {item.product?.selling_price || 0}</td>
                                            <td className="p-2 text-center">{item.quantity}</td>
                                            <td className="p-2 text-center">{item.serial_number.length > 0 ? item.serial_number.join(', ') : 'N/A'}</td>
                                            <td className="p-2 text-center">₱ {item.quantity * item.product?.selling_price}</td>
                                            </tr>
                                        );
                                        })
                                    ) : (
                                        <tr>
                                             <td colSpan={5} className="border p-2 text-center">No products found for this transaction.</td>
                                        </tr>
                                    )}
                                    </tbody>
                            </table>
                        </div>

              <div className='w-full flex items-center justify-end'>
                <div className='w-[40%] h-[120px]'>
                    <div className='flex justify-between py-2'>
                        <span>Subtotal</span>
                        <span>₱ {transaction.total_price}</span>
                    </div>
                    <div className='flex justify-between py-2'>
                        <span>VAT (12%)</span>
                        <span>₱ {transaction.vat}</span>
                    </div>
                    <div className='flex justify-between border-t-2 border-black text-xl py-4 font-semibold'>
                        <span>Total</span>
                        <span>₱ {transaction.total_price + transaction.vat}</span>
                    </div>
                 </div>
              </div>
          </div>
        </div>

        {showPaymentSummary && (
            <div className="z-20 fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center backdrop-blur-md">
              <div className={`rounded-2xl shadow-md w-[70%] h-[96%] p-6 relative ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary' } flex flex-col`}>
                <div className='flex gap-2 items-center justify-center w-full h-full'>
                  <div className='w-[60%]'>
                    <div className={`flex flex-col w-full h-full px-4 py-4 rounded-2xl gap-12 font-semibold`}>
                    <p className='text-center text-4xl font-semibold py-2'>Payment Details</p>

                      <div className='flex flex-col w-full justify-between items-center gap-4'>
                        <div className='w-full flex items-center'>
                          <p className='w-[50%]'>Subtotal</p>
                          <p className='w-[50%]'>₱ {transaction.total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                        <div className='w-full flex items-center'>
                          <p className='w-[50%]'>VAT</p>
                          <p className='w-[50%]'>₱ {transaction.vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                        <div className='w-full flex items-center'>
                          <p className='w-[50%]'>Total Amount</p>
                          <p className='w-[50%]'>₱ {(((transaction.vat + transaction.total_price) - discountValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</p>
                        </div>
                      </div>

                      <div className='flex flex-col w-full justify-between items-center gap-4'>
                      <div className='w-full flex items-center'>
                          <p className='w-[50%]'>Discount</p>
                              <div className='w-[50%]'>
                                <input
                                    type="number"
                                    value={discountValue === 0 ? '' : discountValue}
                                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                                    placeholder="₱ 0"
                                    className={`p-2 border w-[240px] ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
                                  />
                              </div>
                        </div>
                       <div className='w-full flex items-center'>
                            <p className='w-[50%]'>Payment Method</p>
                            <div className='w-[50%]'>
                              <select
                                id='paymentMethod'
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                                className={`border rounded p-2 w-[240px]  ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}
                                ${paymentMethod === '' 
                                    ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                    : (darkMode 
                                    ? 'bg-light-activeLink text-light-primary' 
                                    : 'bg-transparent text-black')} 
                                      outline-none font-semibold`}>
                                <option value=''>Select Option</option>
                                <option value='Cash'>Cash</option>
                                <option value='GCash'>GCash</option>
                                <option value='GGvices'>GGvices</option>
                                <option value='Bank Transfer'>Bank Transfer</option>
                                <option value='BDO Credit Card'>BDO Credit Card</option>
                                <option value='Credit Card - Online'>Credit Card - Online</option>
                              </select>
                            </div>
                          </div>

                          {paymentMethod !== 'Cash' && paymentMethod !== '' && (
                            <div className='w-full flex items-center'>
                              <p className='w-[50%]'>Reference Number</p>
                              <div className='w-[50%]'>
                                <input
                                  type='text'
                                  id='referenceNumber'
                                  value={referenceNumber}
                                  onChange={(e) => setReferenceNumber(e.target.value)}
                                  className={`border rounded p-2 w-[240px] ${darkMode ? 'border-light-border' : 'dark:border-dark-border'} outline-none font-semibold`}
                                  placeholder='Enter Reference Number'
                                />
                              </div>
                            </div>
                          )}



                              <div className='w-full flex items-center'>
                                <p className='w-[50%]'>Payment Received</p>
                                <input
                                  type="text"
                                  value={formatNumber(paymentAmount)}
                                  onChange={(e) => setPaymentAmount(parseNumber(e.target.value))}
                                  placeholder="₱ 0"
                                  className={`p-2 border w-[240px] ${darkMode ? 'border-light-border' : 'dark:border-dark-border'}`}
                                />
                              </div>

                        <div className='w-full flex items-center'>
                          <p className='w-[50%]'>Change</p>
                          <p className='w-[50%]'>
                            {paymentAmount ? (paymentAmount - ((transaction.vat + transaction.total_price) - discountValue)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '₱ 0.00'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='w-full flex flex-col gap-2 py-2 pt-6'>
                      <button
                        className={`w-full py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
                        onClick={handlePayButton}
                      >
                        Confirm Payment
                      </button>
                      <button
                        className={`w-full py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                        onClick={() => setShowPaymentSummary(false)} // Hide summary on cancel
                      >
                        Cancel Transaction
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default Transaction;
