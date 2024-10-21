import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const LowStockMetrics = ({ inventoryData }) => {
    const { darkMode } = useAdminTheme();

    // Initialize counters
    let totalLowStockItems = 0;
    let totalOutOfStockItems = 0;

    // Ensure you're using the correct array
    const products = inventoryData; // Default to an empty array if undefined

    // Calculate the summary based on inventoryData
    products.forEach(product => {
        const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;

        // Count low stock items
        if (inStockUnits === 0) {
            totalOutOfStockItems++;
        } else if (inStockUnits <= product.low_stock_threshold) {
            totalLowStockItems++;
        }
    });

    return (
        <div className='flex flex-col w-[30%] mt-4'>
            <p className='text-2xl font-bold py-2'>Total Stock Metrics</p>
            <div className='mt-4 text-xs'>
                <div className='flex justify-between border-b p-2'>
                    <span className='font-bold'>Total Low Stock Items</span>
                    <span>{totalLowStockItems} {totalLowStockItems > 1 ? 'items' : 'item'}</span>
                </div>
                <div className='flex justify-between border-b p-2'>
                    <span className='font-bold'>Total Out of Stock Items</span>
                    <span>{totalOutOfStockItems} {totalOutOfStockItems > 1 ? 'items' : 'item'} </span>
                </div>
            </div>
        </div>
    );
};

export default LowStockMetrics;
