import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import ConfirmationDialog from '../components/ConfirmationDialog';
import AddUnitModal  from '../components/AddUnitModal';
import { API_DOMAIN } from '../utils/constants';


const AdminViewProduct = () => {
  const [product, setProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const { productId } = useParams();
  const baseURL = API_DOMAIN;

  useEffect(() => {
    axios.get(`${baseURL}/product/${productId}`)
      .then(res => {
        const productData = res.data;
        setProduct(productData);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
      });
  }, [productId]);

  const deleteProduct = () => {
    axios.delete(`${baseURL}/product/${productId}`)
      .then(() => {
        navigate('/inventory/product');
      })
      .catch(err => {
        console.error('Error deleting product:', err);
      });
    setIsDialogOpen(false);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleUpdateProduct = (productId) => {
    navigate(`/update-product/${productId}`);
  };

// Function to get the status styles based on the status
const getStatusStyles = (status) => {
  let statusStyles = {
    textClass: 'text-[#8E8E93]', // Default text color
    bgClass: 'bg-[#E5E5EA]', // Default background color
  };

  switch (status) {
    case 'HIGH':
      statusStyles = {
        textClass: 'text-[#14AE5C]',
        bgClass: 'bg-[#CFF7D3]',
      };
      break;
    case 'LOW':
      statusStyles = {
        textClass: 'text-[#EC221F]', // Red for Low Stock
        bgClass: 'bg-[#FEE9E7]',
      };
      break;
    case 'OUT OF STOCK':
      statusStyles = {
        textClass: 'text-[#8E8E93]', // Gray for Out of Stock
        bgClass: 'bg-[#E5E5EA]',
      };
      break;
  }

  return statusStyles; // Return the status styles directly
};



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  

  const handleAddUnit = (newUnit) => {
    // Logic to handle adding the new unit to the product
    console.log('New Unit:', newUnit);
    // Close the modal after adding the unit
    setIsModalOpen(false);
  };

  const handleViewUnits = (productId) => {
    navigate(`/units-product/${productId}`);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className={`h-screen w-screen flex flex-col ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
     <div className='flex items-center justify-between h-[8%] p-4 border-b-2'>
      
        <button className={`flex gap-2 items-center py-2 px-4 rounded-md ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} hover:underline`} onClick={handleBackClick}>
          <IoCaretBackOutline /> Back to inventory
        </button>
      </div>

      <div className="p-8 bg-transparent h-full"> {/* Removed min-h-screen */}
      {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{product.name}</h1>
          <div className="flex space-x-4">
          <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
                onClick={() => handleViewUnits(productId)}
              >
                View All Units
              </button>
            <button
                className={`${
                  darkMode ? 'bg-light-button hover:bg-light-button-hover' : 'bg-dark-textSecondary hover:bg-dark-button-hover'
                } text-dark-textPrimary py-2 px-4 rounded-md transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg`}
                onClick={() => setIsModalOpen(true)}
              >
                + Add New Unit
              </button>

          </div>
        </div>


        {/* Content */}
        <div className="grid grid-cols-3 gap-8 py-4">
          {/* Left Section: Image */}
          <div className="col-span-1">
            <div className={`rounded-lg shadow-md p-4 flex items-center justify-center ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
               {/*<img src={`${baseURL}/${product.image}`} alt={product.name} className='w-[300px] h-[300px] object-cover rounded-md' />*/}
               <img src={product.image} alt={product.name} className='w-[300px] h-[300px] object-cover rounded-md' />
            </div>

            <div className={`mt-4 text-md rounded-lg shadow-md p-4 font-medium flex py-4 ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
              <div className={`w-[40%] flex flex-col justify-between h-full gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                <p>DATE ADDED</p>
                <p>DATE UPDATED</p>
              </div>
              <div className='w-[60%] flex flex-col justify-between h-full gap-4 font-semibold'>
                <p>{formatDate(product.createdAt)}</p>
                <p>{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Middle Section: Basic Information */}
          <div className={`col-span-1 rounded-lg shadow-md p-6 w-full h-full ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
            <h2 className="text-xl font-bold mb-4">BASIC INFORMATION</h2>
            <div className='mt-4 text-md p-4 font-medium flex py-4'>
              <div className={`w-[50%] flex flex-col justify-between h-full gap-10 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                <p>Category</p>
                <p>Sub-Category</p>
                <p>Model</p>
                <p>Warranty</p>
                <p>Status</p>
              </div>
              
              <div className='w-[50%] flex flex-col justify-between h-full gap-10 font-semibold'>
                <p>{product.category}</p>
                <p>{product.sub_category || 'N/A'}</p>
                <p>{product.model || 'N/A'}</p>
                <p>{product.warranty || 'N/A'}</p>
                <div className={`w-full`}>
                  <p className={`w-auto p-2 rounded  text-center ${getStatusStyles(product.current_stock_status).bgClass} ${getStatusStyles(product.current_stock_status).textClass}`}>{product.current_stock_status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Purchase Info and STOCK LEVEL */}
          <div className="col-span-1 space-y-16">
            {/* Purchase Information */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-light-container' : 'bg-dark-container'} min-h-[200px]`}>
              <h2 className="text-xl font-bold mb-4">PURCHASE INFORMATION</h2>
              <div className='mt-4 text-md p-4 font-medium flex py-4'>
                <div className={`w-[40%] flex flex-col justify-between h-full gap-10 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">BUYING PRICE</div>
                  <div className="text-gray-500">SELLING PRICE</div>
                  <div className="text-gray-500">SUPPLIER</div>
                </div>
                <div className='w-[60%] flex flex-col justify-between h-full gap-10'>
                  <div className="font-bold">₱ {product.buying_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="font-bold">₱ {product.selling_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="font-bold">{product.supplier || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* STOCK LEVEL */}
            <div className={`rounded-lg shadow-md p-6 w-full ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
              <h2 className="text-xl font-bold mb-4">STOCK LEVEL</h2>
              <div className='mt-4 text-md p-4 font-medium flex py-4 '>
              <div className={`w-[50%] flex flex-col justify-between h-full gap-4  ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">LOW STOCK</div>
                </div>
                <div className='w-[5s0%] flex flex-col justify-between h-full gap-4 font-bold'>
                  <div>{product.low_stock_threshold}</div>
                </div>
              </div>
            </div>
          </div>
        </div>          
        <div className={`rounded-lg shadow-md p-4 flex flex-col items-center justify-center py-2 ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
          <h2 className="text-xl w-full text-left font-bold mb-4">PRODUCT SPECIFICATION</h2>
          <p className='h-auto overflow-y-auto w-full'>
             {(() => {
                try {
                  const descriptionArray = JSON.parse(product.description);
                  return Array.isArray(descriptionArray)
                    ? descriptionArray.map((item, index) => {
                        const parts = item.split(':');
                        return (
                          <div key={index} className='py-1'>
                            {parts.length > 1 ? (
                              <>
                                <span className='font-semibold text-lg'>{parts[0]}:</span>{' '}
                                <span>{parts.slice(1).join(':')}</span>
                              </>
                            ) : (
                              <span>{item}</span>
                            )}
                            <br />
                          </div>
                        );
                      })
                    : product.description || 'N/A';
                } catch (e) {
                  return product.description || 'N/A';
                }
              })()}
            </p>

        </div>
      </div>

      <AddUnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddUnit={handleAddUnit}
        productId={productId}  // Make sure selectedProductId is a valid ID
      />

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={deleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete ${product.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminViewProduct;
