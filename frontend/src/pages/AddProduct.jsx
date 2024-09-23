import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const AddProduct = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState('');
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  const validate = () => {
    if (!name) return 'Product name is required';
    if (!category) return 'Product category is required';
    if (!quantity || isNaN(quantity) || quantity <= 0) return 'Valid product quantity is required';
    if (!buyingPrice || isNaN(buyingPrice) || buyingPrice <= 0) return 'Valid buying price is required';
    if (!sellingPrice || isNaN(sellingPrice) || sellingPrice <= 0) return 'Valid selling price is required';
    if (!file) return 'Product image is required';
    return ''; // No errors
  };

  const upload = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return; // Stop form submission if validation fails
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('quantity_in_stock', quantity);
    formData.append('supplier', supplier);
    formData.append('buying_price', buyingPrice);
    formData.append('selling_price', sellingPrice);

    axios.post('http://localhost:5555/product', formData)
      .then(res => {
        console.log('Product added:', res.data);
        handleBackClick();
      })
      .catch(err => {
        console.error('Error:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An unknown error occurred');
      });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className={`h-full w-full flex flex-col gap-2 ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
      <div className='flex items-center justify-start h-[8%]'>
        <button 
          className={`flex gap-2 items-center py-4 px-6 outline-none ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} hover:underline`} 
          onClick={handleBackClick}
        >
          <IoCaretBackOutline /> Back to sales order
        </button>
      </div>

      <div className='w-full h-[82%] flex flex-col items-center justify-center gap-2'>
        <p className='text-3xl'>Add New Product</p>
        <div className={`w-[40%] h-[85%] rounded-md p-4 ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
          <div className='flex flex-col w-full gap-4 h-full'>

            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="name">Product name</label>
              <input
                type='text'
                placeholder='Name'
                className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='w-full flex gap-2'>
              <div className='flex flex-col w-[50%] gap-2'>
                <label htmlFor="category">Product Category</label>
                <select
                  id="category"
                  className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Components</option>
                  <option value="Components">Components</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Accessories">Accessories</option>
                  <option value="PC Furniture">PC Furniture</option>
                  <option value="OS & Software">OS & Software</option>
                </select>
              </div>

              <div className='flex flex-col w-[50%] gap-2'>
                <label htmlFor="quantity">Product Quantity</label>
                <input
                  type='number'
                  placeholder='Quantity'
                  id="quantity"
                  className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className='w-full flex flex-col gap-2'>
              <label htmlFor="supplier">Product Supplier</label>
              <Autocomplete
                  value={supplier}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setSupplier(newValue);
                    } else if (newValue && newValue.inputValue) {
                      const newSupplier = newValue.inputValue;
                      setOptions((prev) => [...prev, newSupplier]);
                      setSupplier(newSupplier);
                    } else {
                      setSupplier(newValue.title);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(option => inputValue === option.title);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`,
                      });
                    }
                    return filtered;
                  }}
                  options={options.map(option => ({ title: option }))}
                  getOptionLabel={(option) => option.title || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type to search Supplier"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        className: 'bg-transparent border rounded-md',
                      }}
                    />
                  )}
                  sx={{ width: '100%' }}
                  freeSolo
                />

            </div>

            <div className='w-full flex gap-2'>
              <div className='flex flex-col w-[50%] gap-2'>
                <label htmlFor="buying_price">Buying Price</label>
                <input
                  type='number'
                  placeholder='Buying Price'
                  id="buying_price"
                  className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                  value={buyingPrice}
                  onChange={(e) => setBuyingPrice(e.target.value)}
                />
              </div>
              <div className='flex flex-col w-[50%] gap-2'>
                <label htmlFor="selling_price">Selling Price</label>
                <input
                  type='number'
                  placeholder='Selling Price'
                  id="selling_price"
                  className={`border bg-transparent rounded-md p-2 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
            </div>

            <p>Image</p>
            <div className={`w-full h-[10%] border rounded-md p-2 flex items-center justify-start ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}>
              <input
                className="bg-transparent w-auto"
                type='file'
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
          </div>
        </div>
      </div>  

      <div className={`w-full h-[10%] px-4 py-6 border-t flex items-center justify-end ${darkMode ? 'bg-light-container border-light-primary' : 'bg-dark-container border-dark-primary'}`}>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleBackClick} className={`px-4 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button>
          <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div>
          <button type="button" className={`px-6 py-2 rounded-md ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'bg-dark-primary text-dark-textPrimary'}`} onClick={upload}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
