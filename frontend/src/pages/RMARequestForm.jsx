import React, { useState } from "react";
import { useAdminTheme } from "../context/AdminThemeContext";
import { BsArrowRepeat } from "react-icons/bs";

const RMARequestForm = ({ onClose }) => {
  const { darkMode } = useAdminTheme();

  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    transactionId: "",
    productName: "",
    location: "",
    serialNumber: "",
    purchaseDate: "",
    invoiceNumber: "",
    requestType: "",
    reason: "",
    productCondition: "",
    receivedInOriginalPackaging: false,
    isProductComplete: true,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Submit logic here
  };

  const handleReset = () => {
    setFormData({
      customer: "",
      email: "",
      transactionId: "",
      productName: "",
      location: "",
      serialNumber: "",
      purchaseDate: "",
      invoiceNumber: "",
      requestType: "",
      reason: "",
      productCondition: "",
      receivedInOriginalPackaging: false,
      isProductComplete: true,
      notes: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`p-6 max-w-2xl w-full rounded-md shadow-md relative overflow-hidden overflow-y-auto ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`} style={{ maxHeight: "90%" }}>
        <div className="absolute top-2 right-2">
          <button className="absolute top-2 right-4 text-black  hover:text-gray-700"  onClick={onClose}>✖</button>
        </div>
        <h2 className={`text-2xl font-bold mb-6 flex items-center justify-center gap-4 border-b py-3 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
            <BsArrowRepeat />
            <span>New RMA Request Form</span>
        </h2>

        <div className="overflow-y-auto px-8" style={{ maxHeight: "calc(80% - 4rem)" }}>
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
                  name="transaction"
                  className={`border border-gray-300 rounded w-[40%] p-1`}
                  placeholder="Enter Transaction ID"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <p className={`text-xl font-semibold mb-2  ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                Customer Detail
              </p>
              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CUSTOMER</label>
                <input
                  type="text"
                  name="customer"
                  className="border border-gray-300 rounded w-[40%] p-1"
                  placeholder="Enter Customer Name"
                />
              </div>

              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>EMAIL</label>
                <input
                  type="email"
                  name="email"
                  className="border border-gray-300 rounded w-[40%] p-1"
                  placeholder="Enter Email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <p className={`text-xl font-semibold mb-2  ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                Product Information
              </p>
              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT NAME</label>
                <select
                  name="productName"
                  className="border border-gray-300 rounded w-[40%] p-1"
                >
                  <option value="">Select a Product</option>
                  <option value="Product A">Product A</option>
                  <option value="Product B">Product B</option>
                </select>
              </div>

              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SERIAL NUMBER</label>
                <input
                  type="text"
                  name="serialNumber"
                  className="border border-gray-300 rounded w-[40%] p-1"
                  placeholder="Enter Serial Number"
                />
              </div>

              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PURCHASE DATE</label>
                <input
                  type="date"
                  name="purchaseDate"
                  className="border border-gray-300 rounded w-[40%]"
                />
              </div>

              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>INVOICE NUMBER</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  className="border border-gray-300 rounded w-[40%] p-1"
                  placeholder="Enter Invoice Number"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full">
              <p className={`text-xl font-semibold mb-2  ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                RMA Details
              </p>

              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REQUEST TYPE</label>
                <select
                  name="requestType"
                  className="border border-gray-300 rounded w-[40%] p-1"
                >
                  <option value="">Select Type</option>
                  <option value="Return">Return</option>
                  <option value="Repair">Repair</option>
                </select>
              </div>

              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REASON</label>
                <input
                  type="text"
                  name="reason"
                  className="border border-gray-300 rounded w-[40%] p-1"
                  placeholder="Enter Reason"
                />
              </div>

              <div className="flex">
                <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT CONDITION</label>
                <select
                  name="productCondition"
                  className="border border-gray-300 rounded w-[40%] p-1"
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>

              <div className="flex">
                <div className="flex flex-col items-start gap-2 w-full ">
                  <p className="uppercase text-md">Received in original packaging</p>
                  <p className="uppercase text-md">is the product complete?</p>
                </div>
                <div className="flex flex-col items-start py-1 justify-start gap-2 w-full ">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="receivedInOriginalPackaging"
                      className="w-5 h-5 "
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isProductComplete"
                      className="w-5 h-5 "
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col max-h-[200px] h-[150px] gap-2">
                <label className={`font-medium w-[100%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>NOTES</label>
                <textarea
                  name="notes"
                  className="border border-gray-300 rounded w-[100%] h-full px-4 py-2"
                  placeholder="Enter any notes here..."
                ></textarea>
              </div>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="flex gap-4 pt-8">
            <button
                onClick={handleSubmit}
                className={`text-white px-4 py-4 rounded-md w-[50%] flex items-center justify-center gap-2 
                  ${darkMode ? 'bg-light-primary' : 'bg-light-primary'} 
                  hover:bg-opacity-80 active:bg-opacity-90`}
            >
                Submit
            </button>
            <button
                onClick={onClose}
                className={`px-4 py-4 rounded-md w-[50%] flex items-center justify-center gap-2 border 
                  ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-light-primary'} 
                  hover:bg-opacity-10 active:bg-opacity-20`}
            >
                Cancel
            </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RMARequestForm;
