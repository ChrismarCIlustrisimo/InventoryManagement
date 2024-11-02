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
    const productsPerPage = 5;

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${baseURL}/product`);
                const products = response.data.data; // Adjust according to your API response structure

                // Assuming you categorize products as 'latest' and 'top sellers'
                setLatestProducts(products.slice(0, 10)); // Fetch the first 10 products as latest
                setTopSellers(products.slice(10, 20)); // Fetch the next 10 products as top sellers
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProducts();
    }, []);

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
                        title="Latest Products"
                        products={displayedLatestProducts}
                        onPrev={() => handlePrev(setCurrentIndexLatest, currentIndexLatest, latestProducts.length)}
                        onNext={() => handleNext(setCurrentIndexLatest, currentIndexLatest, latestProducts.length)}
                    />
                    <ProductSection
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
