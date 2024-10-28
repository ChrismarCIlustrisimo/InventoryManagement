import React from 'react';
import ProductCard from './ProductCard'; // Adjust the import path as needed

const ProductGrid = () => {
  const categories = [
    {
      title: "Desktops",
      backgroundColor: "#6DD1CC",
      products: [
        {
          image: "https://via.placeholder.com/150",
          price: 94995.00,
          name: "Asus ROG Swift OLED PG32UCD 32” (3840x2160)"
        },
        {
          image: "https://via.placeholder.com/150",
          price: 67690.00,
          name: "Gigabyte Aorus CO49DQ 49” (5120x1440)"
        },
      ]
    },
    {
      title: "Laptops",
      backgroundColor: "#F8AC7A",
      products: [
        {
          image: "https://via.placeholder.com/150",
          price: 125995.00,
          name: "Acer Predator Helios 16 (PH16-72)"
        },
        {
          image: "https://via.placeholder.com/120",
          price: 51950.00,
          name: "Acer Aspire 3 (A315-59-726B)"
        },
      ]
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
        <h2 className="text-2xl font-semibold text-gray-800">{category.title}</h2>
        <a href="/" className="text-blue-700 font-medium">View All</a>
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
