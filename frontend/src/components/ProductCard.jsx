import React from 'react';

const ProductCard = ({ product }) => {
  return (
      <div className='bg-[#120e0d] rounded-lg'>
        <div className='w-full h-auto'>
          <img src={product.image} alt={product.title} className='w-full h-full object-cover object-center rounded-lg' />
        </div>
        <div className='w-full h-[50%] p-2'>
          <p>{product.title}</p>
          <div className='flex justify-between items-center mt-5 tracking-wide'>
            <p className='text-sm text-primary'>₱ {product.price}</p>
            <p className='text-xs text-gray-400'>{product.stock} in stock</p>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;