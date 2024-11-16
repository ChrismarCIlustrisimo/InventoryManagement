import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import ProductHeader from '../../components/ProductHeader';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

const subcategories = [
    "Headphones",
    "Keyboard",
    "Mouse",
    "Monitor",
    "Speaker",
    "Webcam",
    "Microphone",
];

const Peripherals = () => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const productsPerPage = 10;
    const baseURL = "http://localhost:5555";
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/product`);
                const filteredData = response.data.data
                .filter(product => !product.isArchived && product.isApproved) // Filter by isArchived and isApproved
                .filter(r => r.category === "Peripherals")
                .filter(product => 
                    product.units && product.units.some(unit => unit.status === 'in_stock') // Ensure at least one unit is in_stock
                );                
                setProducts(filteredData);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProducts();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        priceRange: [0, 10000],
        category: [],
        brand: [],
        discount: [],
        subcategories: [],
        isTopSelling: false,
    });

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const handleFilterChange = (filterType, filterValue) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: prevFilters[filterType].includes(filterValue)
                ? prevFilters[filterType].filter((v) => v !== filterValue)
                : [...prevFilters[filterType], filterValue],
        }));
    };

    const filteredProducts = products.filter((product) => {
        const isMatched = product.name.toLowerCase().includes(query.toLowerCase());
        const isPriceInRange = product.selling_price >= filters.priceRange[0] && product.selling_price <= filters.priceRange[1];
        const isSubcategoryMatched = filters.subcategories.length === 0 || filters.subcategories.includes(product.sub_category);
        const isTopSellingMatched = !filters.isTopSelling || product.sales > 0; // Only show products with sales > 0

        return (
            isMatched &&
            isPriceInRange &&
            isSubcategoryMatched &&
            isTopSellingMatched
        );
    });

    // Function to get top selling products
    const getTopSellingProducts = (products) => {
        return products
            .filter(product => product.sales > 0) // Only include products with sales > 0
            .sort((a, b) => b.sales - a.sales) // Sort in descending order of sales
            .slice(0, 10); // Limit to the top 10
    };

    // If "Show Top Selling" is checked, filter to get top selling products
    const displayedProducts = filters.isTopSelling 
        ? getTopSellingProducts(filteredProducts) 
        : filteredProducts;

    const sortedProducts = [...displayedProducts].sort((a, b) => {
        if (sortOrder === "A-Z") return a.name.localeCompare(b.name);
        if (sortOrder === "Z-A") return b.name.localeCompare(a.name);
        if (sortOrder === "Price: low to high") return a.selling_price - b.selling_price;
        if (sortOrder === "Price: high to low") return b.selling_price - a.selling_price;
        if (sortOrder === "Date: old to new") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortOrder === "Date: new to old") return new Date(b.createdAt) - new Date(a.createdAt);
        return 0; // Default case: no sorting
    });

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const finalDisplayedProducts = sortedProducts.slice(startIndex, endIndex); // Get only 10 products for the current page

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
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
                    <p className='p-4 mb-8'>Home &gt; Peripherals</p>

                    <div className='flex w-full'>
                        {/* Left Side Filter */}
                        <div className="max-md:hidden min-w-[20%] max-w-[20%] bg-white border border-gray-200 p-4 rounded-lg shadow-lg space-y-6 h-[700px] overflow-y-auto">
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

                            <div>
                                <h3 className="text-lg font-medium mb-2">Top Selling</h3>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.isTopSelling}
                                        onChange={() => setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            isTopSelling: !prevFilters.isTopSelling,
                                        }))}
                                        className="form-checkbox"
                                    />
                                    <span className="text-sm text-gray-700">Show Top Selling</span>
                                </div>
                            </div>

                            {/* Subcategory Filter */}
                            <div className="border-b border-gray-300 pb-4 mb-4">
                                <h3 className="text-lg font-medium mb-2">Subcategory</h3>
                                {subcategories.map((subcategory) => (
                                    <label key={subcategory} className="block">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleFilterChange('subcategories', subcategory)}
                                            className='mr-2'
                                        />
                                        {subcategory}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Products */}
                        <div className='md:ml-6 w-full  relative flex flex-col justify-between'>
                            <ProductHeader header={"Peripherals"} />
                            <div className='w-full px-6 flex items-center justify-end'>
                                <div className='flex items-center'>
                                    <label htmlFor="sort" className="mr-2">Sort By:</label>
                                    <select id="sort" value={sortOrder} onChange={handleSortChange} className="border border-gray-300 p-1 rounded">
                                        <option value="">None</option>
                                        <option value="A-Z">Alphabetically, A-Z</option>
                                        <option value="Z-A">Alphabetically, Z-A</option>
                                        <option value="Price: low to high">Price: low to high</option>
                                        <option value="Price: high to low">Price: high to low</option>
                                        <option value="Date: old to new">Date: old to new</option>
                                        <option value="Date: new to old">Date: new to old</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
                                {finalDisplayedProducts.length > 0 ? (
                                    finalDisplayedProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))
                                ) : (
                                    <p className='w-full text-center'>No products found</p>
                                )}
                            </div>
                            <div className="flex justify-between  mt-8  p-6">
                                {/* Pagination Controls */}
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className='mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sortedProducts.length / productsPerPage)))}
                                    disabled={currentPage === Math.ceil(sortedProducts.length / productsPerPage)}
                                    className='mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Peripherals;
