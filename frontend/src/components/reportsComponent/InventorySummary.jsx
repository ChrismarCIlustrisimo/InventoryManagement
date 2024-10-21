import React from 'react';
import { useAdminTheme } from '../../context/AdminThemeContext';

const InventorySummary = ({ inventoryData }) => {
    const { darkMode } = useAdminTheme();

    // Initialize counters
    let totalItems = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;
    let totalReturned = 0;
    let unitsUnderReview = 0;
    let replacedUnits = 0;

    // Ensure you're using the correct array
    const products = inventoryData; // Default to an empty array if undefined

    // Calculate the summary based on inventoryData
    products.forEach(product => {
        const { units } = product;

        // Increment total items
        totalItems += units.length;

        // Count low stock items and update other statuses
        let inStockCount = 0; // To track in stock units
        units.forEach(unit => {
            if (unit.status === 'in_stock') {
                inStockCount++;
            }
            if (unit.status === 'refund') {
                totalReturned++;
            }
            if (unit.status === 'rma') {
                unitsUnderReview++;
            }
            if (unit.status === 'replace') {
                replacedUnits++;
            }
        });

        // Assign status based on inStockCount and low stock threshold
        const lowStockThreshold = product.low_stock_threshold; // Assuming this is part of the product data

        if (inStockCount === 0) {
            outOfStockItems++;
        } else if (inStockCount <= lowStockThreshold) {
            lowStockItems++;
        }
    });

    return (
        <div className={`flex flex-col w-full border-b-2 py-2 pb-6 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}>
            <p className='text-2xl font-bold py-4'>Inventory Summary</p>
            <div className='flex flex-col w-[50%] gap-2'>
                <div className={`flex justify-between font-semibold py-2`}>
                    <p className='border-b w-[60%]'>Total Items in Stock</p>
                    <p className='w-[40%] text-start border-b'>{totalItems} units</p>
                </div>
                <div className={`flex justify-between font-semibold py-2`}>
                    <p className='border-b w-[60%]'>Low Stock Items</p>
                    <p className='w-[40%] text-start border-b'>{lowStockItems} items</p>
                </div>
                <div className={`flex justify-between font-semibold py-2`}>
                    <p className='border-b w-[60%]'>Out of Stock Items</p>
                    <p className='w-[40%] text-start border-b'>{outOfStockItems} items</p>
                </div>
                <div className={`flex justify-between font-semibold py-2`}>
                    <p className='border-b w-[60%]'>Total Units Returned (Refunded)</p>
                    <p className='w-[40%] text-start border-b'>{totalReturned} units</p>
                </div>
                <div className={`flex justify-between font-semibold py-2`}>
                    <p className='border-b w-[60%]'>Units Under Review (RMA)</p>
                    <p className='w-[40%] text-start border-b'>{unitsUnderReview} units</p>
                </div>
                <div className={`flex justify-between font-semibold py-2`}>
                    <p className='border-b w-[60%]'>Replaced Units</p>
                    <p className='w-[40%] text-start border-b'>{replacedUnits} units</p>
                </div>
            </div>
        </div>
    );
};

export default InventorySummary;
