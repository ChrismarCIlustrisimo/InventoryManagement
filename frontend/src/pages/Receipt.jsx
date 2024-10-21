import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import ReactToPrint from 'react-to-print';
import { IoCaretBackOutline } from 'react-icons/io5';
import axios from 'axios';

const baseURL = 'http://localhost:5555';

const Receipt = () => {
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const componentRef = useRef();
  const { state } = useLocation();
  const transaction = state.transaction;
  const transactionId = state.transactionId;
  const totalVAT = state.totalVAT;
  const discount = state.discount;
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${baseURL}/customer/${transaction.customer}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`);
      const fetchedProducts = response.data.data;

      const matchedProducts = transaction.products.map(tranProduct => {
        const matchedProduct = fetchedProducts.find(product => product._id === tranProduct.product);
        return {
          ...matchedProduct,
          quantity: tranProduct.quantity,
          serial_numbers: tranProduct.serial_numbers,
        };
      }).filter(Boolean);

      setProducts(matchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  

  useEffect(() => {
    fetchProducts();
    fetchCustomer();
  }, [transaction.customer]);

  // Calculate the tax amount (12%)
  const taxRate = 0.12; // 12%
  const totalPrice = transaction.total_price; // Assuming this is the total before tax
  const taxAmount = totalPrice * taxRate;
  const totalWithTax = totalPrice + taxAmount;

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
                Print Receipt
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
                  <p className='text-xl font-bold'>{transactionId}</p>
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
                  <p>Name: {customer.name}</p>
                  <p>Address: {customer.address}</p>
                  <p>Phone Number: {customer.phone}</p>
                  <p>Email: {customer.email}</p>
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
                  <th className='p-2 text-left' style={{ width: '40%' }}>Product</th>
                  <th className='p-2 text-center' style={{ width: '20%' }}>Price</th>
                  <th className='p-2 text-center' style={{ width: '20%' }}>Quantity</th>
                  <th className='p-2 text-center' style={{ width: '20%' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map((product, index) => {
                  const amount = product.selling_price * (product.quantity || 0); // Calculate amount
                  const tranProduct = transaction.products.find(tranProduct => tranProduct.product === product._id);
                  let serialNumbers = '';
                  if (tranProduct) {
                    const matchingUnits = product.units.filter(unit => tranProduct.serial_number.includes(unit._id));
                    serialNumbers = matchingUnits.map(unit => unit.serial_number).join(', ');
                  }
                  return (
                    <tr key={product._id} className={`border-b-2 border-black ${index % 2 === 0 ? (darkMode ? 'bg-dark-row' : 'bg-light-row') : (darkMode ? 'bg-light-row' : 'bg-dark-row')}`}>
                      <td className='p-2 flex flex-col gap-2 text-left'>
                        <p>{product.name}</p>
                        <p>{serialNumbers}</p>
                      </td>
                      <td className='p-2 text-center'>₱ {product.selling_price.toLocaleString()}</td>
                      <td className='p-2 text-center'>{product.quantity}</td>
                      <td className='p-2 text-center'>₱ {amount.toLocaleString()}</td>
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
                <span>Subtotal</span>
                <span>₱ {((transaction.total_price + discount) - totalVAT)} </span>
              </div>
              <div className='flex justify-between py-2'>
                <span>VAT (12%)</span>
                <span>₱ {totalVAT.toLocaleString()}</span>
              </div>
              <div className='flex justify-between py-2'>
                <span>Discount</span>
                <span>₱ {discount.toLocaleString()}</span>
                </div>
              <div className='flex justify-between border-t-2 border-black py-4 font-semibold'>
                <span>Total Amount</span>
                <span>₱ {transaction.total_price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className='w-full flex items-center justify-start py-12'>
            <div className='w-[40%] h-[120px] flex flex-col'>
              <span className='text-xl font-semibold'>Payment method:</span>
              <div className='flex flex-col justify-between py-2'>
                <div className='flex items-center justify-start gap-4'>
                  <p>Gcash</p>
                  <p className='bg-[#EBFFEE] text-[#14AE5C] py-2 px-4 rounded-md italic'>Paid</p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-start py-6 text-sm'>
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
