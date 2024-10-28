import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import ProductHeader from '../../components/ProductHeader';

const Desktops = () => {
    const [query, setQuery] = useState('');
    const productsPerPage = 10;
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'HP Pavilion Gaming Desktop',
            price: 1000,
            image: 'https://cdn.pixabay.com/photo/2021/05/25/20/54/pc-6283996_1280.jpg',
            category: 'Gaming Desktops',
            brand: 'HP',
            discount: 10,
            subcategory: 'Gaming Builds',
        },
        {
            id: 2,
            name: 'Dell OptiPlex 3070',
            price: 800,
            image: 'https://cdn.pixabay.com/photo/2016/11/29/09/32/computer-1868715_1280.jpg',
            category: 'Desktops',
            brand: 'Dell',
            discount: 15,
            subcategory: 'Productivity Builds',
        },
        // Add more products here if needed
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        priceRange: [0, 2000],
        category: [],
        brand: [],
        discount: [],
        subcategory: [],
        isTopSelling: false, // Initialize isTopSelling filter
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
        const isPriceInRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        const isCategoryMatched = filters.category.length === 0 || filters.category.includes(product.category);
        const isBrandMatched = filters.brand.length === 0 || filters.brand.includes(product.brand);
        const isDiscountMatched = filters.discount.length === 0 || filters.discount.includes(product.discount);
        const isSubcategoryMatched = filters.subcategory.length === 0 || filters.subcategory.includes(product.subcategory);
        const isTopSellingMatched = !filters.isTopSelling || product.discount > 0; // Example condition for top-selling

        return (
            isMatched &&
            isPriceInRange &&
            isCategoryMatched &&
            isBrandMatched &&
            isDiscountMatched &&
            isSubcategoryMatched &&
            isTopSellingMatched // Include top-selling check
        );
    });

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const displayedProducts = filteredProducts.slice(startIndex, endIndex);

    return (
        <div className='w-full text-black flex flex-col bg-white'>
            <Navbar query={query} onQueryChange={handleQueryChange} cartItemCount={1} />
            <div className="container w-full mt-40 mx-auto md:p-4">
                <p className='p-4 mb-8'>Home &gt; Desktops</p>
                <div className='flex w-full'>
                    <div className="max-md:hidden min-w-[20%] max-w-[20%] bg-white border border-gray-200 p-4 rounded-lg shadow-lg space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Filters</h2>

                        <div className="border-b border-gray-300 pb-4 mb-4">
                            <h3 className="text-lg font-medium mb-2">Price Range</h3>
                            <div className="flex justify-between items-center mb-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="10000"
                                    value={filters.priceRange[0]}
                                    onChange={(e) => {
                                        const minPrice = Number(e.target.value);
                                        if (minPrice <= filters.priceRange[1]) {
                                            setFilters((prevFilters) => ({
                                                ...prevFilters,
                                                priceRange: [minPrice, filters.priceRange[1]],
                                            }));
                                        }
                                    }}
                                    className="w-1/3 border border-gray-300 p-1 text-center text-sm"
                                    placeholder="Min"
                                />
                                <span className="mx-2 text-sm">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="10000"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => {
                                        const maxPrice = Number(e.target.value);
                                        if (maxPrice >= filters.priceRange[0]) {
                                            setFilters((prevFilters) => ({
                                                ...prevFilters,
                                                priceRange: [filters.priceRange[0], maxPrice],
                                            }));
                                        }
                                    }}
                                    className="w-1/3 border border-gray-300 p-1 text-center text-sm"
                                    placeholder="Max"
                                />
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={10000}
                                value={filters.priceRange[0]}
                                onChange={(e) => {
                                    const minPrice = Number(e.target.value);
                                    if (minPrice <= filters.priceRange[1]) {
                                        setFilters((prevFilters) => ({
                                            ...prevFilters,
                                            priceRange: [minPrice, filters.priceRange[1]],
                                        }));
                                    }
                                }}
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

                        {/* Subcategory filter */}
                        <div>
                            <h3 className="font-semibold">Subcategories</h3>
                            {['Home Use Builds', 'Productivity Builds', 'Gaming Builds'].map((subcategory) => (
                                <label key={subcategory} className="block">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleFilterChange('subcategory', subcategory)}
                                        checked={filters.subcategory.includes(subcategory)}
                                    />
                                    {subcategory}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className='md:ml-6 w-full'>
                        <ProductHeader header={"Desktops"} />
                        <div className="m-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {displayedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {/* Pagination Controls */}
                        <div className="flex justify-between my-4">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={endIndex >= filteredProducts.length}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Desktops;
