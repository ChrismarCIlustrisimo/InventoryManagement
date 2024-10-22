import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const Products = () => {
      const [query, setQuery] = useState('');
      const productsPerPage = 10;
      const [products, setProducts] = useState([
            {
                  id: 1,
                  name: 'Acer Predator Helios 16 PH16-72-96H6 Gaming Laptop (Abyssal Black)',
                  price: 1500,
                  image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_1280.jpg', // Changed to image to match ProductCard
                  category: 'Gaming Laptops',
                  processorType: 'Intel i5',
                  brand: 'Acer',
                  discount: 10
            },
            {
                  id: 2,
                  name: 'Nigga byte Black Nigger Laptop (Black)',
                  price: 6900,
                  image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_1280.jpg', // Changed to image to match ProductCard
                  category: 'Laptops',
                  processorType: 'Intel i7',
                  brand: 'Digabyte',
                  discount: 20
            },
            // Add more products here if needed
      ]);

      const [currentPage, setCurrentPage] = useState(1);
      const [filters, setFilters] = useState({
            priceRange: [0, 10000],
            category: [],
            processorType: [],
            brand: [],
            discount: [],
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
            const isCategoryMatched = filters.category.includes(product.category);
            const isProcessorTypeMatched = filters.processorType.includes(product.processorType);
            const isBrandMatched = filters.brand.includes(product.brand);
            const isDiscountMatched = filters.discount.includes(product.discount);
            return (
                  isMatched &&
                  isPriceInRange &&
                  (filters.category.length === 0 || isCategoryMatched) &&
                  (filters.processorType.length === 0 || isProcessorTypeMatched) &&
                  (filters.brand.length === 0 || isBrandMatched) &&
                  (filters.discount.length === 0 || isDiscountMatched)
            );
      });

      const startIndex = (currentPage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      const displayedProducts = filteredProducts.slice(startIndex, endIndex);

      return (
            <>
                  <div className='w-full  text-black flex flex-col bg-white'>
                        <Navbar query={query} onQueryChange={handleQueryChange} cartItemCount={1} />

                        <div className="container w-full mt-40 mx-auto p-4">
                              <p className='mb-8'>Home &gt; Laptops</p>

                              <div className='flex w-full'>
                                    {/* left side Filter HERE*/}
                                    <div className="min-w-[20%] max-w-[20%] bg-white border border-gray-200 p-4 rounded-lg shadow-lg space-y-6">
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


                                          {/* Category */}
                                          <div className="border-b border-gray-300 pb-4 mb-4">
                                                <h3 className="text-lg font-medium mb-2">Category</h3>
                                                {products.map((product) => (
                                                      <div key={product.category} className="flex items-center space-x-2">
                                                            <input
                                                                  type="checkbox"
                                                                  checked={filters.category.includes(product.category)}
                                                                  onChange={() => handleFilterChange('category', product.category)}
                                                                  className="form-checkbox"
                                                            />
                                                            <span className="text-sm text-gray-700">{product.category}</span>
                                                      </div>
                                                ))}
                                          </div>

                                          {/* Processor Type */}
                                          <div className="border-b border-gray-300 pb-4 mb-4">
                                                <h3 className="text-lg font-medium mb-2">Processor Type</h3>
                                                {products.map((product) => (
                                                      <div key={product.processorType} className="flex items-center space-x-2">
                                                            <input
                                                                  type="checkbox"
                                                                  checked={filters.processorType.includes(product.processorType)}
                                                                  onChange={() => handleFilterChange('processorType', product.processorType)}
                                                                  className="form-checkbox"
                                                            />
                                                            <span className="text-sm text-gray-700">{product.processorType}</span>
                                                      </div>
                                                ))}
                                          </div>

                                          {/* Brand */}
                                          <div className="border-b border-gray-300 pb-4 mb-4">
                                                <h3 className="text-lg font-medium mb-2">Brand</h3>
                                                {products.map((product) => (
                                                      <div key={product.brand} className="flex items-center space-x-2">
                                                            <input
                                                                  type="checkbox"
                                                                  checked={filters.brand.includes(product.brand)}
                                                                  onChange={() => handleFilterChange('brand', product.brand)}
                                                                  className="form-checkbox"
                                                            />
                                                            <span className="text-sm text-gray-700">{product.brand}</span>
                                                      </div>
                                                ))}
                                          </div>

                                          {/* Discount */}
                                          <div>
                                                <h3 className="text-lg font-medium mb-2">Discount</h3>
                                                {products.map((product) => (
                                                      <div key={product.discount} className="flex items-center space-x-2">
                                                            <input
                                                                  type="checkbox"
                                                                  checked={filters.discount.includes(product.discount)}
                                                                  onChange={() => handleFilterChange('discount', product.discount)}
                                                                  className="form-checkbox"
                                                            />
                                                            <span className="text-sm text-gray-700">{product.discount}%</span>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>


                                    {/* right side Products HERE*/}
                                    <div className='w-full'>
                                          <h1 className="text-6xl p-20 text-white font-bold mb-4" style={{ background: 'linear-gradient(to right, #E84C19, white)' }}>Laptops</h1>

                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default Products;