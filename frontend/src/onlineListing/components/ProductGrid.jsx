import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard'; // Adjust the import path as needed
import axios from 'axios';

const ProductGrid = () => {
  const [desktops, setDesktops] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const baseURL = "http://localhost:5555"; // Replace with your API URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/product`);
        const products = response.data.data; // Adjust according to your API response structure

        // Filter products into desktops and laptops
        const filteredDesktops = products.filter(product => product.category === "Desktops").slice(0, 2);
        const filteredLaptops = products.filter(product => product.category === "Laptops").slice(0, 2);

        // Set the state
        setDesktops(filteredDesktops);
        setLaptops(filteredLaptops);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, [baseURL]);

  const categories = [
    {
      title: "Desktops",
      backgroundColor: "#6DD1CC",
      products: desktops,
      viewAllLink: "/iRIG/desktops", // Update this path as needed
    },
    {
      title: "Laptops",
      backgroundColor: "#F8AC7A",
      products: laptops,
      viewAllLink: "/iRIG/laptops", // Update this path as needed
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} />
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ category }) => {
  return (
    <div style={{ backgroundColor: category.backgroundColor }} className="border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">{category.title}</h2>
          <a href={category.viewAllLink} className="text-white font-medium hover:underline">View All</a>
        </div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {category.products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
