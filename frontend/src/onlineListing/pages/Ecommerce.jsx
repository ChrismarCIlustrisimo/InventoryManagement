import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import ProductSection from '../components/ProductSection';

const Ecommerce = () => {
  const [query, setQuery] = useState('');
  const [currentIndexLatest, setCurrentIndexLatest] = useState(0);
  const [currentIndexTopSellers, setCurrentIndexTopSellers] = useState(0);
  const productsPerPage = 5;

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
  };

  const latestProducts = [
    { id: 1, name: "Asus ROG Swift OLED PG32UCDP 32", price: 1500, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Gigabyte Aorus CO49DQ 49 DQHD", price: 2000, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Acer Predator Helios 16 PH16", price: 2500, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Dell XPS 13 Laptop", price: 1800, image: "https://via.placeholder.com/150" },
    { id: 5, name: "Apple MacBook Pro 16", price: 3000, image: "https://via.placeholder.com/150" },
    { id: 6, name: "HP Spectre x360", price: 2200, image: "https://via.placeholder.com/150" },
    { id: 7, name: "Lenovo ThinkPad X1", price: 2000, image: "https://via.placeholder.com/150" },
    { id: 8, name: "Razer Blade 15", price: 2500, image: "https://via.placeholder.com/150" },
    { id: 9, name: "Microsoft Surface Laptop 4", price: 1900, image: "https://via.placeholder.com/150" },
    { id: 10, name: "Samsung Galaxy Book Pro", price: 1700, image: "https://via.placeholder.com/150" },
  ];

  const topSellers = [
    { id: 11, name: "Dell Alienware x17", price: 3500, image: "https://via.placeholder.com/150" },
    { id: 12, name: "ASUS ROG Zephyrus G14", price: 2000, image: "https://via.placeholder.com/150" },
    { id: 13, name: "Apple iPad Pro", price: 1200, image: "https://via.placeholder.com/150" },
    { id: 14, name: "Samsung Galaxy Tab S8", price: 999, image: "https://via.placeholder.com/150" },
    { id: 15, name: "Microsoft Surface Pro 8", price: 1100, image: "https://via.placeholder.com/150" },
    { id: 16, name: "Lenovo Yoga 9i", price: 1500, image: "https://via.placeholder.com/150" },
    { id: 17, name: "HP Envy x360", price: 1400, image: "https://via.placeholder.com/150" },
    { id: 18, name: "Acer Swift 5", price: 1300, image: "https://via.placeholder.com/150" },
    { id: 19, name: "Google Pixelbook Go", price: 999, image: "https://via.placeholder.com/150" },
    { id: 20, name: "Razer Book 13", price: 1400, image: "https://via.placeholder.com/150" },
  ];

  const updateCurrentIndex = (setter, newIndex) => {
    setter(newIndex);
  };

  const handleNext = (setter, currentIndex, total) => {
    updateCurrentIndex(setter, (currentIndex + 1) % Math.ceil(total / productsPerPage));
  };

  const handlePrev = (setter, currentIndex, total) => {
    updateCurrentIndex(setter, (currentIndex - 1 + Math.ceil(total / productsPerPage)) % Math.ceil(total / productsPerPage));
  };

  const startIndexLatest = currentIndexLatest * productsPerPage;
  const displayedLatestProducts = latestProducts.slice(startIndexLatest, startIndexLatest + productsPerPage);

  const startIndexTopSellers = currentIndexTopSellers * productsPerPage;
  const displayedTopSellers = topSellers.slice(startIndexTopSellers, startIndexTopSellers + productsPerPage);

  return (
    <div className='w-full h-full text-black flex flex-col bg-white'>
      {/* Adjusted Navbar height for better mobile responsiveness */}
      <Navbar query={query} onQueryChange={handleQueryChange} cartItemCount={1} />
      
      {/* Adjusted the margin and spacing for mobile responsiveness */}
      <div className='mt-[130px] w-full bg-gray-200 flex items-center justify-center flex-col'>
        <Carousel />
        
        {/* Added more padding and ensured responsive container height */}
        <ProductGrid products={[...latestProducts, ...topSellers]} />

        {/* Adjusted main tag height for mobile view */}
        <main className='w-full max-w-[1200px] flex flex-col items-center p-4 border border-red-800 h-auto'>
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
