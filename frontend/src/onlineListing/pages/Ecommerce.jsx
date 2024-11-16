import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import '../onlineListing.css';
import IRIGImage from '../assets/IRIGImage.png';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

const Ecommerce = () => {
    const [query, setQuery] = useState('');
    const [currentIndexLatest, setCurrentIndexLatest] = useState(0);
    const [currentIndexTopSellers, setCurrentIndexTopSellers] = useState(0);
    const [latestProducts, setLatestProducts] = useState([]);
    const [topSellers, setTopSellers] = useState([]);
    const [productsPerPage, setProductsPerPage] = useState(5); // Default value for larger screens

    const baseURL = "http://localhost:5555";

    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    };

    const updateCurrentIndex = (setter, newIndex) => {
        setter(newIndex);
    };

    const handleNext = (setter, currentIndex, total) => {
        updateCurrentIndex(setter, (currentIndex + 1) % Math.ceil(total / productsPerPage));
    };

    const handlePrev = (setter, currentIndex, total) => {
        updateCurrentIndex(setter, (currentIndex - 1 + Math.ceil(total / productsPerPage)) % Math.ceil(total / productsPerPage));
    };

    // Function to update productsPerPage based on window size
    const updateProductsPerPage = () => {
        if (window.innerWidth <= 768) { // Mobile view threshold
            setProductsPerPage(4); // 4 products per page on mobile
        } else {
            setProductsPerPage(5); // 5 products per page on larger screens
        }
    };

    useEffect(() => {
        // Fetch products
        const fetchProducts = async () => {
            try {
                // Send request to fetch all products
                const response = await axios.get(`${baseURL}/product`);
                const products = response.data.data; // Adjust according to your API response structure
    
                // Apply local filtering
                const filteredData = products
                    .filter(product => 
                        !product.isArchived && 
                        product.isApproved && 
                        product.units && 
                        product.units.some(unit => unit.status === 'in_stock') // Ensure at least one unit is in stock
                    )
                    .slice(0, 20); // Limit to first 20 products (you can adjust this as needed)
    
                // Assuming you categorize products as 'latest' and 'top sellers'
                setLatestProducts(filteredData.slice(0, 10)); // Fetch the first 10 products as latest
                setTopSellers(filteredData.slice(10, 20)); // Fetch the next 10 products as top sellers
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };
    
        fetchProducts();
    
        // Initial check for productsPerPage
        updateProductsPerPage();
    
        // Add event listener for window resize
        window.addEventListener('resize', updateProductsPerPage);
    
        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateProductsPerPage);
        };
    }, []); // Empty dependency array to run once on mount
    
    
    

    const startIndexLatest = currentIndexLatest * productsPerPage;
    const displayedLatestProducts = latestProducts.slice(startIndexLatest, startIndexLatest + productsPerPage);

    const startIndexTopSellers = currentIndexTopSellers * productsPerPage;
    const displayedTopSellers = topSellers.slice(startIndexTopSellers, startIndexTopSellers + productsPerPage);

    return (
        <div className='w-full h-full text-black flex flex-col bg-white'>
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

            <div className='md:mt-[130px] mt-[50px] w-full bg-gray-200 flex items-center justify-center flex-col'>
                <div className='w-full flex items-center justify-center bg-[#201F1D] mt-2'>
                    <img src={IRIGImage} alt="IRIG" />
                </div>

                <ProductGrid />

                <main className='w-full max-w-[1200px] flex flex-col items-center md:p-4 h-auto'>
                    <ProductSection
                        className="animate-fadeInUp"
                        title="Latest Products"
                        products={displayedLatestProducts}
                        onPrev={() => handlePrev(setCurrentIndexLatest, currentIndexLatest, latestProducts.length)}
                        onNext={() => handleNext(setCurrentIndexLatest, currentIndexLatest, latestProducts.length)}
                    />
                    <ProductSection
                        className="animate-fadeInUp"
                        title="Top Sellers"
                        products={displayedTopSellers}
                        onPrev={() => handlePrev(setCurrentIndexTopSellers, currentIndexTopSellers, topSellers.length)}
                        onNext={() => handleNext(setCurrentIndexTopSellers, currentIndexTopSellers, topSellers.length)}
                    />
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Ecommerce;
