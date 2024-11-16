import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Searchbar = ({ query, onQueryChange, placeholderMessage }) => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";

    // Handle input change and trigger product search
    const handleChange = (event) => {
        const value = event.target.value;
        onQueryChange(value);  // Update parent query state
        fetchProducts(value);  // Fetch products based on search query
    };

    // Clear the search input and reset products list
    const handleClear = () => {
        onQueryChange('');  // Reset the query state
        setProducts([]);    // Clear the products
    };

    // Fetch products from the backend based on the search query
    const fetchProducts = async (searchQuery) => {
        if (searchQuery) {
            try {
                const response = await axios.get(`${baseURL}/product/search?name=${searchQuery}`);
                
                // Filter products to show only those with 'in_stock' units
                const availableProducts = response.data.filter(product =>
                    product.units && product.units.some(unit => unit.status === 'in_stock')
                );

                setProducts(availableProducts);  // Set filtered products to state
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        } else {
            setProducts([]);  // If search query is empty, clear the products
        }
    };

    // Navigate to product view page when a product is clicked
    const handleViewProduct = (product) => {
        navigate(`/iRIG/products/view/${product._id}`, { state: { product } });
    };

    return (
        <div className="relative w-[40%] md:w-[600px] bg-white rounded-xl md:block hidden">
            <div className="flex items-center px-4 border-2 text-light-TEXT rounded-xl">
                <input
                    type="text"
                    placeholder={placeholderMessage}
                    className="w-full text-sm bg-transparent py-[11px] outline-none"
                    value={query}
                    onChange={handleChange}
                />
                {query ? (
                    <IoMdClose className="text-light-primary cursor-pointer" onClick={handleClear} />
                ) : (
                    <FaSearch className="text-light-primary cursor-pointer" />
                )}
            </div>
            {query && products.length === 0 && (
                <div className="absolute z-10 top-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg p-4 text-center text-gray-500">
                    No products found
                </div>
            )}
            {products.length > 0 && (
                <ul className="absolute z-10 top-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
                    {products.slice(0, 7).map((product) => (
                        <li
                            key={product._id}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleViewProduct(product)}
                        >
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 mr-2 object-cover"
                                />
                            )}
                            <span className='text-light-TEXT'>{product.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Searchbar;
