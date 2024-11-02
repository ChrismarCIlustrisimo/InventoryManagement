import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Make sure axios is installed

const Searchbar = ({ query, onQueryChange, placeholderMessage }) => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
    const baseURL = "http://localhost:5555";

    const handleChange = (event) => {
        const value = event.target.value;
        onQueryChange(value);
        fetchProducts(value); // Fetch products whenever the query changes
    };

    const handleClear = () => {
        onQueryChange('');
        setProducts([]); // Clear products when the search is cleared
    };

    const fetchProducts = async (searchQuery) => {
        if (searchQuery) {
            try {
                const response = await axios.get(`http://localhost:5555/product/search?name=${searchQuery}`);
                setProducts(response.data); // Update the product list with search results
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        } else {
            setProducts([]); // Clear products if searchQuery is empty
        }
    };

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
            {products.length > 0 && (
                <ul className="absolute z-10 top-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
                    {products.slice(0, 7).map((product) => ( // Limit the display to 7 products
                        <li
                            key={product._id}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleViewProduct(product)} // Navigate on click
                        >
                            {product.image && ( // Check if the image exists
                                <img
                                    src={`${baseURL}/${product.image}`} // Adjust this property based on your product schema
                                    alt={product.name}
                                    className="w-10 h-10 mr-2 object-cover" // Add classes for sizing and spacing
                                />
                            )}
                            <span className='text-light-TEXT'>{product.name}</span> {/* Display product name */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Searchbar;
