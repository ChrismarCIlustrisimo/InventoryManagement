import React, { useState } from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import SearchBar from '../components/adminSearchBar';

const DashboardSupplier = () => {
    const { darkMode } = useAdminTheme();
    const baseURL = "http://localhost:5555";
    const { user } = useAuthContext();
    
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddProductClick = () => {
        console.log('Add Product clicked');
    };

    // Array of supplier data
    const suppliers = [
        {
            name: 'PC Express',
            contact: '+63 934 XXX XXXX',
            email: 'pcexpress@gmail.com',
            imageUrl: 'https://via.placeholder.com/50x50.png?text=50x50'
        },
        {
            name: 'Easy PC',
            contact: '+63 923 XXX XXXX',
            email: 'easypc@gmail.com',
            imageUrl: 'https://via.placeholder.com/50x50.png?text=50x50'
        },
        {
            name: 'PC Hub',
            contact: '+63 943 XXX XXXX',
            email: 'pchubcomputers@gmail.com',
            imageUrl: 'https://via.placeholder.com/50x50.png?text=50x50'
        },
        {
            name: 'DynaQuest',
            contact: '+63 906 XXX XXXX',
            email: 'dynaquest-pc@gmail.com',
            imageUrl: 'https://via.placeholder.com/50x50.png?text=50x50'
        }
    ];

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-BG' : 'bg-dark-BG'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4 w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>Supplier</h1>
                    <div className='w-full flex justify-end gap-2'>
                        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
                        <button className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'}`} onClick={handleAddProductClick}>
                            Add Supplier
                        </button>
                    </div>
                </div>
                <div className='w-full h-[88%] overflow-auto rounded-lg'>
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`w-full text-sm font-semibold border-b-2 ${darkMode ? 'border-light-TABLE bg-light-CARD' : 'border-dark-TABLE bg-dark-CARD'}`}>
                                <th className="py-2 px-4 w-[45%]">Product</th>
                                <th className="py-2 px-4 w-[27%]">Contact Number</th>
                                <th className="py-2 px-4 w-[27%]">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, index) => (
                                <tr key={index} className={`border-b cursor-pointer ${darkMode ? 'bg-light-CARD1' : 'bg-dark-CARD1'}`}>
                                    <td className="flex items-center py-3 px-4 w-[60%]">
                                        <img src={supplier.imageUrl} alt="Placeholder" className="w-12 h-12 mr-2" />
                                        <p>{supplier.name}</p>
                                    </td>
                                    <td className="py-3 px-4 w-[20%]">{supplier.contact}</td>
                                    <td className="py-3 px-4 w-[20%]">{supplier.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardSupplier;
