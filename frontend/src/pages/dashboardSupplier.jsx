import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import AdminSearchBar from '../components/adminSearchBar';
import { useNavigate } from 'react-router-dom';
import { API_DOMAIN } from '../utils/constants';
import { HiOutlineRefresh } from 'react-icons/hi';

const DashboardSupplier = () => {
    const { darkMode } = useAdminTheme();
    const baseURL = API_DOMAIN;
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accountStatus, setAccountStatus] = useState('all');
    const [sortOrder, setSortOrder] = useState('a-z');
    const [Company, setCompany] = useState(''); 
    const [ContactPerson, setContactPerson] = useState(''); 

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${baseURL}/supplier`);
                setSuppliers(response.data.data);
            } catch (err) {
                setError('Error fetching suppliers.');
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, [baseURL]);

    const handleAddSupplierClick = () => navigate('/add-supplier');
    const handleRowClick = (supplierId) => navigate(`/update-supplier/${supplierId}`);
    const handleResetFilters = () => {
        setSearchQuery('');
        setAccountStatus('all');
        setSortOrder('a-z');
    };

    const filteredSuppliers = suppliers
        .filter(supplier => (
            supplier.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            supplier.supplier_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            supplier.contact_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            supplier.products_and_services.toLowerCase().includes(searchQuery.toLowerCase()) ||
            supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
        ))
        .filter(supplier => accountStatus === 'all' || supplier.account_status === accountStatus);

    const sortedSuppliers = filteredSuppliers.sort((a, b) => {
        if (sortOrder === 'a-z') return a.company_name.localeCompare(b.company_name);
        if (sortOrder === 'z-a') return b.company_name.localeCompare(a.company_name);
        if (sortOrder === 'lowest-to-highest') return a.supplier_id - b.supplier_id;
        if (sortOrder === 'highest-to-lowest') return b.supplier_id - a.supplier_id;
        return 0;
    });

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4 w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Supplier</h1>
                    <div className='w-[90%] flex justify-end gap-2'>
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} />
                        <button
                            className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}
                            onClick={handleAddSupplierClick}
                        >
                            Add Supplier
                        </button>
                    </div>
                </div>
                <div className='flex gap-6'>
                    <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                        <div className='flex flex-col gap-3 h-[90%]'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col'>
                                <label htmlFor='ContactNumber' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CONTACT NUMBER</label>
                                         <input
                                            type="text"
                                            placeholder="Contact Number"
                                            className="w-full p-2 rounded-md border"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                </div>


                                    <input
                                        type="text"
                                        placeholder="Search Contact Person"
                                        className="w-full p-2 rounded-md border"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <select
                                        value={accountStatus}
                                        onChange={(e) => setAccountStatus(e.target.value)}
                                        className="w-full p-2 rounded-md border"
                                    >
                                        <option value="all">All Account Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="w-full p-2 rounded-md border"
                                    >
                                        <option value="a-z">A-Z</option>
                                        <option value="z-a">Z-A</option>
                                        <option value="lowest-to-highest">Supplier ID: Lowest to Highest</option>
                                        <option value="highest-to-lowest">Supplier ID: Highest to Lowest</option>
                                    </select>
                         </div>

                        </div>
                        <div className='flex flex-col gap-2 mb-auto h-[10%]'>
                            <button
                                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-gray-400 border-2 ${darkMode ? 'hover:bg-dark-textSecondary hover:scale-105' : 'hover:bg-light-textSecondary hover:scale-105'} transition-all duration-300`}
                                onClick={handleResetFilters}
                            >
                                <HiOutlineRefresh className="mr-2 text-2xl text-white" />
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl  ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : sortedSuppliers.length === 0 ? (
                            <div className='w-full h-full flex items-center justify-center'>
                                <p>No suppliers found.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className={`w-full text-sm font-semibold border-b-2 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'}`}>
                                        <th className="py-2 px-4">Company Name</th>
                                        <th className="py-2 px-4">Contact Person</th>
                                        <th className="py-2 px-4">Phone Number</th>
                                        <th className="py-2 px-4">Products & Services</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedSuppliers.map((supplier) => (
                                        <tr
                                            key={supplier._id}
                                            className={`border-b cursor-pointer ${darkMode ? 'bg-light-container1' : 'bg-dark-container1'}`}
                                            onClick={() => handleRowClick(supplier._id)}
                                        >
                                            <td className="py-3 px-4">{supplier.company_name}</td>
                                            <td className="py-3 px-4">{supplier.contact_person}</td>
                                            <td className="py-3 px-4">{supplier.phone_number}</td>
                                            <td className="py-3 px-4">{supplier.products_and_services}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSupplier;
