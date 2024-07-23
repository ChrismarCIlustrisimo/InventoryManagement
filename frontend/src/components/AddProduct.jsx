import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [buyinPrice, setBuyinPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState(null);


  const upload = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('quantity_in_stock', quantity);
    formData.append('supplier', supplier);
    formData.append('buyin_price', buyinPrice);
    formData.append('selling_price', sellingPrice);

    axios.post('http://localhost:5555/product', formData)
      .then(res => {
        console.log('Product added:', res.data);
        // Optionally, clear the form or provide feedback
      })
      .catch(err => {
        console.error('Error:', err);
        // Optionally, provide error feedback
      });
  };

  return (
    <div className='text-black'>
      <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
      <input type='text' placeholder='Category' value={category} onChange={(e) => setCategory(e.target.value)} />
      <input type='number' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <input type='text' placeholder='Supplier' value={supplier} onChange={(e) => setSupplier(e.target.value)} />
      <input type='number' placeholder='Buyin Price' value={buyinPrice} onChange={(e) => setBuyinPrice(e.target.value)} />
      <input type='number' placeholder='Selling Price' value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
      <input type='file' onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={upload}>Upload</button>
    </div>
  );
};

export default AddProduct;
