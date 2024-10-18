import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/adminSearchBar';
import DashboardNavbar from '../components/DashboardNavbar';
import { GrPowerReset } from 'react-icons/gr';

const DashboardSales = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";

    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [totalSalesSortBy, setTotalSalesSortBy] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [salesSortBy, setSalesSortBy] = useState("");
    const [sortBy, setSortBy] = useState(""); // Consider removing if not used

    // Define stockColors object
    const stockColors = {
        InStock: '#4CAF50', // Green
        OutOfStock: '#F44336', // Red
        LowStock: '#FF9800' // Orange
    };

    useEffect(() => {
        if (user && user.token) {
            fetchProducts();
        }
    }, [user]);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, category, salesSortBy, totalSalesSortBy, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${baseURL}/product`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error.message);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];
    
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
    
        // Filter by category
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }
    
        // Apply sorting by sales
        if (salesSortBy) {
            filtered = filtered.sort((a, b) => {
                switch (salesSortBy) {
                    case 'quantity_sold_desc':
                        return b.sales - a.sales;
                    case 'quantity_sold_asc':
                        return a.sales - b.sales;
                    default:
                        return 0;
                }
            });
        }
    
        // Apply sorting by total sales
        if (totalSalesSortBy) {
            filtered = filtered.sort((a, b) => {
                switch (totalSalesSortBy) {
                    case 'total_sales_desc':
                        return (b.selling_price * b.sales) - (a.selling_price * a.sales);
                    case 'total_sales_asc':
                        return (a.selling_price * a.sales) - (b.selling_price * b.sales);
                    default:
                        return 0;
                }
            });
        }
    
        setFilteredProducts(filtered);
    };

    const handleAddProductClick = () => {
        navigate('/report-page');
    };
    

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSalesSortByChange = (e) => {
        setSalesSortBy(e.target.value);
    };
    
    const handleTotalSalesSortByChange = (e) => {
        setTotalSalesSortBy(e.target.value);
    };
    
    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
    };
    
    const handleResetFilters = () => {
        setCategory("");
        setSalesSortBy("");
        setTotalSalesSortBy("");
        setSearchQuery("");
    };

    

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4'>
                <div className='flex items-center justify-center py-5'>
                    <div className='flex w-[30%]'>
                        <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            Sales
                        </h1>
                    </div>
                    <div className='w-full flex justify-end gap-2'>
                        <SearchBar query={searchQuery} onQueryChange={setSearchQuery}  placeholderMessage={'Search sales by product name'} />
                        <button
                            className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}
                            onClick={handleAddProductClick}
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col'>
                                <label htmlFor='category' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                    CATEGORY
                                </label>
                                <select
                                    id='category'
                                    value={category}
                                    onChange={handleCategoryChange}
                                    className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
                                    >
                                    <option value=''>Select Category</option>
                                    <option value='Components'>Components</option>
                                    <option value='Peripherals'>Peripherals</option>
                                    <option value='Accessories'>Accessories</option>
                                    <option value='PC Furniture'>PC Furniture</option>
                                    <option value='OS & Software'>OS & Software</option>
                                </select>
                            </div>

                            {/* Sales Sorting */}
                            <div className='flex flex-col'>
                                <label htmlFor='salesSortBy' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                    SALES
                                </label>
                                <select
                                    id='salesSortBy'
                                    value={salesSortBy}
                                    onChange={handleSalesSortByChange}
                                    className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
                                    >
                                    <option value=''>Select Sales Order</option>
                                    <option value='quantity_sold_desc'>Highest to Lowest</option>
                                    <option value='quantity_sold_asc'>Lowest to Highest</option>
                                </select>
                            </div>

                            {/* Total Sales Sorting */}
                            <div className='flex flex-col'>
                                <label htmlFor='totalSalesSortBy' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                    TOTAL SALES
                                </label>
                                <select
                                    id='totalSalesSortBy'
                                    value={totalSalesSortBy}
                                    onChange={handleTotalSalesSortByChange}
                                    className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
                                    >
                                    <option value=''>Select Total Sales Order</option>
                                    <option value='total_sales_desc'>Highest to Lowest</option>
                                    <option value='total_sales_asc'>Lowest to Highest</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div className='flex flex-col'>
                                <label htmlFor='sortBy' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>
                                    SORT BY
                                </label>
                                <select
                                    id='sortBy'
                                    value={sortBy}
                                    onChange={handleSortByChange}
                                    className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
                                    >
                                    <option value=''>Ascending - Descending (A-Z)</option>
                                    <option value='product_name_asc'>Ascending</option>
                                    <option value='product_name_desc'>Descending</option>
                                </select>
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
                    {/* Table */}
                    <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                        {filteredProducts.length > 0 ? (
                            <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                <thead className={`sticky top-0 z-10 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                                    <tr>
                                        <th className='p-2 text-left'>Product</th>
                                        <th className='p-2 text-center'>Category</th>
                                        <th className='p-2 text-center'>Sales</th>
                                        <th className='p-2 text-center'>Product Code</th>
                                        <th className='p-2 text-center'>Buying Price (PHP)</th>
                                        <th className='p-2 text-center'>Selling Price (PHP)</th>
                                        <th className='p-2 text-center'>Total Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product, index) => (
                                        <tr key={index} className={`border-b cursor-pointer ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                                            <td className='flex items-center justify-left p-2'>
                                                <img src={`${baseURL}/${product.image}`} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                                                <p className='text-sm'>{product.name}</p>
                                            </td>
                                            <td className='text-center text-sm'>{product.category}</td>
                                            <td className='text-center'>{product.sales}</td>
                                            <td className='text-center text-sm'>{product.product_id}</td>
                                            <td className='text-center'>{product.buying_price}</td>
                                            <td className='text-center'>{product.selling_price}</td>
                                            <td className='text-center'>{product.selling_price * product.sales}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='flex items-center justify-center h-[78vh] text-lg text-center'>
                                <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No products found matching the filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSales;
