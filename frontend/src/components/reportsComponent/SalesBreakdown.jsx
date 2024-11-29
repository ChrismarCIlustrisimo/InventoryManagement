import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const SalesBreakdown = ({ salesData }) => {
    const { darkMode } = useAdminTheme();

    // Function to calculate total sales
    const calculateTotalSales = () => {
        return salesData.reduce((total, transaction) => {
            return total + transaction.products.reduce((subtotal, item) => {
                const itemPrice = item.product?.selling_price || 0;
                const itemQuantity = item.quantity || 0;
                const totalAmountExclVAT = itemPrice * itemQuantity;
                const vat = totalAmountExclVAT * 0.12;
                return subtotal + (totalAmountExclVAT + vat);
            }, 0);
        }, 0);
    };

    const totalSales = calculateTotalSales();

    return (
        <div className="border-b-2 border-black w-full pb-12 pt-6">
            <div className="flex flex-col w-full">
                <p className="text-2xl font-bold py-2">Sales Breakdown</p>
                <table className={`min-w-full table-auto text-xs`}>
                    <thead className={`sticky top-[-10px] bg-gray-400`}>
                        <tr className="border-b">
                            <th className="text-left p-2">Product Name</th>
                            <th className="text-center p-2">Qty. Sold</th>
                            <th className="text-left p-2">Original Amount</th>
                            <th className="text-left p-2">VATable Sales (12%)</th>
                            <th className="text-left p-2">Total Sales (VAT Incl.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.flatMap((transaction) =>
                            transaction.products.map((item, idx) => {
                                const itemPrice = item.product?.selling_price || 0;
                                const itemQuantity = item.quantity || 0;
                                const totalAmountExclVAT = itemPrice * itemQuantity;
                                const vat = totalAmountExclVAT * 0.12;

                                return (
                                    <tr key={`${transaction.transaction_id}-${idx}`} className={`border-b`}>
                                        <td className={`p-2 text-left`}>{item.product?.name || 'Unknown Product'}</td>
                                        <td className={`p-2 text-center`}>{itemQuantity}</td>
                                        <td className={`p-2 text-left`}>
                                            ₱ {totalAmountExclVAT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className={`p-2 text-left`}>
                                            ₱ {vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className={`p-2 text-left`}>
                                            ₱ {(totalAmountExclVAT + vat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                {/* Total Sales Summary */}
                <div className="flex justify-end mt-4 border-t border-black">
                    <p className="text-xl font-bold py-2">
                        Total Sales: ₱ {totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SalesBreakdown;
