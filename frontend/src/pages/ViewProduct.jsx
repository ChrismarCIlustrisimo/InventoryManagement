import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import ConfirmationDialog from '../components/ConfirmationDialog';
import AddUnitModal  from '../components/AddUnitModal';

const stockColors = {
  "HIGH": "#1e7e34", // Darker Green
  "LOW": "#d39e00", // Darker Yellow
  "OUT OF STOCK": "#c82333", // Darker Red
};

const ViewProduct = () => {
  const [product, setProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const { productId } = useParams();
  const baseURL = "http://localhost:5555";

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

  const getStockStatus = () => {
    if (!product || !product.units) return { status: 'N/A', color: '#000000' }; // Default color for N/A

    const availableUnits = product.units.filter(unit => unit.status === 'in_stock').length;

    let status;
    if (availableUnits === 0) {
      status = 'OUT OF STOCK';
    } else if (availableUnits <= product.low_stock_threshold) {
      status = 'LOW';
    } else if (availableUnits <= product.near_low_stock_threshold) {
      status = 'NEAR LOW';
    } else {
      status = 'IN STOCK';
    }

    return { status, color: stockColors[status] };
  };

  const stockStatus = getStockStatus();

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
        <div className='flex gap-4 items-center'>
          <button className={`px-4 py-2 rounded-md font-semibold text-sm text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`} onClick={() => handleUpdateProduct(product._id)}> Edit </button>
          <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div>
          <button className={`text-2xl ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`} onClick={() => setIsDialogOpen(true)}><FaTrash /></button>
        </div>
      </div>

      <div className="p-8 bg-transparent"> {/* Removed min-h-screen */}
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
        <div className="grid grid-cols-3 gap-8 ">
          {/* Left Section: Image */}
          <div className="col-span-1">
            <div className={`rounded-lg shadow-md p-4 flex items-center justify-center ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
               <img src={`${baseURL}/${product.image}`} alt={product.name} className='w-[300px] h-[300px] object-cover rounded-md' />
            </div>

            <div className={`mt-4 text-md rounded-lg shadow-md p-4 font-medium flex py-4 ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
              <div className='w-[40%] flex flex-col justify-between h-full gap-4'>
                <p>Date Added</p>
                <p>Date Updated</p>
              </div>
              <div className='w-[60%] flex flex-col justify-between h-full gap-4'>
                <p>{formatDate(product.createdAt)}</p>
                <p>{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Middle Section: Basic Information */}
          <div className={`col-span-1 rounded-lg shadow-md p-6 w-full h-full ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
            <h2 className="text-xl font-bold mb-4">Basic information</h2>
            <div className='mt-4 text-md p-4 font-medium flex py-4'>
              <div className={`w-[50%] flex flex-col justify-between h-full gap-6 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                <p>Category</p>
                <p>Sub-Category</p>
                <p>Model</p>
                <p>Warranty</p>
                <p>Location</p>
                <p>Status</p>
                <p>Note</p>
              </div>
              
              <div className='w-[50%] flex flex-col justify-between h-full gap-6'>
                <p>{product.category}</p>
                <p>{product.sub_category || 'N/A'}</p>
                <p>{product.model || 'N/A'}</p>
                <p>{product.warranty || 'N/A'}</p>
                <p>{product.location || 'N/A'}</p>
                <p style={{ color: stockStatus.color }}>{stockStatus.status}</p> {/* Apply color dynamically */}
                <p>{product.description || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Right Section: Purchase Info and Stock Level */}
          <div className="col-span-1 space-y-8">
            {/* Purchase Information */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
              <h2 className="text-xl font-bold mb-4">Purchase information</h2>
              <div className='mt-4 text-md p-4 font-medium flex py-4'>
              <div className={`w-[40%] flex flex-col justify-between h-full gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">BUYING PRICE</div>
                  <div className="text-gray-500">SELLING PRICE</div>
                  <div className="text-gray-500">SUPPLIER</div>
                </div>
                <div className='w-[60%] flex flex-col justify-between h-full gap-4'>
                  <div className="font-bold">₱ {product.selling_price}</div>
                  <div className="font-bold">₱ {product.buying_price}</div>
                  <div className="font-bold">{product.supplier}</div>
                </div>
              </div>
            </div>

            {/* Stock Level */}
            <div className={`rounded-lg shadow-md p-6 w-full ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
              <h2 className="text-xl font-bold mb-4">Stock Level</h2>
              <div className='mt-4 text-md p-4 font-medium flex py-4 '>
              <div className={`w-[70%] flex flex-col justify-between h-full gap-4  ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">LOW STOCK</div>
                  <div className="text-gray-500">NEAR LOW STOCK</div>
                </div>
                <div className='w-[30%] flex flex-col justify-between h-full gap-4 font-bold'>
                  <div>{product.near_low_stock_threshold}</div>
                  <div>{product.low_stock_threshold}</div>
                </div>
              </div>
            </div>
          </div>
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

export default ViewProduct;
