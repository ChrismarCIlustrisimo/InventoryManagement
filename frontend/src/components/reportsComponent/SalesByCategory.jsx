import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const SalesByCategory = ({ salesData }) => {
    const { darkMode } = useAdminTheme();

    // Aggregate data by category
    const aggregatedData = salesData.reduce((acc, transaction) => {
        transaction.products.forEach((item) => {
            // Skip items without a category
            if (!item.product?.category) return;

            const category = item.product.category;
            const unitsSold = item.quantity || 0; // Use quantity sold in the transaction
            const grossSales = (transaction.total_price + transaction.discount) || 0;
            const discount = transaction.discount || 0;
            const vat = transaction.vat || 0;

            if (!acc[category]) {
                acc[category] = {
                    category,
                    unitsSold: 0,
                    grossSales: 0,
                    discount: 0,
                    vat: 0,
                    netSales: 0
                };
            }

            // Aggregate sales values
            acc[category].unitsSold += unitsSold; // Use item.quantity here
            acc[category].grossSales += grossSales;
            acc[category].discount += discount;
            acc[category].vat += vat;
            acc[category].netSales += transaction.total_price; // Net sales could be based on the total price
        });

        return acc;
    }, {});

    // Convert aggregated data back to array
    const aggregatedArray = Object.values(aggregatedData);

    return (
        <div className='border-b-2 border-black w-full pb-12'>
            <div className='flex flex-col w-[90%] '>
                <p className='text-2xl font-bold py-2'>Sales by Category</p>
                <table className={`min-w-full table-auto text-xs`}>
                    <thead className={`sticky top-[-10px] bg-gray-400`}>
                        <tr className='border-b'>
                            <th className='text-left p-2'>Category</th>
                            <th className='text-center p-2'>Units Sold</th>
                            <th className='text-left p-2'>Gross Sales</th>
                            <th className='text-left p-2'>VAT</th>
                            <th className='text-left p-2'>Net Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aggregatedArray.map((item, idx) => (
                            <tr key={idx} className='border-b'>
                                <td className='p-2 text-left'>{item.category}</td>
                                <td className='p-2 text-center'>{item.unitsSold}</td>
                                <td className='p-2 text-left'>₱{item.grossSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className='p-2 text-left'>₱{item.vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className='p-2 text-left'>₱{item.netSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesByCategory;
