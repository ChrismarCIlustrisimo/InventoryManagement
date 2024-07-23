import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import demoImage from '../assets/Demo.png';
import demo2 from '../assets/demo2.jpg';
import { IoIosCloseCircle } from "react-icons/io";
import { RiFileList3Fill } from "react-icons/ri";
import { GrTechnology } from "react-icons/gr";
import { FaMouse } from "react-icons/fa";
import { MdCable } from "react-icons/md";
import { MdTableRestaurant } from "react-icons/md";
import { CgSoftwareDownload } from "react-icons/cg";
import { PiPlusBold } from "react-icons/pi";
import '../scrollbar.css';
import { useAuthContext } from '../hooks/useAuthContext'


const PosHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Products'); // State to track selected category
  const [productQuantities, setProductQuantities] = useState([1, 1, 1, 1]);
  const baseURL = 'http://localhost:5555';
  const { user } = useAuthContext(); // Assuming useAuthContext provides user object


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5555/product', {
          headers: {
            'Authorization': `Bearer ${user.token}` // Add JWT token to headers if authenticated
          }
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if(user){
      fetchProducts();
    }
  }, [user]);

  const handleProductValue = (index, e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    const updatedQuantities = [...productQuantities];
    updatedQuantities[index] = value.toString();
    setProductQuantities(updatedQuantities);
  };

  // Button data
  const buttons = [
    { icon: <RiFileList3Fill className='w-8 h-8' />, label: 'All Products', count: '9706' },
    { icon: <GrTechnology className='w-8 h-8' />, label: 'Components', count: '9706' },
    { icon: <FaMouse className='w-8 h-8' />, label: 'Peripherals', count: '9706' },
    { icon: <MdCable className='w-8 h-8' />, label: 'Accessories', count: '9706' },
    { icon: <MdTableRestaurant className='w-8 h-8' />, label: 'PC Furniture', count: '9706' },
    { icon: <CgSoftwareDownload className='w-8 h-8' />, label: 'OS & Software', count: '9706' },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'All Products') {
      return true;
    }
    return product.category === selectedCategory;
  });

  return (
    <>
      <Navbar />
      <div className='flex h-[95vh] w-[100vw] pr-[18px] pt-[70px]'>
        <div className='flex items-center flex-col bg-[#120e0d] h-[103vh] w-[25%] gap-4'>
          <div className='flex items-center flex-col gap-2 p-4'>
            <h2 className='font-bold'>Invoice Number: TH20240419001</h2>
            <p>12:30 PM, Tue, 2 Apr</p>
          </div>

          <div className='flex justify-start flex-col w-full gap-2 px-2'>
            <p>Bill To:</p>
            <input className='py-2 px-3 bg-inputBgColor' type='text' placeholder='Customer Name' />
            <input className='py-2 px-3 bg-inputBgColor' type='text' placeholder='Customer Address' />
            <input className='py-2 px-3 bg-inputBgColor' type='text' placeholder='Contact #' />
          </div>

          <div className='flex flex-col items-start w-full px-2'>
            <p>Order:</p>
            <div className='flex flex-col items-center justify-center gap-2 w-full h-[164px] w-full'>
              <div className='overflow-y-auto h-full w-full scrollbar-custom'>
                {productQuantities.map((quantity, index) => (
                  <div key={index} className='flex items-center justify-center gap-3 border-b border-gray-200 p-2 w-full'>
                    <img src={demoImage} alt='Demo' className='w-16 h-16 object-cover rounded-lg' />
                    <div className='flex flex-col gap-2 flex-1'>
                      <p className='text-sm'>NVIDIA GeForce RTX 3060 Ti</p>
                      <div className='flex justify-between items-center'>
                        <p className='text-base'>35,000.00</p>
                        <input
                          type='number'
                          className='w-16 pl-4 text-black text-center'
                          value={quantity}
                          onChange={(e) => handleProductValue(index, e)}
                        />
                      </div>
                    </div>
                    <IoIosCloseCircle className='text-gray-400 text-2xl' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col w-full px-4 py-1'>
            <div className='flex w-full justify-between items-center py-2'>
              <p>Discount</p>
              <button className='bg-[#7a3724] border-none text-white outline-none py-1 px-2 rounded-lg flex gap-2 items-center'>
               <PiPlusBold />
                Add
              </button>
            </div>

            <div className='flex w-full'>
              <div className='flex flex-col gap-2 w-[50%] flex-start'>
                <p>Anouunt</p>
                <p>Total Amount</p>
                <p>Total Amount Paid</p>
                <p>Change</p>
              </div>
              <div className='flex flex-col gap-3 w-[50%] items-end'>
                <p>63,000</p>
                <p>63,923.00</p>
                <p>64,000</p>
                <p>77.00</p>
              </div>
            </div>

            <div className='flex gap-3 justify-between pt-6 w-full'>
              <button className='border border-red-600 w-[50%] py-3 rounded font-semibold text-red-600 
                                hover:bg-red-600 hover:text-white 
                                active:bg-red-700 active:text-red-200'>
                Cancel Order
              </button>

              <button className='bg-primary w-[50%] py-3 rounded text-black font-semibold 
                              hover:bg-primary-opacity hover:text-black-opacity 
                              active:bg-primary-active'>
                Pay
              </button>
            </div>
          </div>
        </div>

        <div className='w-[75%] h-[91vh] bg-transparent'>
          <div className='w-full h-[12vh] flex items-center justify-center gap-4'>
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(button.label)}
                className={`bg-bgContainer text-primary flex items-center justify-center w-[15%] h-[80%] rounded-xl ${selectedCategory === button.label ? 'border-primary border-2' : 'border-transparent'} transition-all duration-200`}
              >
                <div className='w-[30%]'>
                  {button.icon}
                </div>
                <div className='w-70% flex flex-col'>
                  <p className='text-white w-full text-sm'>{button.label}</p>
                  <p className='text-gray-500 w-full text-xs text-start'>{button.count}</p>
                </div>
              </button>
            ))}
          </div>
          <div className='w-full p-5 grid grid-cols-5 gap-3'>
            {loading ? (
              <p>Loading...</p>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    image: `${baseURL}/images/${product.image.substring(14)}`,
                    title: product.name,
                    price: product.selling_price.toFixed(2),
                    stock: product.quantity_in_stock,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PosHome;
