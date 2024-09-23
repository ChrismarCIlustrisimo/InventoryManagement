import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import React, { useState, useEffect } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/adminSearchBar';
import { GrPowerReset } from 'react-icons/gr';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CustomerModal from '../components/CustomerModal';


const DashboardCustomer = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const [searchQuery, setSearchQuery] = useState("");
    const [emailQuery, setEmailQuery] = useState("");
    const [addressQuery, setAddressQuery] = useState("");
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [contactNumber, setContactNumber] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${baseURL}/customer`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                
                const validCustomers = response.data.data.filter(customer => 
                    customer.name && customer.email && customer.phone && customer.address
                );
    
                setCustomers(validCustomers);
                setFilteredCustomers(validCustomers);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();   
    }, [user]);
    
    const handleSearch = () => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();
        const lowerCaseEmailQuery = emailQuery.toLowerCase();
        const lowerCaseAddressQuery = addressQuery.toLowerCase();
        const lowerCaseContactNumber = contactNumber.toLowerCase();

        const filtered = customers.filter(customer => {
            const matchesName = customer.name.toLowerCase().includes(lowerCaseSearchQuery);
            const matchesEmail = customer.email.toLowerCase().includes(lowerCaseEmailQuery);
            const matchesAddress = customer.address.toLowerCase().includes(lowerCaseAddressQuery);
            const matchesContactNumber = customer.phone.startsWith(lowerCaseContactNumber);

            return (matchesName || lowerCaseSearchQuery === '') &&
                   (matchesEmail || lowerCaseEmailQuery === '') &&
                   (matchesAddress || lowerCaseAddressQuery === '') &&
                   (matchesContactNumber || lowerCaseContactNumber === '');
        });

        setFilteredCustomers(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery, emailQuery, addressQuery, contactNumber, customers]);

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };
    
    const handleSortByChange = (e) => {
        const sortValue = e.target.value;
        setSortBy(sortValue);

        let sortedCustomers = [...filteredCustomers];
        if (sortValue) {
            const [field, order] = sortValue.split('_');
            sortedCustomers.sort((a, b) => {
                if (field === 'name') {
                    return order === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
                }
                // Add sorting logic for other fields here if needed
                return 0;
            });
        }
        setFilteredCustomers(sortedCustomers);
    };

    const handleResetFilters = () => {
        setCategory('');
        setSortBy('');
        setContactNumber('');
        setEmailQuery('');
        setAddressQuery('');
        setSearchQuery('');
        setFilteredCustomers(customers);
    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleUpdateClick = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };
    

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`${baseURL}/customer/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setFilteredCustomers(filteredCustomers.filter(customer => customer._id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

// Update the handleUpdate function
const handleUpdate = (updatedCustomer) => {
    setFilteredCustomers(filteredCustomers.map(customer => 
        customer._id === selectedCustomer._id ? { ...customer, ...updatedCustomer } : customer
    ));
};

    


    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <div className={`pt-[70px] px-6 py-4 h-full w-full`}>
                <div className='flex items-center justify-center py-5'>
                    <div className='flex w-full'>
                        <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            Customer
                        </h1>
                        <SearchBar query={searchQuery} onQueryChange={setSearchQuery}  placeholderMessage={'Search Customer by name'} />
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                        <div className='flex flex-col gap-4 justify-between h-full'>
                            {/* Category Filter */}
                            <div className='flex flex-col gap-4'>
                                {/* Sort By Filter */}
                                <div className='flex flex-col'>
                                    <label htmlFor='sortBy' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                        SORT BY
                                    </label>
                                    <select
                                        id='sortBy'
                                        value={sortBy}
                                        onChange={handleSortByChange}
                                        className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'}`}
                                    >
                                        <option value=''>Select sorting</option>
                                        <option value='name_asc'>Name Ascending</option>
                                        <option value='name_desc'>Name Descending</option>
                                        {/* Add more sorting options here */}
                                    </select>
                                </div>
                                    {/* Email Filter */}
                                    <div className='flex flex-col'>
                                        <label htmlFor='emailQuery' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                            Filter by Email
                                        </label>
                                        <input
                                            id='emailQuery'
                                            type='text'
                                            value={emailQuery}
                                            onChange={(e) => setEmailQuery(e.target.value)}
                                            placeholder='Enter email'
                                            className={`border rounded p-2 my-1 border-none outline-none placeholder-white ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'}`}
                                        />
                                    </div>

                                    {/* Address Filter */}
                                    <div className='flex flex-col'>
                                        <label htmlFor='addressQuery' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                            Filter by Address
                                        </label>
                                        <input
                                            id='addressQuery'
                                            type='text'
                                            value={addressQuery}
                                            onChange={(e) => setAddressQuery(e.target.value)}
                                            placeholder='Enter address'
                                            className={`border rounded p-2 my-1 border-none outline-none placeholder-white ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'}`}
                                        />
                                    </div>

                                    {/* Contact Number Filter */}
                                    <div className='flex flex-col'>
                                        <label htmlFor='contactNumber' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                            Filter by Contact Number
                                        </label>
                                        <input
                                            id='contactNumber'
                                            type='text'
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            placeholder='Enter contact number prefix'
                                            className={`border rounded p-2 my-1 border-none outline-none placeholder-white ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary light:text-light-textPrimary'}`}
                                        />
                                    </div>

                            </div>

                            <div className='flex flex-col gap-2'>
                                <button
                                    className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium ${darkMode ? 'bg-light-textSecondary text-dark-textPrimary' : 'bg-dark-textSecondary text-dark-textPrimary' }`}
                                    onClick={handleResetFilters}
                                >
                                        <GrPowerReset className='mr-2' />
                                        <p>Reset Filters</p>
                                </button>
                            </div>
                        </div>
                        <CustomerModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            customer={selectedCustomer}
                            onUpdate={handleUpdate}
                        />
                    </div>
                    <div className={`h-[76vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container1' : 'dark:bg-dark-container1'}`}>
                        {filteredCustomers.length > 0 ? (
                            <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                <thead className={`sticky top-0 z-10 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                                    <tr>
                                        <th className='p-2 text-left'>Name</th>
                                        <th className='p-2 text-center'>Email</th>
                                        <th className='p-2 text-center'>Contact Number</th>
                                        <th className='p-2 text-center'>Address</th>
                                        <th className='p-2 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer._id} className={`border-b ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                                            <td className='p-4 text-left'>{customer.name}</td>
                                            <td className='p-4 text-center'>{customer.email}</td>
                                            <td className='p-4 text-center'>{customer.phone}</td>
                                            <td className='p-4 text-center'>{customer.address}</td>
                                            <td className='p-4 flex justify-center items-center'>
                                                <FaEdit className='text-blue-500 cursor-pointer' onClick={() => handleUpdateClick(customer)} />
                                                <FaTrash className='text-red-500 cursor-pointer ml-2' onClick={() => handleDeleteClick(customer._id)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='flex items-center justify-center h-[76vh] text-lg text-center'>
                                <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No customers found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCustomer;
