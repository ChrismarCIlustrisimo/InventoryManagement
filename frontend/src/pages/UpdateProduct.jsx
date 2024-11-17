import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineUpload } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_DOMAIN } from '../utils/constants';

const UpdateProduct = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('Upload Product Photo');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [supplier, setSupplier] = useState('');
  const [productID, setProductID] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(0);
  const [currentStockStatus, setCurrentStockStatus] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [model, setModel] = useState('');
  const [warranty, setWarranty] = useState('');
  const [description, setDescription] = useState('');
  const [availableUnitsCount, setAvailableUnitsCount] = useState(0);
  const [error, setError] = useState('');
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const { productId } = useParams();
  const baseURL = API_DOMAIN;
  const [rows, setRows] = useState(3); // Initial number of rows

  useEffect(() => {
    const descriptionArray = parseDescription();
    const lineCount = descriptionArray ? descriptionArray.length : 1;
    setRows(Math.min(lineCount + 1, 25)); // Set max rows to 25
  }, [description]);

  const parseDescription = () => {
    try {
      const descriptionArray = JSON.parse(description);
      if (Array.isArray(descriptionArray)) {
        return descriptionArray
          .map((item) => {
            const parts = item.split(':');
            return parts.length > 1
              ? `${parts[0]}: ${parts.slice(1).join(':')}`
              : item;
          })
          .join('\n'); // Use line breaks to separate items
      }
      return description || 'N/A';
    } catch (e) {
      return description || 'N/A';
    }
  };

  useEffect(() => {
    axios.get(`${baseURL}/product/${productId}`)
      .then(res => {
        const { data } = res;
  
        // Existing state updates...
        setName(data.name);
        setCategory(data.category);
        setSupplier(data.supplier);
        setBuyingPrice(data.buying_price);
        setSellingPrice(data.selling_price);
        setProductID(data._id);
        setImage(data.image);
        setDateAdded(data.createdAt);
        setUpdatedAt(data.updatedAt);
        setLowStockThreshold(data.low_stock_threshold);
        setSubCategory(data.sub_category); 
        setModel(data.model); 
        setWarranty(data.warranty); 
        setDescription(data.description); 
  
        // Count units with status 'in_stock'
        const count = data.units.filter(unit => unit.status === 'in_stock').length;
        setAvailableUnitsCount(count); // Store the count in state
  
        setCurrentStockStatus(count > 0 ? 'HIGH' : 'OUT OF STOCK');
        
        // Additional stock status checks...
        if (count <= lowStockThreshold) {
          setCurrentStockStatus('LOW');
        }
      })
      .catch(err => {
        console.error('Error fetching product:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An unknown error occurred');
      });
  }, [productId, lowStockThreshold]);
  

  const updateProduct = () => {
    // Validate required fields
    if (!name || !category || !buyingPrice || !sellingPrice || !subCategory || !model || !warranty  || !description) {
      toast.error('Please fill in all required fields.');
      return;
    }
  
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('supplier', supplier);
    formData.append('buying_price', buyingPrice);
    formData.append('selling_price', sellingPrice);
    formData.append('product_id', productID);
    formData.append('sub_category', subCategory);
    formData.append('model', model);
    formData.append('warranty', warranty); // Ensure warranty is included
    formData.append('description', description);
  
    axios.put(`${baseURL}/product/${productId}`, formData)
      .then(res => {
        toast.success('Product updated successfully!');
      })
      .catch(err => {
        console.error('Error updating product:', err);
        toast.error('Failed to update product.');
      });
  };
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : 'No file selected');
    if (selectedFile) {
      // Update the image preview to the selected file
      setImage(URL.createObjectURL(selectedFile));
    }
  };


  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: '2-digit', 
      year: 'numeric' 
    }).format(date);
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

const statusStyles = getStatusStyles(currentStockStatus); // Get styles based on the current stock status


  const handleViewUnits = (productId) => {
    navigate(`/units-product/${productId}`);
  };

  return (
    <div className={`flex flex-col h-auto ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
      <div className='flex items-center justify-between h-[8%] p-4'>
        <button className={`flex gap-2 items-center py-2 px-4 rounded-md ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} hover:underline`} onClick={handleBackClick}>
          <IoCaretBackOutline /> Back to inventory
        </button>
      </div>
      <div className="py-6 bg-transparent flex flex-col gap-4 ">
        <div className="flex justify-between items-center mb-4  px-12">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" className="border rounded p-2 text-3xl font-bold text-gray-800 w-auto" />
          <div className="flex space-x-4">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md" onClick={() => handleViewUnits(productID)}>
              View All Units
            </button>
            <button className="bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed" disabled>
              + Add New Unit
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-6 items-stretch">
          <div className="w-[30%] h-full flex flex-col">
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
              <img   src={file ? URL.createObjectURL(file) : image} alt={name} className="w-[336px] h-[336px] object-cover mr-[10px] rounded-md" />
            </div>
            <div className="py-4 w-full">
              <input type="file" id="file" className="hidden" onChange={handleFileChange} />
              <label htmlFor="file" className="bg-blue-500 text-white rounded-md p-2 px-6 flex items-center justify-start gap-2 w-full cursor-pointer">
                <AiOutlineUpload className="text-2xl" />
                {fileName}
              </label>
            </div>
            <div className="text-md bg-white rounded-lg shadow-md p-4 font-medium flex py-4">
              <div className="w-[40%] flex flex-col justify-between h-full gap-4">
                <p>Date Added</p>
                <p>Date Updated</p>
              </div>
              <div className="w-[60%] flex flex-col justify-between h-full gap-4">
                <p>{formatDate(dateAdded)}</p>
                <p>{formatDate(updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Middle Section: Basic Information */}
          <div className="w-[30%] bg-white rounded-lg shadow-md p-6  flex flex-col">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="mt-4 text-md p-4 font-medium flex py-4 ">
              <div className={`w-[50%] flex flex-col justify-between h-full gap-7 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                <p>Category</p>
                <p>Sub-Category</p>
                <p>Model</p>
                <p>Warranty</p>
                <p>Status</p>
              </div>
              <div className="w-[50%] flex flex-col justify-between h-full gap-7">
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="border rounded p-2" />
                <input type="text" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="Sub-Category" className="border rounded p-2" />
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model" className="border rounded p-2" />
                <input type="text" value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="Warranty" className="border rounded p-2" />
                <input
                    type="text"
                    value={currentStockStatus}
                    readOnly
                    className={`border rounded p-2 ${getStatusStyles(currentStockStatus).bgClass} ${getStatusStyles(currentStockStatus).textClass}`} // Apply text color from statusStyles
                  />
              </div>
            </div>
          </div>

          {/* Right Section: Purchase Info and Stock Level */}
          <div className="w-[30%] space-y-8  flex flex-col">
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">Purchase Information</h2>
              <div className="mt-4 text-md p-4 font-medium flex py-4">
                <div className={`w-[40%] flex flex-col justify-between h-full gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">BUYING PRICE</div>
                  <div className="text-gray-500">SELLING PRICE</div>
                  <div className="text-gray-500">SUPPLIER</div>
                </div>
                <div className="w-[60%] flex flex-col justify-between h-full gap-4">
                  <input type="number" value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} placeholder="Buying Price" className="border rounded p-2" />
                  <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="Selling Price" className="border rounded p-2" />
                  <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Supplier" className="border rounded p-2" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 w-full h-full">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold">Stock Level</h2>
                <div className="bg-green-500 text-white px-4 py-1 rounded-[6px] text-sm flex gap-2 items-center justify-center">
                  Total stock <span className="font-bold">{availableUnitsCount}</span>
                </div>
              </div>
              <div className="mt-4 text-md p-4 font-medium flex py-4">
                <div className={`w-[70%] flex flex-col justify-between h-full gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">LOW STOCK</div>
                </div>
                <div className="w-[30%] flex flex-col justify-between h-full gap-4 font-bold">
                  <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} placeholder="Low Stock Threshold" className="border rounded p-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 w-full">
        <div
            className={`bg-white rounded-lg shadow-md  w-[93%] p-4 flex flex-col items-center justify-center py-4 mb-24 ${
              darkMode ? 'bg-light-container' : 'bg-dark-container'
            }`}
          >
            <h2 className="text-xl w-full text-left font-bold mb-4">Description</h2>
            <textarea
              className="w-full overflow-y-auto p-2 border "
              style={{ maxHeight: '250px' }}
              rows={rows}
              placeholder="Description"
              value={parseDescription()}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className={`fixed bottom-0 left-0 right-0 h-[10%]  px-4 py-3 border-t flex items-center justify-end ${darkMode ? 'bg-light-container border-light-primary' : 'bg-dark-container border-dark-primary'}`}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleBackClick} className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button>
          <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div>
            <button type="button" onClick={updateProduct} className={`px-6 py-2 rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Save</button>
        </div>
      </div>
      <ToastContainer theme={darkMode ? 'light' : 'dark'} />
    </div>
  );
  
};

export default UpdateProduct;
