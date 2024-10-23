import React, { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
import { BsArrowRepeat } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProcessReplacement = () => {
    const { darkMode } = useTheme();
    const navigate = useNavigate(); // Initialize navigate
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };


  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <ToastContainer />

  <div className={`p-6 max-w-2xl w-full rounded-md shadow-md relative overflow-hidden overflow-y-auto ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`}>
    <div className="absolute top-2 right-2">
      <button className="absolute top-2 right-4 text-black hover:text-gray-700" onClick={handleClose}>✖</button>
    </div>
    <h2 className={`text-2xl font-bold mb-6 flex items-center justify-center gap-4 border-b py-3 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
      <BsArrowRepeat />
      <span>New RMA Request Form</span>
    </h2>

    <div className="overflow-y-auto px-8">
      {/* Customer Information */}
      <div className="flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-4 w-full">
          <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            Transaction Detail
          </p>
          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
            <input
              type="text"
              name="transactionId"
              value={transactionId}
              className="border border-gray-300 rounded w-[40%] p-1"
              placeholder="Enter Transaction ID"
              disabled
            />
          </div>
          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PURCHASE DATE</label>
            <input
              type="text"
              name="SalesDate"
              value={SalesDate}
              className="border border-gray-300 rounded w-[40%] p-1"
              disabled
            />
          </div>
          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CASHIER</label>
            <input
              type="text"
              name="cashierName"
              value={cashierName}
              className="border border-gray-300 rounded w-[40%] p-1"
              disabled
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            Customer Detail
          </p>
          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CUSTOMER</label>
            <input
              type="text"
              name="customer"
              value={customer}
              className="border border-gray-300 rounded w-[40%] p-1"
              placeholder="Enter Customer Name"
              disabled
            />
          </div>

          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>EMAIL</label>
            <input
              type="email"
              name="email"
              value={email}
              className="border border-gray-300 rounded w-[40%] p-1"
              placeholder="Enter Email"
              disabled
            />
          </div>

          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PHONE NUMBER</label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              className="border border-gray-300 rounded w-[40%] p-1"
              placeholder="Enter Phone Number"
              disabled
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            Product Detail
          </p>
          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT</label>
            <select
              value={selectedProduct}
              onChange={handleProductChange}
              className="border border-gray-300 rounded w-[40%] p-1"
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product._id} value={product.name}>{product.name}</option>
              ))}
            </select>
          </div>
          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SERIAL NUMBER</label>
            <select
              value={selectedSerial}
              onChange={handleSerialChange}
              className="border border-gray-300 rounded w-[40%] p-1"
              disabled={!selectedProduct}
            >
              <option value="">Select a serial number</option>
              {selectedProduct && products.find(product => product.name === selectedProduct)?.serialNumbers.map((serial, index) => (
                <option key={index} value={serial}>{serial}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            RMA Request Detail
          </p>

          <div className='flex'>
            <label htmlFor='reasonForReturn' className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
              REASON FOR RETURN
            </label>
            <select
              id='reasonForReturn'
              name="reasonForReturn"
              value={reasonForReturn}
              onChange={handleChange}
              className="border border-gray-300 rounded w-[40%] p-1"
            >
              <option value=''>Select Reason</option>
              <option value='Defective Product'>Defective Product</option>
              <option value='Product Malfunction'>Product Malfunction</option>
              <option value='Missing Parts'>Missing Parts</option>
              <option value='Warranty Repair'>Warranty Repair</option>
              <option value='Request for Replacement'>Request for Replacement</option>
              <option value='Product Not Compatible'>Product Not Compatible</option>
            </select>
          </div>

          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT CONDITION</label>
            <select
              name="productCondition"
              value={productCondition}
              onChange={handleChange}
              className="border border-gray-300 rounded w-[40%] p-1"
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div className="flex">
            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>NOTES</label>
            <textarea
              name="notes"
              value={notes}
              onChange={handleChange}
              className="border border-gray-300 rounded w-[40%] p-1"
              placeholder="Enter any notes"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-6">
      <button
        onClick={handleSubmit}
        className={`w-[49%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
      >
        Confirm Request
      </button>

      <button
        onClick={handleClose}
        className={`w-[49%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
      >
        Cancel
      </button>
    </div>
  </div>
</div>

  )
}

export default ProcessReplacement
