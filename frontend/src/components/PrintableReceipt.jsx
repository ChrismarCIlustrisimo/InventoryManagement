import React from 'react';

const PrintableReceipt = React.forwardRef(({ transaction, customer, darkMode }, ref) => {
    return (
        <div ref={ref} className={`items-center flex flex-col justify-start border px-12 print-component screen-component ${darkMode ? 'text-light-textPrimary border-light-border' : 'text-light-textPrimary border-light-border'} p-4 rounded-md`}>
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
                    <p className='text-xl font-bold'>{transaction.transaction_id}</p>
                    <p>Issued date:</p>
                    <p className='font-bold'>{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className='w-full flex justify-start py-4 border-b-2 border-black'>
                <div>
                    <h4 className='font-bold'>Billed to</h4>
                    {customer ? (
                        <>
                            <p>Name: {customer.name || 'N/A'}</p>
                            <p>Address: {customer.address || 'N/A'}</p>
                            <p>Phone Number: {customer.phone || 'N/A'}</p>
                            <p>Email: {customer.email || 'N/A'}</p>
                        </>
                    ) : (
                        <p>Loading customer details...</p>
                    )}
                </div>
            </div>

            <div className='w-full py-4'>
                <table className='w-full text-left mb-6'>
                    <thead>
                        <tr className={`${darkMode ? 'bg-dark-header' : 'bg-light-header'}`}>
                            <th className='p-2 text-left'>Product</th>
                            <th className='p-2 text-center'>Price</th>
                            <th className='p-2 text-center'>Quantity</th>
                            <th className='p-2 text-center'>Serial Number</th>
                            <th className='p-2 text-center'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.products.length > 0 ? (
                            transaction.products.map((item, index) => (
                                <tr key={index} className='border-b-2 border-black'>
                                    <td className='p-2 flex flex-col gap-2 text-left'>
                                        <p>{item.product?.name || 'N/A'}</p>
                                        <p>{item.product?.serial_number || 'N/A'}</p>
                                    </td>
                                    <td className='p-2 text-center'>₱ {item.product?.buying_price || 0}</td>
                                    <td className='p-2 text-center'>{item.quantity}</td>
                                    <td className='p-2 text-center'>{item.serial_number || 'N/A'}</td>
                                    <td className='p-2 text-center'>₱ {item.quantity * item.product?.buying_price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='border p-2 text-center'>No products found for this transaction.</td>
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
                    <div className='flex justify-between py-2'>
                        <span>Discount</span>
                        <span>₱ {transaction.discount}</span>
                    </div>
                    <div className='flex justify-between border-t-2 border-black py-4 font-semibold'>
                        <span>Total</span>
                        <span>₱ {transaction.total_amount_paid}</span>
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
                      </div>
                </div>
            </div>

            <div className='w-full flex items-center justify-start'>
                <div className='w-full h-[120px] flex flex-col'>
                    <span className='text-xl font-semibold'>Terms:</span>
                    <div className='flex flex-col justify-between py-2'>
                        <div className='flex items-center justify-start gap-4'>
                            <p>Please keep this receipt for your records. Thank you for your purchase!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PrintableReceipt;
