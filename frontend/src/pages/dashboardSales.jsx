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
    const [sortBy, setSortBy] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

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
    }, [searchQuery, category, sortBy, products]);

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

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }

        if (sortBy) {
            filtered = filtered.sort((a, b) => {
                switch (sortBy) {
                    case 'price_asc':
                        return a.selling_price - b.selling_price;
                    case 'price_desc':
                        return b.selling_price - a.selling_price;
                    case 'product_name_asc':
                        return a.name.localeCompare(b.name);
                    case 'product_name_desc':
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });
        }

        setFilteredProducts(filtered);
    };

    const handleAddProductClick = () => {
        console.log("Generate Report button clicked");
        navigate('/generate-report');
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleResetFilters = () => {
        setCategory("");
        setSortBy("");
        setSearchQuery("");
    };

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-BG' : 'bg-dark-BG'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4'>
                <div className='flex items-center justify-center py-5'>
                    <div className='flex w-[30%]'>
                        <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                            Sales
                        </h1>
                    </div>
                    <div className='w-full flex justify-end gap-2'>
                        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
                        <button
                            className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-ACCENT' : 'bg-dark-ACCENT'}`}
                            onClick={handleAddProductClick}
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-CARD' : 'bg-dark-CARD'}`}>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col'>
                                <label htmlFor='category' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>
                                    CATEGORY
                                </label>
                                <select
                                    id='category'
                                    value={category}
                                    onChange={handleCategoryChange}
                                    className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                                >
                                    <option value=''>Select Category</option>
                                    <option value='Components'>Components</option>
                                    <option value='Peripherals'>Peripherals</option>
                                    <option value='Accessories'>Accessories</option>
                                    <option value='PC Furniture'>PC Furniture</option>
                                    <option value='OS & Software'>OS & Software</option>
                                </select>
                            </div>

                            <div className='flex flex-col'>
                                <label htmlFor='sortBy' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>
                                    QUANTITY SOLD
                                </label>
                                <select
                                    id='sortBy'
                                    value={sortBy}
                                    onChange={handleSortByChange}
                                    className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                                >
                                    <option value=''>Ascending - Descending</option>
                                    <option value='quantity_sold_asc'>Ascending</option>
                                    <option value='quantity_sold_desc'>Descending</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor='sortBy' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>
                                    SORT BY
                                </label>
                                <select
                                    id='sortBy'
                                    value={sortBy}
                                    onChange={handleSortByChange}
                                    className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                                >
                                    <option value=''>Ascending - Descending (A-Z)</option>
                                    <option value='product_name_asc'>Ascending</option>
                                    <option value='product_name_desc'>Descending</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <button
                                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide ${darkMode ? 'bg-light-TABLE text-dark-TEXT' : 'bg-dark-TABLE text-light-TEXT'}`}
                                onClick={handleResetFilters}
                            >
                                <GrPowerReset className='mr-2' />
                                <p>Reset Filters</p>
                            </button>
                        </div>
                    </div>
                    {/* Table */}
                    <div className={`h-[76vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1'}`}>
                        {filteredProducts.length > 0 ? (
                            <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
                                <thead className={`sticky top-0 z-10 ${darkMode ? 'border-light-TABLE bg-light-CARD' : 'border-dark-TABLE bg-dark-CARD'} border-b text-sm`}>
                                    <tr>
                                        <th className='p-2 text-left'>Product</th>
                                        <th className='p-2 text-center'>Category</th>
                                        <th className='p-2 text-center'>In-stock</th>
                                        <th className='p-2 text-center'>Stock Status</th>
                                        <th className='p-2 text-center'>Product Code</th>
                                        <th className='p-2 text-center'>Buying Price (PHP)</th>
                                        <th className='p-2 text-center'>Selling Price (PHP)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product, index) => (
                                        <tr key={index} onClick={() => handleRowClick(product._id)} className={`border-b cursor-pointer ${darkMode ? 'border-light-TABLE' : 'border-dark-TABLE'}`}>
                                            <td className='flex items-center justify-left p-2'>
                                                <img src={`${baseURL}/images/${product.image.substring(14)}`} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                                                <p className='text-sm'>{product.name}</p>
                                            </td>
                                            <td className='text-center text-sm'>{product.category}</td>
                                            <td className='text-center'>{product.quantity_in_stock}</td>
                                            <td className='text-xs text-center' style={{ color: stockColors[product.current_stock_status] || '#ffffff' }}>
                                                {product.current_stock_status}
                                            </td>
                                            <td className='text-center text-sm'>{product.product_id}</td>
                                            <td className='text-center'>{product.buying_price}</td>
                                            <td className='text-center'>{product.selling_price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='flex items-center justify-center h-[76vh] text-lg text-center'>
                                <p className={`${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>No products found matching the filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSales;
