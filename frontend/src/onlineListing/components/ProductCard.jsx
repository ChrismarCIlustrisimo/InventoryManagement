import React from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import '../onlineListing.css';
import { useProductContext } from '../page'; // Adjust path if necessary

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useProductContext();
    const baseURL = "http://localhost:5555";

    const handleViewProduct = () => {
        navigate(`/iRIG/products/view/${product._id}`, { state: { product } });
    };

    const handleAddToCart = () => {
        addToCart({ ...product, quantity: 1 }); // or whatever quantity you want to start with
        toast.success(`${product.name} added to cart!`); // Display success toast
    };

    return (
        <div className="rounded-lg bg-white border border-gray-200 p-2 text-center hover:shadow-lg transition duration-200 w-36 h-48 md:w-48 md:h-64 flex flex-col"> {/* Responsive width and height */}
            <div className='flex items-center justify-center'>
                <img src={product.image} alt={product.name} className="w-20 h-20 md:w-24 md:h-24 object-cover" /> {/* Responsive image size */}
            </div>
            <div className='flex flex-col items-center justify-center flex-grow'>
                <p className="text-orange-500 text-xs md:text-sm font-bold mb-1 text-left w-full">
                    ₱{product.selling_price ? product.selling_price.toLocaleString() : "N/A"}
                </p>
                <p className="text-[8px] md:text-sm font-semibold mb-1 text-left w-full text-black">
                    {product.name || "No Name Available"}
                </p>
            </div>
            <div className="flex gap-1 items-center justify-center">
            <button
                    className="bg-orange-600 py-1  md:px-4 px-1 text-white rounded hover:bg-orange-700 transition duration-200 text-sm"
                    onClick={handleAddToCart} // Use the new handler
                >
                    Add to Cart
                </button>
                <button
                    onClick={handleViewProduct}
                    className="bg-orange-600 text-white py-1 md:px-4 px-1 text-lg rounded hover:bg-orange-700 transition duration-200 flex items-center justify-center"
                >
                    <IoEyeOutline />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
