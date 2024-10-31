import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import ProductHeader from '../../components/ProductHeader';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

const Peripherals = () => {
    const [query, setQuery] = useState('');
    const productsPerPage = 10;
    const [products, setProducts] = useState([]);
    const baseURL = "http://localhost:5555";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/product`);
                const filteredData = response.data.data.filter(r => r.category === "Peripherals");
                setProducts(filteredData); // Set the filtered products
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProducts();
    }, []);


    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        priceRange: [0, 200],
        category: [],
        brand: [],
        discount: [],
        isTopSelling: false, // New filter for top-selling products
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

    const handlePriceChange = (index, value) => {
        setFilters((prevFilters) => {
            const newPriceRange = [...prevFilters.priceRange];
            newPriceRange[index] = Number(value);
            return { ...prevFilters, priceRange: newPriceRange };
        });
    };



    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    return (
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
                    <div className="max-md:hidden min-w-[20%] max-w-[20%] bg-white border border-gray-200 p-4 rounded-lg shadow-lg space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>

                        {/* Price Range Filter */}
                        <div className="border-b border-gray-300 pb-4 mb-4">
                            <h3 className="text-lg font-medium mb-2">Price Range</h3>
                            <div className="flex justify-between items-center mb-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="10000"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => handlePriceChange(0, e.target.value)}
                                    className="w-1/3 border border-gray-300 p-1 text-center text-sm"
                                    placeholder="Min"
                                />
                                <span className="mx-2 text-sm">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="10000"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => handlePriceChange(1, e.target.value)}
                                    className="w-1/3 border border-gray-300 p-1 text-center text-sm"
                                    placeholder="Max"
                                />
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={10000}
                                value={filters.priceRange[0]}
                                onChange={(e) => handlePriceChange(0, e.target.value)}
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

                        {/* Category Filter */}
                        <div>
                            <h3 className="font-semibold">Categories</h3>
                            {["CCTV Camera", "Headset", "Keyboard", "Keyboard and Mouse Combo", "Monitor", "Mouse", "Network Devices", "Printer & Scanner", "Projector", "Audio Recorder", "Speaker", "UPS & AVR", "Web & Digital Camera"].map((category) => (
                                <div key={category}>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleFilterChange('category', category)}
                                        checked={filters.category.includes(category)}
                                    />
                                    <label className="ml-2">{category}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='md:ml-6 w-full'>
                        <ProductHeader header={"Peripherals"} />
                        <div className="m-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Peripherals;
