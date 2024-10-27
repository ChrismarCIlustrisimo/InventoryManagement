import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
const ViewProducts = () => {

      const [query, setQuery] = useState('');
      const handleQueryChange = (newQuery) => {
            setQuery(newQuery);
      };


      const location = useLocation();
      const navigate = useNavigate();
      const product = location.state?.product;

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

      return (
            <>
                  <Navbar query={query} onQueryChange={handleQueryChange} cartItemCount={1} />

                  <div className="container mx-auto mt-40 p-4">
                        <p className='mb-8 text-black'>Home &gt; Laptops &gt; {product.name} </p>
                        <div className="grid grid-cols-2 gap-8">
                              {/* Left column for the image */}
                              <div className="flex justify-center">
                                    <img
                                          src={product.image}
                                          alt={product.name}
                                          className="w-full max-w-md h-auto object-cover"
                                    />
                              </div>

                              {/* Right column for the product details */}
                              <div className="flex flex-col justify-between space-y-4">
                                    <div className='text-black text-xl flex flex-col gap-8'>

                                          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                                          <hr className='border-b-2 border-gray-600' />
                                          <div className='flex items-center gap-4'>
                                                <p>Price: </p>
                                                <p className=" text-5xl font-semibold text-light-primary">
                                                      ₱{product.price.toLocaleString()}
                                                </p>
                                          </div>


                                    </div>

                                    {/* Stock, Quantity, and Add to Cart */}
                                    <div className="space-y-8">
                                          <p className="text-lg font-medium text-green-600">Stock: High</p>
                                          <div className="flex items-center space-x-4">
                                                <div>
                                                      <label className="text-gray-700 mr-4">Quantity</label>
                                                      <select className="w-20 text-center border text-gray-700 border-gray-300 rounded-md px-2 py-1">
                                                            {[1, 2, 3, 4].map((qty) => (
                                                                  <option key={qty} value={qty}>{qty}</option>
                                                            ))}
                                                      </select>
                                                </div>


                                          </div>
                                          <button
                                                onClick={() => {
                                                      // Handle adding product to cart
                                                }}
                                                className="bg-light-primary hover:brightness-90  font-semibold px-12 py-2 rounded-md"
                                          >
                                                Add to Cart
                                          </button>
                                    </div>
                              </div>
                        </div>

                        {/* Additional product description below the two columns */}
                        <div className="mt-8 text-black">
                              <h2 className="text-lg font-semibold mb-2">Description</h2>

                              {/* Structured specifications section */}
                              <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <div className="font-semibold">Operating System:</div>
                                    <div>{product.specs?.os || 'Windows 11 Pro'}</div>

                                    <div className="font-semibold">Processor:</div>
                                    <div>{product.specs?.processor || 'Intel Core i7-10850H'}</div>

                                    <div className="font-semibold">Memory:</div>
                                    <div>{product.specs?.memory || '16GB'}</div>

                                    <div className="font-semibold">Storage:</div>
                                    <div>{product.specs?.storage || '512GB NVMe PCIe SSD'}</div>

                                    <div className="font-semibold">Display:</div>
                                    <div>{product.specs?.display || '15.6" 1080p FHD'}</div>

                                    <div className="font-semibold">Graphics:</div>
                                    <div>{product.specs?.graphics || 'NVIDIA GTX 1650'}</div>

                                    <div className="font-semibold">Audio:</div>
                                    <div>{product.specs?.audio || 'Built-in speakers with Dolby support'}</div>

                                    <div className="font-semibold">Battery:</div>
                                    <div>{product.specs?.battery || '6-cell 97Wh Li-ion'}</div>

                                    <div className="font-semibold">Weight:</div>
                                    <div>{product.specs?.weight || '2.3 kg'}</div>
                              </div>
                        </div>
                  </div>

                  {/* footer */}
                  <Footer />
            </>
      );
};

export default ViewProducts;