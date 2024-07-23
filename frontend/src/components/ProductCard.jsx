import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className='bg-[#120e0d] rounded-lg h-auto flex flex-col'>
      <div className='w-full h-auto'>
        <img src={product.image} alt={product.title} className='w-full h-[180px] object-cover object-center rounded-lg' />
      </div>
      <div className='w-full h-auto p-2 flex-grow'>
        <p>{product.title}</p>
      </div>
      <div className='w-full h-auto p-2'>
        <div className='flex justify-between items-center tracking-wide'>
          <p className='text-sm text-primary'>₱ {product.price}</p>
          <p className='text-xs text-gray-400'>{product.stock} in stock</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;