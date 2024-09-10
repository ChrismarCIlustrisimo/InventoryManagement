import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import AdminSearchBar from '../components/adminSearchBar';
import { useNavigate } from 'react-router-dom';

const DashboardSupplier = () => {
    const { darkMode } = useAdminTheme();
    const baseURL = "http://localhost:5555";
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${baseURL}/supplier`);
                setSuppliers(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching suppliers.');
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const handleAddSupplierClick = () => {
        navigate('/add-supplier');
    };

    const handleBackClick = () => {
        navigate('/inventory/product');
    };

    const handleRowClick = (supplierId) => {
        navigate(`/update-supplier/${supplierId}`);
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-BG' : 'bg-dark-BG'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4 w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>Supplier</h1>
                    <div className='w-full flex justify-end gap-2'>
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} />
                        <button className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'}`} onClick={handleAddSupplierClick}>
                            Add Supplier
                        </button>
                    </div>
                </div>
                <div className={`w-full h-[88%] overflow-auto rounded-lg ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : filteredSuppliers.length === 0 ? (
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-center py-4'>No suppliers found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className={`w-full text-sm font-semibold border-b-2 ${darkMode ? 'border-light-TABLE bg-light-CARD' : 'border-dark-TABLE bg-dark-CARD'}`}>
                                    <th className="py-2 px-4 w-[45%]">Supplier</th>
                                    <th className="py-2 px-4 w-[27%]">Contact Number</th>
                                    <th className="py-2 px-4 w-[27%]">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map((supplier) => (
                                    <tr
                                        key={supplier._id}
                                        className={`border-b cursor-pointer ${darkMode ? 'bg-light-CARD1' : 'bg-dark-CARD1'}`}
                                        onClick={() => handleRowClick(supplier._id)}
                                    >
                                        <td className="flex items-center py-3 px-4 w-[60%]">
                                            {supplier.image ? (
                                                <img
                                                    src={`${baseURL}/images/${supplier.image.substring(14)}`}
                                                    alt={supplier.name}
                                                    className="w-12 h-12 mr-2 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className={`w-12 h-12 flex items-center justify-center mr-2 rounded-md ${darkMode ? 'bg-light-TABLE' : 'bg-dark-TABLE'}`}>
                                                    <p className={`text-sm text-center ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>No image</p>
                                                </div>
                                            )}
                                            <p>{supplier.name}</p>
                                        </td>
                                        <td className="py-3 px-4 w-[20%]">{supplier.contact_number}</td>
                                        <td className="py-3 px-4 w-[20%]">{supplier.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardSupplier;
