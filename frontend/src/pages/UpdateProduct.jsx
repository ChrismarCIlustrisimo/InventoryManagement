import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import ConfirmationDialog from '../components/ConfirmationDialog';

const UpdateProduct = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file selected');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [productID, setProductID] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [currentStockStatus, setCurrentStockStatus] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const { productId } = useParams();
  const baseURL = "http://localhost:5555";
  

  const categoryThresholds = {
    'Components': { nearLow: 10, low: 5 },
    'Peripherals': { nearLow: 15, low: 3 },
    'Accessories': { nearLow: 20, low: 10 },
    'PC Furniture': { nearLow: 20, low: 10 },
    'OS & Software': { nearLow: 10, low: 5 },
    // Add more categories as needed
  };

  useEffect(() => {
    axios.get(`${baseURL}/product/${productId}`)
      .then(res => {
        const { data } = res;
        setName(data.name);
        setCategory(data.category);
        setQuantity(data.quantity_in_stock);
        setBuyingPrice(data.buying_price);
        setSellingPrice(data.selling_price);
        setProductID(data.product_id);
        setImage(data.image);
        setBatchNumber(data.batch_number);
        setCurrentStockStatus(data.current_stock_status);
        setDateAdded(data.createdAt);
        setUpdatedAt(data.updatedAt);
        setSupplierId(data.supplier);
        if (data.image) {
          setFileName(trimFileName(data.image));
        }

        // Calculate stock status
        const thresholds = categoryThresholds[data.category];
        let stockStatus = 'IN STOCK';

        if (data.quantity_in_stock === 0) {
          stockStatus = 'OUT OF STOCK';
        } else if (data.quantity_in_stock <= thresholds.low) {
          stockStatus = 'LOW';
        } else if (data.quantity_in_stock <= thresholds.nearLow) {
          stockStatus = 'NEAR LOW';
        }

        setCurrentStockStatus(stockStatus);


        axios.get(`${baseURL}/supplier/${data.supplier}`)
          .then(res => {
            setSupplierName(res.data.name);
            setSupplierId(res.data._id);
          })
          .catch(err => {
            console.error('Error fetching supplier:', err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data.message : 'An unknown error occurred');
          });
      })
      .catch(err => {
        console.error('Error fetching product:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An unknown error occurred');
      });

    axios.get(`${baseURL}/supplier`)
      .then(res => {
        setSuppliers(res.data.data);
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An unknown error occurred');
      });

    }, [productId]);


    const updateProduct = () => {
      let status;
      const thresholds = categoryThresholds[category];
      
      if (quantity <= 0) {
        status = 'OUT OF STOCK';
      } else if (quantity <= thresholds.low) {
        status = 'LOW';
      } else if (quantity <= thresholds.nearLow) {
        status = 'NEAR LOW';
      } else {
        status = 'IN STOCK';
      }
      
      setCurrentStockStatus(status);
      
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('name', name);
      formData.append('category', category);
      formData.append('quantity_in_stock', quantity);
      formData.append('supplier', supplierId === "NONE" ? "" : supplierId); // Send "" for no supplier
      formData.append('buying_price', buyingPrice);
      formData.append('selling_price', sellingPrice);
      formData.append('batchNumber', batchNumber);
      formData.append('dateAdded', dateAdded);
      formData.append('updatedAt', updatedAt);
      formData.append('product_id', productID);
      formData.append('current_stock_status', currentStockStatus);
      
      axios.put(`${baseURL}/product/${productId}`, formData)
        .then(res => {
          console.log('Update successful:', res.data);
          setIsEditing(false);
        })
        .catch(err => {
          console.error('Error updating product:', err.response ? err.response.data : err.message);
          setError(err.response ? err.response.data.message : 'An unknown error occurred');
        });
    };
    
    
  

  const deleteProduct = () => {
    axios.delete(`${baseURL}/product/${productId}`)
      .then(res => {
        console.log('Delete successful:', res.data);
        navigate('/inventory/product'); // Navigate back to the inventory page
      })
      .catch(err => {
        console.error('Error deleting product:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An unknown error occurred');
      });
    setIsDialogOpen(false);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : 'No file selected');
  };

  const trimFileName = (filePath) => {
    const fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
    const productName = fileName.split('-')[1];
    return productName;
  };

  const handleSupplierChange = (e) => {
    const selectedId = e.target.value;
    setSupplierId(selectedId);
    const selectedSupplier = suppliers.find(supplier => supplier._id === selectedId);
    setSupplierName(selectedSupplier ? selectedSupplier.name : ''); 
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
  
  const stockColors = {
    "IN STOCK": "#1e7e34", // Darker Green
    "NEAR LOW": "#e06c0a", // Darker Orange
    "LOW": "#d39e00", // Darker Yellow
    "OUT OF STOCK": "#c82333", // Darker Red
  };

  const stockStatusColor = stockColors[currentStockStatus] || '#000000';


  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
      {!isEditing && (
        <div className='flex items-center justify-between h-[8%]'>
          <button className={`flex gap-2 items-center py-4 px-6 outline-none ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} hover:underline`} onClick={handleBackClick}>
            <IoCaretBackOutline /> Back to inventory
          </button>
          <div className='flex gap-4 items-center p-4'>
            <button className={`px-4 py-2 rounded-md font-semibold text-sm text-white ${darkMode ? 'bg-light-primary' : 'dark:bg-dark-primary'}`} onClick={() => setIsEditing(true)}> Edit </button>
            <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div>
            <button className={`text-2xl ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`} onClick={() => setIsDialogOpen(true)}><FaTrash /></button>
          </div>
        </div>
      )}

      <div className='flex gap-2 w-full h-[90%] items-center justify-center'>
        <div className='flex h-[80%] w-[70%]'>
          <div className='flex flex-col gap-2 p-2 w-[49%] justify-between'>
            <p className='text-xl'>
              {isEditing ? ( 
              <input type='text' value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} className={`border bg-transparent rounded-md p-2 w-full text-md ${darkMode ? 'border-light-primary' : 'border-dark-primary'} ${!isEditing ? 'text-gray-300' : ''}`} />
              ) : (
                <p className={`bg-transparent rounded-md p-2 w-full text-md`}>{name}</p>
              )}
            </p>
            <div className='w-full h-full flex items-center justify-start'>
              <img src={`${baseURL}/images/${image.substring(14)}`} alt={name} className='w-[360px] h-[360px] object-cover mr-[10px] rounded-md' />
            </div>
          </div>
          <div className='w-[2%] h-full flex items-center mx-12'>
            <div className={`flex-grow border-l h-[96%] ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div>
          </div>
          <div className='w-[49%] p-2'>
            <p className='text-xl font-semibold'>Basic information</p>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>CATEGORY</p>
              {isEditing ? ( 
              <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={!isEditing} className={`border bg-transparent rounded-md p-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`} >
                <option value="">Select Category</option>
                <option value="Components">Components</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Accessories">Accessories</option>
                <option value="PC Furniture">PC Furniture</option>
                <option value="OS & Software">OS & Software</option>
              </select>
              ) : (
                <p className={`bg-transparent rounded-md p-1`}>{category}</p>
              )}

            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>QUANTITY IN STOCK</p>
              {isEditing ? ( 
              <input type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} disabled={!isEditing} className={`border bg-transparent rounded-md p-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'} ${!isEditing ? 'text-gray-500' : ''}`}/>
              ) : ( 
              <p className={`bg-transparent rounded-md p-1`}>{quantity}</p>
              )}
            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>PRODUCT CODE</p>
              <p className={`bg-transparent rounded-md p-1`}>{productID}</p>
            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>BATCH NUMBER</p>
              <p className={`bg-transparent rounded-md p-1`}>{batchNumber}</p>
            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>CURRENT STOCK STATUS</p>
              <p style={{ background: stockStatusColor }} className={`bg-transparent rounded-md p-1 text-white`}>{currentStockStatus}</p>
            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>DATE ADDED</p>
              <p className={`bg-transparent rounded-md p-1`}>{formatDate(dateAdded)} </p>
            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'> 
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>LAST UPDATED</p>
              <p className={`bg-transparent rounded-md p-1`}>{formatDate(updatedAt)} </p>
            </div>

            <p className='text-xl font-semibold my-4'>Purchase information</p>

            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>SUPPLIER</p>
              {isEditing ? (
                  <select
                    value={supplierId}
                    onChange={handleSupplierChange}
                    className={`border bg-transparent rounded-md p-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                  >
                    <option value="NONE">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className={`bg-transparent rounded-md p-1`}>
                    {suppliers.find(supplier => supplier._id === supplierId)?.name || "N/A"}
                  </p>
                )}
            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>BUYING PRICE</p>
              {isEditing ? (
              <input type='number' value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} disabled={!isEditing} className={`border bg-transparent rounded-md p-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'} ${!isEditing ? 'text-gray-500' : ''}`} />
              ) : ( 
                <p className={`bg-transparent rounded-md p-1`}>{buyingPrice}</p>
              )}

            </div>
            <div className='text-sm flex items-center justify-between w-full my-3'>
              <p className={`${darkMode ? 'text-dark-TABLE' : 'text-light-TABLE'}`}>SELLING PRICE</p>
              {isEditing ? (
              <input type='number' value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} disabled={!isEditing} className={`border bg-transparent rounded-md p-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'} ${!isEditing ? 'text-gray-500' : ''}`} />
              ) : ( 
                <p className={`bg-transparent rounded-md p-1`}>{sellingPrice}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={`w-full h-[10%] px-4 py-6 border-t flex items-center justify-end ${darkMode ? 'bg-light-CARD border-light-primary' : 'bg-dark-CARD border-dark-primary'}`}> 
          <div className="flex items-center gap-4"> 
            <button type="button" onClick={() => setIsEditing(false)} className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button> 
            <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div> 
            <button type="button" className={`px-6 py-2 rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`} onClick={updateProduct}>Save</button> 
          </div> 
        </div>
      )}

    <ConfirmationDialog 
        isOpen={isDialogOpen}
        onConfirm={deleteProduct}
        onCancel={() => setIsDialogOpen(false)}
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default UpdateProduct;
