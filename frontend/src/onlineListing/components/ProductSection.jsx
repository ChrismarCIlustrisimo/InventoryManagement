import React from 'react';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import ProductCard from './ProductCard';
import { ToastContainer } from 'react-toastify';

const ProductSection = ({ title, products, onPrev, onNext }) => {
  return (
    <div className='w-full max-w-full flex flex-col flex-wrap mb-4'>
      <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          closeOnClick 
          pauseOnHover 
          draggable 
          theme="light"
        />
      <div className='flex justify-between items-center p-4'>
        <p className='text-2xl text-dark-ACCENT font-semibold'>{title}</p>
        {/*<p className='text-lg cursor-pointer hover:underline active:text-white transition duration-200'>View All</p>*/}
      </div>
      <div className='flex items-center justify-between gap-2 max-h-full'>
        <button onClick={onPrev} className='bg-transparent text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-200 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10'>
          <GrFormPrevious />
        </button>
        <div className="flex justify-center overflow-x-auto">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-4 md:grid-cols-5 md:gap-6">
            {products.map((product, index) => (
              <div key={product.id || index} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <button onClick={onNext} className='bg-transparent text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-200 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10'>
          <MdNavigateNext />
        </button>
      </div>
    </div>
  );
};

export default ProductSection;
