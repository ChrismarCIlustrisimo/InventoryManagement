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
                <thead className={`sticky top-[-10px] bg-gray-400`}>
                      <tr className='border-b'>
                            <th className='text-left p-2'>Product Name</th>
                            <th className='text-left p-2'>Qty. Sold</th>
                            <th className='text-left p-2'>Original Amount</th>
                         {/*<th className='text-left p-2'>Total After Discount</th>*/}
                            <th className='text-left p-2'>VATable Sales (12%)</th>
                            <th className='text-left p-2'>Total Sales (VAT Incl.)</th>
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
                                    <tr key={`${transaction.transaction_id}-${idx}`} className={`border-b`}>
                                        <td className={`p-2 text-left`}>{item.product?.name || 'Unknown Product'}</td>
                                        <td className={`p-2 text-left`}>{itemQuantity}</td>
                                        <td className={`p-2 text-left`}>₱ {originalAmountInclVAT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    {/*<td className={`p-2 text-left`}>₱ {totalAfterDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>*/}
                                        <td className={`p-2 text-left`}>₱ {vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className={`p-2 text-left`}>₱ {(totalAmountExclVAT + vat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
