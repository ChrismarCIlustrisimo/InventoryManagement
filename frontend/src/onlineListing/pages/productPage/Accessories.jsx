import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import ProductHeader from '../../components/ProductHeader';

const Accessories = () => {
      const [query, setQuery] = useState('');
      const productsPerPage = 10;
      const [products, setProducts] = useState([
            {
                  id: 1,
                  name: 'Samsung SSD 1TB',
                  price: 120,
                  image: 'https://cdn.pixabay.com/photo/2017/06/07/12/42/hard-disk-2389581_1280.jpg',
                  category: 'Storage',
                  brand: 'Samsung',
                  discount: 5,
                  topSelling: true // Added topSelling flag
            },
            {
                  id: 2,
                  name: 'Corsair RAM 16GB',
                  price: 80,
                  image: 'https://cdn.pixabay.com/photo/2014/08/26/20/57/memory-428826_1280.jpg',
                  category: 'Memory',
                  brand: 'Corsair',
                  discount: 10,
                  topSelling: false // Added topSelling flag
            },
            // Add more products here if needed
      ]);

      const [currentPage, setCurrentPage] = useState(1);
      const [filters, setFilters] = useState({
            priceRange: [0, 300],
            category: [],
            brand: [],
            discount: [],
            processorType: [],
            subcategory: [], // New subcategory filter
            topSelling: false // New top-selling filter
      });
    
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

      const displayedProducts = products.filter((product) => {
            const isInPriceRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
            const isInCategory = filters.category.length === 0 || filters.category.includes(product.category);
            const isInBrand = filters.brand.length === 0 || filters.brand.includes(product.brand);
            const isInDiscount = filters.discount.length === 0 || filters.discount.includes(product.discount);
            const isInSubcategory = filters.subcategory.length === 0 || filters.subcategory.includes(product.subcategory);
            const isTopSelling = !filters.topSelling || product.topSelling; // Check for top-selling

            return isInPriceRange && isInCategory && isInBrand && isInDiscount && isInSubcategory && isTopSelling && 
                   product.name.toLowerCase().includes(query.toLowerCase());
      });

      return (
            <>
                  <div className='w-full text-black flex flex-col bg-white'>
                        <Navbar query={query} onQueryChange={handleQueryChange} cartItemCount={1} />

                        <div className="container w-full mt-40 mx-auto md:p-4">
                              <p className='p-4 mb-8'>Home &gt; Accessories</p>

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

                                          {/* Subcategory */}
                                          <div className="border-b border-gray-300 pb-4 mb-4">
                                                <h3 className="text-lg font-medium mb-2">Subcategories</h3>
                                                {['Cables', 'Earphones', 'Gaming Surface', 'Power Bank'].map((subcategory) => (
                                                      <div key={subcategory} className="flex items-center space-x-2">
                                                            <input
                                                                  type="checkbox"
                                                                  checked={filters.subcategory.includes(subcategory)}
                                                                  onChange={() => handleFilterChange('subcategory', subcategory)}
                                                                  className="form-checkbox"
                                                            />
                                                            <span className="text-sm text-gray-700">{subcategory}</span>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>

                                    {/* right side Products HERE */}
                                    <div className='md:ml-6 w-full'>
                                          <ProductHeader header={"Accessories"} />
                                          <div className="m-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {displayedProducts.map((product) => (
                                                      <ProductCard key={product.id} product={product} />
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
