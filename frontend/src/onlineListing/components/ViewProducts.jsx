import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const ViewProducts = () => {
    const [query, setQuery] = useState('');
    const baseURL = "http://localhost:5555";

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
    const categoryPath = location.state?.product.category || "Category"; // Default to "Category" if not provided
    
    const categoryMap = {
        "Laptops": "laptops",
        "Desktops": "desktops",
        "Components": "components",
        "Peripherals": "peripherals",
        "Accessories": "accessories",
        "PC Furniture": "pc-furniture",
        "OS & Software": "os-software"
    };

    const categoryDisplayName = categoryMap[categoryPath] || "Category"; // Get the display name


    if (!product) {
        return (
            <div className="container mx-auto mt-20">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Parse the description string into an array
    const descriptions = JSON.parse(product.description);

    return (
        <>
            <Navbar query={query} onQueryChange={handleQueryChange} cartItemCount={1} />

            <div className="container mx-auto mt-40 p-4">
                {/* Breadcrumb Navigation */}
                <nav className="mb-8 text-black">
                    <Link to="/" className="hover:underline">Home</Link> &gt; 
                    <Link to={`/iRIG/${categoryPath}`} className="hover:underline"> {categoryDisplayName}</Link> &gt; 
                    <span className="font-semibold">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column for the image */}
                    <div className="flex justify-center">
                        <img
                            src={`${baseURL}/${product.image}`}
                            alt={product.name}
                            className="w-full max-w-md h-auto object-cover"
                        />
                    </div>

                    {/* Right column for the product details */}
                    <div className="flex flex-col justify-between space-y-4">
                        <div className='text-black text-xl flex flex-col gap-8'>
                            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                            <hr className='border-b-2 border-gray-600' />
                            <div className='flex items-center gap-4'>
                                <p>Price: </p>
                                <p className="text-5xl font-semibold text-light-primary">
                                    ₱ {product.selling_price.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Stock, Quantity, and Add to Cart */}
                        <div className="space-y-8">
                            <p className="text-lg font-medium text-green-600">Stock: {product.current_stock_status}</p>
                            <div className="flex items-center space-x-4">
                                <div>
                                    <label className="text-gray-700 mr-4">Quantity</label>
                                    <select className="w-20 text-center border text-gray-700 border-gray-300 rounded-md px-2 py-1">
                                        {[1, 2, 3, 4].map((qty) => (
                                            <option key={qty} value={qty}>{qty}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    // Handle adding product to cart
                                }}
                                className="bg-light-primary hover:brightness-90 font-semibold px-12 py-2 rounded-md"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional product description below the two columns */}
                <div className="mt-8 text-black">
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <ul className="list-none pl-0">
                        {descriptions.map((desc, index) => (
                            <li key={index} className="text-sm mb-1">{desc}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default ViewProducts;
