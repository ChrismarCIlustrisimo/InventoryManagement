import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import AdminSearchBar from '../components/adminSearchBar';
import { useNavigate } from 'react-router-dom';
import { API_DOMAIN } from '../utils/constants';
import { HiOutlineRefresh } from 'react-icons/hi';
import AddSupplier from './AddSupplier';
import ViewSupplier from './ViewSupplier';
import { toast,ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css';
import EditSupplier from './EditSupplier';
import { GrView } from "react-icons/gr";
import { BiEdit } from "react-icons/bi";

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
    const [sortOrder, setSortOrder] = useState('');
    const [supplierName, setSupplierName] = useState(''); 
    const [category, setCategory] = useState(''); 
    const [showAddSupplierPopup, setShowAddSupplierPopup] = useState(false);
    const [viewSupplier, setViewSupplier] = useState(null);  // State for viewing supplier details
    const [editSupplier, setEditSupplier] = useState(null); // State for editing supplier

    const handleAddSupplierClick = () => setShowAddSupplierPopup(true);
    const closeAddSupplierPopup = () => setShowAddSupplierPopup(false);

    const handleViewSupplier = (supplier) => {
        setViewSupplier(supplier);  // Set selected supplier to view
    };

    const closeViewSupplierPopup = () => {
        setViewSupplier(null);  // Close the view popup
    };


    const handleEditSupplier = (supplier) => {
        setEditSupplier(supplier);  // Set selected supplier to edit
    };

    const closeEditSupplierPopup = () => {
        setEditSupplier(null);  // Close the edit popup
    };


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
    }, [baseURL, closeAddSupplierPopup, closeAddSupplierPopup]);

    const handleResetFilters = () => {
        setSearchQuery('');
        setSupplierName('');
        setCategory('');
        setSortOrder('');
    };

    const filteredSuppliers = suppliers
    .filter((supplier) => {
        // Search query filter
        const matchesSearchQuery =
            supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase());

        // Company name filter
        const matchesSupplierName =
            supplierName === '' || supplier.contact_person.toLowerCase().includes(supplierName.toLowerCase());

        // Category filter
        const matchesCategory = category === '' || supplier.categories?.includes(category);

        // Account status filter
        const matchesAccountStatus = accountStatus === 'all' || supplier.account_status === accountStatus;

        return matchesSearchQuery && matchesSupplierName && matchesCategory && matchesAccountStatus;
    });

const sortedSuppliers = filteredSuppliers.sort((a, b) => {
    if (sortOrder === 'a-z') return a.supplier_name.localeCompare(b.supplier_name);
    if (sortOrder === 'z-a') return b.supplier_name.localeCompare(a.supplier_name);
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
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search product by contact person'} />
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
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-col'>
                                    <label htmlFor='SupplierName' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>COMPANY NAME</label>
                                            <input
                                                type="text"
                                                placeholder="Search Company name"
                                                className={`border rounded p-2 ${supplierName === '' 
                                                    ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                                    : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                                                  outline-none font-semibold`}
                                                value={supplierName}
                                                onChange={(e) => setSupplierName(e.target.value)}
                                            />
                                </div>
                                <div className='flex flex-col'>
                                    <label htmlFor='Category' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PRODUCT CATEGORIES</label>
                                    <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className={`border rounded p-2 ${category === '' 
                                                ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                                : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                                              outline-none font-semibold`}
                                        >
                                            <option value="">All</option>
                                            <option value="Components" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Components</option>
                                            <option value="Peripherals" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Peripherals</option>
                                            <option value="Accessories" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Accessories</option>
                                            <option value="PC Furniture" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>PC Furniture</option>
                                            <option value="OS & Software" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>OS & Software</option>
                                            <option value="Laptops" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Laptops</option>
                                            <option value="Desktops" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Desktops</option>
                                        </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label htmlFor='ContactNumber' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SORT BY</label>
                                    <select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            className={`border rounded p-2 ${sortOrder === '' 
                                                ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                                                : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                                              outline-none font-semibold`}                                        >
                                            <option value="" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Default</option>
                                            <option value="a-z" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Supplier name A-Z</option>
                                            <option value="z-a" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Supplier name Z-A</option>
                                            <option value="lowest-to-highest" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Supplier ID: Lowest to Highest</option>
                                            <option value="highest-to-lowest" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Supplier ID: Highest to Lowest</option>
                                        </select>
                                </div>




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
                            <div className='w-full h-full flex items-center justify-center text-4xl '>
                                <p>{error}</p>
                            </div>
                        ) : sortedSuppliers.length === 0 ? (
                            <div className='w-full h-full flex items-center justify-center text-4xl '>
                                <p>No suppliers found.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className={`w-full text-sm font-semibold border-b-2 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'}`}>
                                        <th className="py-2 px-4">Supplier ID</th>
                                        <th className="py-2 px-4">Company Name</th>
                                        <th className="py-2 px-4">Contact Person</th>
                                        <th className="py-2 px-4">Phone Number</th>
                                        <th className="py-2 px-4">Categories</th>
                                        <th className="py-2 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedSuppliers.map((supplier) => (
                                        <tr
                                            key={supplier._id}
                                            className={`border-b cursor-pointer ${darkMode ? 'bg-light-container1' : 'bg-dark-container1'}`}
                                        >
                                            <td className="py-3 px-4">{supplier.supplier_id}</td>
                                            <td className="py-3 px-4">{supplier.supplier_name}</td>
                                            <td className="py-3 px-4">{supplier.contact_person}</td>
                                            <td className="py-3 px-4">{supplier.phone_number}</td>
                                            <td className="py-3 px-4">
                                                {supplier.categories && Array.isArray(supplier.categories) ? supplier.categories[0] : supplier.categories}
                                            </td>
                                            <td className="py-3 px-4">
                                                    <div className="relative inline-block group">
                                                            <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                                                onClick={() => handleViewSupplier(supplier)}>
                                                                <GrView size={25} />
                                                            </button>
                                                            <span className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${darkMode ?  'bg-gray-200 text-black' : 'bg-black text-white'}`}>
                                                                View
                                                            </span>
                                                    </div>
                                                    <div className="relative inline-block group">
                                                            <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                                                    onClick={() => handleEditSupplier(supplier)} >
                                                                    <BiEdit size={25} />
                                                            </button>
                                                            <span className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${ darkMode ?  'bg-gray-200 text-black' : 'bg-black text-white'}`} >
                                                            Edit
                                                            </span>
                                                    </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {showAddSupplierPopup && (
                        <div className={`fixed w-full h-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
                            <div className="bg-white rounded-lg w-[36%] h-[96%]">
                                <AddSupplier onClose={closeAddSupplierPopup} />
                            </div>
                        </div>
                    )}
                 {viewSupplier && <ViewSupplier supplier={viewSupplier} onClose={closeViewSupplierPopup} />} {/* View Supplier Popup */}
              {/* Show Edit Supplier Popup as a modal */}
                {editSupplier && (
                        <div className={`fixed w-full h-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
                        <div className="bg-white rounded-lg w-[36%] h-[96%]">
                        <EditSupplier supplier={editSupplier} onClose={closeEditSupplierPopup} />
                    </div>
                </div>
             )}

                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DashboardSupplier;
