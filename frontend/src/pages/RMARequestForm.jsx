import React, { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
import { BsArrowRepeat } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_DOMAIN } from '../utils/constants';

const RMARequestForm = ({ onClose, transaction }) => {
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


  const [transactionId, setTransactionId] = useState(transaction.transaction_id);
  const [customer, setCustomer] = useState(transaction.customer?.name);
  const [email, setEmail] = useState(transaction.customer?.email);
  const [customerID, setCustomerID] = useState(transaction.customer._id);
  const [products, setProducts] = useState([]);
  const [SalesDate, setSalesDate] = useState(formatDate(transaction.transaction_date));
  const [transactionDate, setTransactionDate] = useState(transaction.transaction_date);
  const [phoneNumber, setPhoneNumber] = useState(transaction.customer?.phone);
  const [reasonForReturn, setReasonForReturn] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSerial, setSelectedSerial] = useState("");
  const [cashierName, setCashierName] = useState(transaction.cashier || "");
  const [productWarranty, setProductWarranty] = useState("");
  const [productPrice, setProductPrice] = useState(0); // Initialize with 0 or any default value
  const [productID, setProductID] = useState('');


  // Extracting warranty information from the first product in the transaction
  useEffect(() => {
      if (transaction.products.length > 0) {
          const firstProductWarranty = transaction.products[0].product?.warranty || 'N/A';
          setProductWarranty(firstProductWarranty);
      }
  }, [transaction.products]);
  
  
  useEffect(() => {
    if (transaction.products && transaction.products.length > 0) {
        const newProducts = transaction.products
            .filter(item => item.serial_number && item.serial_number.length > 0)
            .map(item => {
                const productUnits = item.product?.units || [];

                // Create an array of serial numbers that have a status of 'sold' and are going to be processed for RMA
                const rmaSerialNumbers = item.serial_number.filter(serial => {
                    const matchedUnit = productUnits.find(unit => unit.serial_number === serial);
                    return matchedUnit?.status === 'sold'; // Only include if status is 'sold'
                });

                // Check if there are any serial numbers ready for RMA processing
                if (rmaSerialNumbers.length > 0) {
                    return {
                        _id: item._id,
                        name: item.product.name,
                        sellingPrice: item.product.selling_price,
                        serialNumbers: rmaSerialNumbers,
                        soldCount: rmaSerialNumbers.length // Add the count of sold serial numbers
                    };
                }

                return null; // Return null if there are no serial numbers for RMA
            })
            .filter(item => item !== null); // Filter out null values from the array

        setProducts(newProducts);

        // Calculate the total selling price for sold products ready for RMA
        const totalSellingPrice = newProducts.reduce((total, product) => {
            return total + (product.sellingPrice * product.soldCount); // Use soldCount instead
        }, 0);

        // Store the calculated value multiplied by 0.12
        setProductPrice((totalSellingPrice * 0.12) + totalSellingPrice);
    }
}, [transaction]);



  
const handleProductChange = (event) => {
  const selectedProductName = event.target.value;
  
  // Find the selected product based on the name from the transaction prop
  const selectedProduct = transaction.products.find(product => product.product.name === selectedProductName);
  
  setSelectedProduct(selectedProductName);
  setProductID(selectedProduct ? selectedProduct.product._id : ''); // Set the product ID
  setSelectedSerial(""); // Reset selected serial if needed
};


  const handleSerialChange = (e) => {
    setSelectedSerial(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "transactionId":
        setTransactionId(value);
        break;
      case "customer":
        setCustomer(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "SalesDate":
        setSalesDate(value);
        break;
      case "cashierName":
        setCashierName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "reasonForReturn":
        setReasonForReturn(value);
        break;
      case "productCondition":
        setProductCondition(value);
        break;
      case "notes":
        setNotes(value);
        break;
      default:
        break;
    }

    
  };

  const handleSubmit = async () => {
      // Validation checks
      if (!customer || !selectedProduct || !selectedSerial || !reasonForReturn || !productCondition) {
        toast.warn("Please fill in all required fields.");
          return;
        }
    const rmaData = {
      transaction: transactionId,
      product: selectedProduct,
      serial_number: selectedSerial,
      customer_name: customer,
      reason: reasonForReturn,
      notes: notes,
      condition: productCondition,
      product_warranty: productWarranty,
      transaction_date: transactionDate,
      cashier: cashierName,
      product_price: productPrice,
      product_id: productID, 
      customerID: customerID,
    };
  
  
    try {
      const response = await axios.post(`${API_DOMAIN}/rma`, rmaData, {
          headers: {
              "Content-Type": "application/json",
          },
      });
      toast.success("RMA request submitted successfully!");

      // Introduce a 3-second delay before navigating
      setTimeout(() => {
        navigate(-1);
      }, 3000);
  } catch (error) {
      console.error("Error submitting RMA request:", error);
      if (error.response) {
          console.error("Server response:", error.response.data);
      }
  }
  
  };

  const shortenString = (str) => {

    if (typeof str === 'string') {
        const trimmedStr = str.trim(); // Remove leading and trailing spaces
        if (trimmedStr.length > 20) {
            return trimmedStr.slice(0, 20) + '...'; // Shorten and add ellipsis
        }
        return trimmedStr; // Return the original trimmed string if it's 10 characters or less
    }
    return 'N/A'; // Return 'N/A' if input is not a string
};
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <ToastContainer />

      <div className={`p-6 max-w-2xl w-full rounded-md shadow-md relative overflow-hidden overflow-y-auto ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`} style={{ maxHeight: "90%" }}>
        <div className="absolute top-2 right-2">
          <button className="absolute top-2 right-4 text-black hover:text-gray-700" onClick={onClose}>✖</button>
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
                    <option key={product._id} value={product.name}>{shortenString(product.name)}</option>
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
                      name="reasonForReturn"  // Add name attribute
                      value={reasonForReturn}
                      onChange={handleChange}  // Add onChange event handler
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
                      onChange={handleChange}  // Add onChange event handler
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
                  onChange={handleChange}  // Add onChange event handler
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
            onClick={onClose}
            className={`w-[49%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RMARequestForm;
