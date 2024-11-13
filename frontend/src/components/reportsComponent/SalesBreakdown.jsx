    import React from 'react';
    import { useAdminTheme } from '../../context/AdminThemeContext';

    const SalesBreakdown = ({ salesData }) => {
        const { darkMode } = useAdminTheme();

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options).replace(/^(.*?), (.*), (.*)$/, (match, month, day, year) => {
                return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}, ${year}`;
            });
        };

        return (
        <div className='border-b-2 border-black w-full pb-12 pt-6'>
            <div className='flex flex-col w-full '>
                <p className='text-2xl font-bold py-2'>Sales Breakdown</p>
                <table className={`min-w-full table-auto  text-xs`}>
                    <thead>
                        <tr className='border-b'>
                            <th className='text-center p-2'>Transaction ID</th>
                            <th className='text-center p-2'>Sales Date</th>
                            <th className='text-center p-2'>Customer Name</th>
                            <th className='text-center p-2'>Product Name</th>
                            <th className='text-center p-2'>Qty. Sold</th>
                            <th className='text-center p-2'>Original Amount</th>
                            <th className='text-center p-2'>Discount</th>
                            <th className='text-center p-2'>Total After Discount</th>
                            <th className='text-center p-2'>VATable Sales (12%)</th>
                            <th className='text-center p-2'>Total Sales (VAT Incl.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.flatMap((transaction) =>
                            transaction.products.map((item, idx) => {
                                const itemPrice = item.product?.selling_price || 0; // Selling price
                                const itemQuantity = item.quantity || 0; // Quantity sold
                                const totalAmountExclVAT = itemPrice * itemQuantity; // Total amount excluding VAT
                                const vat = totalAmountExclVAT * 0.12; // Calculate VAT (12%)
                                const originalAmountInclVAT = totalAmountExclVAT; // Original amount including VAT
                                const transactionDiscount = transaction.discount || 0; // Get the transaction discount
                                const totalAfterDiscount = originalAmountInclVAT - transactionDiscount; // Total after discount

                                return (
                                    <tr key={`${transaction.transaction_id}-${idx}`} className={`border-b ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>
                                        <td className={`p-2 text-center`}>{transaction.transaction_id || 'N/A'}</td>
                                        <td className={`p-2 text-center`}>{formatDate(transaction.transaction_date) || 'N/A'}</td>
                                        <td className={`p-2 text-center`}>{transaction.customer?.name || 'None'}</td>
                                        <td className={`p-2 text-center`}>{item.product?.name || 'Unknown Product'}</td>
                                        <td className={`p-2 text-center`}>{itemQuantity}</td>
                                        <td className={`p-2 text-center`}>₱ {originalAmountInclVAT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className={`p-2 text-center`}>₱ {transactionDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className={`p-2 text-center`}>₱ {totalAfterDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className={`p-2 text-center`}>₱ {vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className={`p-2 text-center`}>₱ {(totalAmountExclVAT + vat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        );
    };

    export default SalesBreakdown;
