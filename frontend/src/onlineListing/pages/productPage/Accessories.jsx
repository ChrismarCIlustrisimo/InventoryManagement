import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import ProductHeader from '../../components/ProductHeader';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

const Accessories = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [sortOrder, setSortOrder] = useState(''); // State for sorting
    const productsPerPage = 10;
    const baseURL = "http://localhost:5555";

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        priceRange: [0, 300],
        category: [],
        brand: [],
        discount: [],
        processorType: [],
        subcategory: [],
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/product`);
                const filteredData = response.data.data.filter(r => r.category === "Accessories");
                setProducts(filteredData); // Set the filtered products
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProducts();
    }, []);

    // Sorting function
    const sortProducts = (products, order) => {
        switch (order) {
            case 'A-Z':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'Z-A':
                return [...products].sort((a, b) => b.name.localeCompare(a.name));
            case 'Price: low to high':
                return [...products].sort((a, b) => a.selling_price - b.selling_price);
            case 'Price: high to low':
                return [...products].sort((a, b) => b.selling_price - a.selling_price);
            case 'Date: old to new':
                return [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'Date: new to old':
                return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return products;
        }
    };

    // Handle sort change
    const handleSortChange = (event) => {
        const selectedSortOrder = event.target.value;
        setSortOrder(selectedSortOrder);
        setProducts((prevProducts) => sortProducts(prevProducts, selectedSortOrder));
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => {
            const updatedFilter = prevFilters[filterType]?.includes(value)
                ? prevFilters[filterType].filter((item) => item !== value)
                : [...(prevFilters[filterType] || []), value];

            return { ...prevFilters, [filterType]: updatedFilter };
        });
    };

    return (
        <>
            <div className='w-full text-black flex flex-col bg-white'>
                <Navbar query={query} onQueryChange={handleQueryChange} cartItemCount={1} />
                <ToastContainer 
                position="bottom-right" 
                autoClose={3000} 
                hideProgressBar={false} 
                closeOnClick 
                pauseOnHover 
                draggable 
                theme="light"
            />
                <div className="container w-full mt-40 mx-auto md:p-4">
                    <p className='p-4 mb-8'>Home &gt; Accessories</p>

                    <div className='flex w-full'>
                        {/* Left Side Filter */}
                        <div className="max-md:hidden min-w-[20%] max-w-[20%] bg-white border border-gray-200 p-4 rounded-lg shadow-lg space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Filters</h2>


                            {/* Price Range */}
                            <div className="border-b border-gray-300 pb-4 mb-4">
                                <h3 className="text-lg font-medium mb-2">Price Range</h3>
                                <div className="flex justify-between items-center mb-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="10000"
                                        value={filters.priceRange[0]}
                                        onChange={(e) =>
                                            setFilters((prevFilters) => ({
                                                ...prevFilters,
                                                priceRange: [Number(e.target.value), filters.priceRange[1]],
                                            }))
                                        }
                                        className="w-1/3 border border-gray-300 p-1 text-center text-sm"
                                        placeholder="Min"
                                    />
                                    <span className="mx-2 text-sm">-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10000"
                                        value={filters.priceRange[1]}
                                        onChange={(e) =>
                                            setFilters((prevFilters) => ({
                                                ...prevFilters,
                                                priceRange: [filters.priceRange[0], Number(e.target.value)],
                                            }))
                                        }
                                        className="w-1/3 border border-gray-300 p-1 text-center text-sm"
                                        placeholder="Max"
                                    />
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={10000}
                                    value={filters.priceRange[0]}
                                    onChange={(e) =>
                                        setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            priceRange: [Number(e.target.value), filters.priceRange[1]],
                                        }))
                                    }
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm mt-1">
                                    <span>₱{filters.priceRange[0]}</span>
                                    <span>₱{filters.priceRange[1]}</span>
                                </div>
                            </div>

                            {/* Top Selling Checkbox */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Top Selling</h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.topSelling}
                                        onChange={() => setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            topSelling: !prevFilters.topSelling,
                                        }))}
                                        className="form-checkbox"
                                    />
                                    <span className="text-sm text-gray-700">Show Top Selling</span>
                                </div>
                            </div>

                            {/* Subcategory Filter */}
                            <div className="border-b border-gray-300 pb-4 mb-4">
                                <h3 className="text-lg font-medium mb-2">Subcategories</h3>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleFilterChange('subcategory', 'Cables')}
                                        className='mr-2'
                                    />
                                    Cables
                                </label>
                                <label className="block">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleFilterChange('subcategory', 'Earphones')}
                                        className='mr-2'
                                    />
                                    Earphones
                                </label>
                            </div>
                        </div>

                        {/* Right Side Products */}
                        <div className='md:ml-6 w-full'>
                            <ProductHeader header={"Accessories"} />
                            <div className='w-full px-6  flex items-center justify-end'>
                                <select 
                                    value={sortOrder} 
                                    onChange={handleSortChange} 
                                    className="border border-gray-300 p-1 rounded"
                                >
                                    <option value="">Sort By</option>
                                    <option value="A-Z">Alphabetically, A-Z</option>
                                    <option value="Z-A">Alphabetically, Z-A</option>
                                    <option value="Price: low to high">Price, low to high</option>
                                    <option value="Price: high to low">Price, high to low</option>
                                    <option value="Date: old to new">Date, old to new</option>
                                    <option value="Date: new to old">Date, new to old</option>
                                </select>
                            </div>
                            <div className="m-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {products.map((product) => (
                                    <ProductCard key={product.product_id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default Accessories;
