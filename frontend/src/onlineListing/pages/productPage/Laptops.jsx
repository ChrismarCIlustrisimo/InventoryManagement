    import React, { useEffect, useState } from 'react';
    import Navbar from '../../components/Navbar';
    import Footer from '../../components/Footer';
    import ProductCard from '../../components/ProductCard';
    import ProductHeader from '../../components/ProductHeader';
    import axios from 'axios';
    import { ToastContainer } from 'react-toastify';

    const Laptops = () => {
        const [query, setQuery] = useState('');
        const [sortOrder, setSortOrder] = useState(''); // Added sortOrder state
        const productsPerPage = 10;
        const [products, setProducts] = useState([]);
        const baseURL = "http://localhost:5555";

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/product`, {
                    params: { category: 'Laptops' },
                });
                const products = response.data.data; 
                const laptopProducts = products.filter(product => product.category === 'Laptops');
                setProducts(laptopProducts);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };
        

        useEffect(() => {
            fetchProducts();
        }, []);

        const [currentPage, setCurrentPage] = useState(1);
        const [filters, setFilters] = useState({
            priceRange: [0, 10000],
            category: [],
            subcategory: [],
            processorType: [],
            brand: [],
            discount: [],
            isTopSelling: false, // Added top selling filter
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
            const isSubcategoryMatched = filters.subcategory.length === 0 || filters.subcategory.includes(product.sub_category);
            const isTopSellingMatched = !filters.isTopSelling || product.sales > 100;
        
            console.log('Product:', product, 'Matches:', { isMatched, isPriceInRange, isSubcategoryMatched, isTopSellingMatched }); // Log matches
        
            return (
                isMatched &&
                isPriceInRange &&
                isSubcategoryMatched &&
                isTopSellingMatched
            );
        });
        
        

        // Sort filtered products based on sortOrder
        const sortedProducts = [...filteredProducts].sort((a, b) => {
            switch (sortOrder) {
                case "A-Z":
                    return a.name.localeCompare(b.name);
                case "Z-A":
                    return b.name.localeCompare(a.name);
                case "Price: low to high":
                    return a.selling_price - b.selling_price;
                case "Price: high to low":
                    return b.selling_price - a.selling_price;
                case "Date: old to new":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "Date: new to old":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0; // No sorting
            }
        });

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;

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
                        <p className='p-4 mb-8'>Home &gt; Laptops</p>

                        <div className='flex w-full'>
                            {/* left side Filter HERE */}
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
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleFilterChange('subcategory', 'Laptops')}
                                            className='mr-2'

                                        />
                                        Laptops
                                    </label>
                                    <label className="block">
                                        <input
                                            type="checkbox"
                                            onChange={() => handleFilterChange('subcategory', 'Chromebooks')}
                                            className='mr-2'
                                        />
                                        Chromebooks
                                    </label>
                                </div>
                            </div>

                            {/* right side Products HERE */}
                            <div className='md:ml-6 w-full'>
                                <ProductHeader header={"Laptops"} />
                                <div className='w-full px-6 flex items-center justify-end'>
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
                                      {products.length > 0 ? (
                                        products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))
                                    ) : (
                                        <p>No products found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        );
    };

    export default Laptops;
