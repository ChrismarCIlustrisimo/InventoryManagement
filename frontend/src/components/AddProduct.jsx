import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [supplierName, setSupplierName] = useState(''); // State for supplier name
  
  useEffect(() => {
    // Fetch suppliers when component mounts
    axios.get('http://localhost:5555/supplier')
      .then(res => {
        setSuppliers(res.data.data); // Assuming your API response contains an array of suppliers
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An unknown error occurred');
      });
  }, []);

  const upload = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('quantity_in_stock', quantity);
    formData.append('supplierId', supplier); // Updated key
    formData.append('buying_price', buyingPrice);
    formData.append('selling_price', sellingPrice);
  
    console.log('FormData:', formData); // Debugging log
  
    axios.post('http://localhost:5555/product', formData)
      .then(res => {
        console.log('Product added:', res.data);
      })
      .catch(err => {
        console.error('Error:', err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data.message : 'An unknown error occurred');
      });
  };
  
  return (
    <div className='text-black'>
      <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
      <input type='text' placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} />
      <input type='number' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <select onChange={(e) => {
        setSupplier(e.target.value);
        setSupplierName(e.target.options[e.target.selectedIndex].text); // Update supplier name
      }}>
        <option value="">Select Supplier</option>
        <option value="None">None</option>
        {suppliers.map(supplier => (
          <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
        ))}
      </select>
      <input type='number' placeholder='Buying Price' value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} />
      <input type='number' placeholder='Selling Price' value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
      <input type='file' onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={upload}>Upload</button>
    </div>
  );
};

export default AddProduct;
