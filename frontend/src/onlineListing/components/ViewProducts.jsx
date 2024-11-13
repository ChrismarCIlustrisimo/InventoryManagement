import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import ProductCard from './ProductCard'; 
import { ToastContainer, toast } from 'react-toastify'; 
import { useProductContext } from '../page';

const ViewProducts = () => {
    const [query, setQuery] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const baseURL = "http://localhost:5555";
    const { addToCart } = useProductContext();
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    // Calculate the number of in-stock units
    const inStockQuantity = product?.units.filter(unit => unit.status === 'in_stock').length || 0;

    // Define stock threshold colors
    const getStockColor = () => {
        if (inStockQuantity <= product.low_stock_threshold) return 'text-red-500'; // LOW
        if (inStockQuantity <= product.low_stock_threshold * 1.5) return 'text-yellow-500'; // NEAR LOW
        return 'text-green-500'; // IN STOCK
    };

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const categoryPath = location.state?.product.category || "Category";
    const categoryMap = {
        "Laptops": "laptops",
        "Desktops": "desktops",
        "Components": "components",
        "Peripherals": "peripherals",
        "Accessories": "accessories",
        "PC Furniture": "pc-furniture",
        "OS & Software": "os-software"
    };
    const categoryDisplayName = categoryMap[categoryPath] || "Category";

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (product && product.sub_category) {
                try {
                    const response = await axios.get(`${baseURL}/product`);
                    const filteredProducts = response.data.data.filter(
                        (item) => item.sub_category === product.sub_category && item.product_id !== product.product_id
                    ).slice(0, 5);
                    setRelatedProducts(filteredProducts);
                } catch (error) {
                    console.error('Error fetching related products:', error.message);
                }
            }
        };

        fetchRelatedProducts();
    }, [product]);

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

    const descriptions = JSON.parse(product.description);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity }); // Include the specified quantity
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <>
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
            <div className="container mx-auto mt-40 p-4">
                <nav className="mb-8 text-black">
                    <Link to="/" className="hover:underline">Home</Link> &gt; 
                    <Link to={`/iRIG/${categoryPath}`} className="hover:underline"> {categoryDisplayName}</Link> &gt; 
                    <span className="font-semibold">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full max-w-md h-auto object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-start space-y-4">
                        <div className='text-black text-xl flex flex-col gap-8'>
                            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                            <hr className='border-b-2 border-gray-600' />
                        </div>

                        <div className="space-y-6">
                            <div className='flex items-center gap-4'>
                                <label className="text-gray-700 mr-4 font-semibold">Price:</label>
                                <p className="text-5xl font-semibold text-light-primary">
                                    ₱ {product.selling_price.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="text-gray-700 mr-4 font-semibold">Stock: </p>
                                <p className={`text-lg font-medium ${getStockColor()}`}>{inStockQuantity} units in stock</p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div>
                                    <label className="text-gray-700 mr-4 font-semibold">Quantity:</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        min="1"
                                        className="w-20 text-center border text-gray-700 border-gray-300 rounded-md px-2 py-1"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="bg-light-primary hover:brightness-90 font-semibold px-12 py-2 rounded-md"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-black">
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <ul className="list-none pl-0">
                        {descriptions.map((item, index) => (
                            <li key={index} className="mb-1">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-4xl font-semibold mb-4 text-black w-full text-center py-6 bg-gray-100">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct._id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default ViewProducts;
