import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const LowStockAlert = ({ inventoryData }) => {
    const { darkMode } = useAdminTheme();

    // Calculate low stock products
    const lowStockProducts = inventoryData.filter(product => {
        const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;
        return inStockUnits > 0 && inStockUnits <= product.low_stock_threshold;
    }) || []; // Default to an empty array if undefined

    return (
        <div className='border-b-2 border-black w-full pb-12'>
            <div className='flex flex-col w-[50%] mt-4'>
                <p className='text-2xl font-bold py-2'>Low Stock Alert</p>
                <table className={`min-w-full table-auto mt-4 text-xs`}>
                    <thead>
                        <tr className='border-b'>
                            <th className='text-center p-2'>Product ID</th>
                            <th className='text-center p-2'>Name</th>
                            <th className='text-center p-2'>In Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockProducts.length > 0 ? (
                            lowStockProducts.map((product) => {
                                const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;
                                return (
                                    <tr key={product.product_id}>
                                        <td className='text-center p-2'>{product.product_id}</td>
                                        <td className='text-center p-2'>{product.name}</td>
                                        <td className='text-center p-2'>{inStockUnits} {inStockUnits > 1 ? 'units' : 'unit'}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={3} className='text-center p-2'>No low stock items</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LowStockAlert;
