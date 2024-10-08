import React, { useState } from "react";
import { useAdminTheme } from "../context/AdminThemeContext";

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
      <div
        className={`p-6 max-w-xl w-full bg-white rounded-md shadow-md relative overflow-hidden overflow-y-auto ${
          darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-white"
        }`}
        style={{ maxHeight: "80%" }}
      >
        <div className="absolute top-2 right-2">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6">New RMA Request Form</h2>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(80% - 4rem)" }}>
          {/* Customer Information */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="font-medium">Customer</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col">
              <label className="font-medium">Product Name</label>
              <select
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              >
                <option value="">Select a Product</option>
                <option value="Product A">Product A</option>
                <option value="Product B">Product B</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Serial Number</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            {/* RMA Details */}
            <div className="flex flex-col">
              <label className="font-medium">Request Type</label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              >
                <option value="">Select Type</option>
                <option value="Return">Return</option>
                <option value="Repair">Repair</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Reason</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Product Condition</label>
              <select
                name="productCondition"
                value={formData.productCondition}
                onChange={handleChange}
                className="border border-gray-300 rounded"
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="receivedInOriginalPackaging"
                checked={formData.receivedInOriginalPackaging}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label className="font-medium">
                Received in Original Packaging
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isProductComplete"
                checked={formData.isProductComplete}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label className="font-medium">Is the Product Complete?</label>
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="border border-gray-300 rounded h-24"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-3 rounded w-full"
            >
              Submit
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-300 text-gray-700 px-4 py-3 rounded w-full"
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
