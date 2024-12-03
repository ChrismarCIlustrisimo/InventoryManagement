import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineUpload } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_DOMAIN } from '../utils/constants';
import { useAuthContext } from '../hooks/useAuthContext';

const UpdateProduct = () => {
  const { user } = useAuthContext();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('Upload Product Photo');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [supplier, setSupplier] = useState('');
  const [productID, setProductID] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(0);
  const [currentStockStatus, setCurrentStockStatus] = useState('');
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
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedValue, setSelectedValue] = useState('N/A'); // Default to 'N/A'
  
  const [currentProduct, setCurrentProduct] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [productid, setProductid] = useState(null);

  // Fetch suppliers on component load
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${baseURL}/supplier`);
        
        // Extract only the supplier_name from the response data
        const supplierNames = response.data.data.map(supplier => supplier.supplier_name);
        
        setSuppliers(supplierNames);  // Set the state to the list of supplier names
      } catch (err) {
        setError('Error fetching suppliers.');
      }
    };
  
    fetchSuppliers();
  }, []);

  

  const handleChange = (number, unit) => {
    const formattedWarranty = number && unit ? `${number} ${unit}${number > 1 ? 's' : ''}` : 'N/A';
    setSelectedValue(formattedWarranty);
  };
  
  useEffect(() => {
    if (currentProduct && currentProduct.warranty) {
      const warrantyParts = currentProduct.warranty.split(' ');
      setSelectedNumber(warrantyParts[0] || '');
      setSelectedUnit(warrantyParts[1]?.replace(/s$/, '') || '');
      setSelectedValue(currentProduct.warranty);
    }
  }, [currentProduct]);
  
  
  

  const categories = [
    {
      name: "Components",
      subcategories: ["Chassis Fan", "CPU Cooler", "Graphics Card", "Hard Drive", "Memory", "Motherboard", "PC Case", "Power Supply", "Intel Processor", "Processor Tray", "Solid State Drive (SSD)"]
    },
    {
      name: "Peripherals",
      subcategories: ["CCTV Camera", "Headset", "Keyboard", "Keyboard and Mouse Combo", "Monitor", "Mouse", "Network Devices", "Printer & Scanner", "Projector", "Audio Recorder", "Speaker", "UPS & AVR", "Web & Digital Camera"]
    },
    {
      name: "Accessories",
      subcategories: ["Cables", "Earphones", "Gaming Surface", "Power Bank"]
    },
    {
      name: "PC Furniture",
      subcategories: ["Chairs", "Tables"]
    },
    {
      name: "OS & Software",
      subcategories: ["Antivirus Software", "Office Applications", "Operating Systems"]
    },
    {
      name: "Laptops",
      subcategories: ["Chromebooks", "Laptops"]
    },
    {
      name: "Desktops",
      subcategories: ["Home Use Builds", "Productivity Builds", "Gaming Builds"]
    }
  ];
  
  // Find subcategories based on the selected category
  const selectedCategory = categories.find((cat) => cat.name === category);
  const subCategories = selectedCategory ? selectedCategory.subcategories : [];
  

  useEffect(() => {
    const descriptionArray = parseDescription();
    const lineCount = descriptionArray ? descriptionArray.length : 1;
    setRows(Math.min(lineCount + 1, 25)); // Set max rows to 25
  }, [description]);

  const parseDescription = () => {
    if (Array.isArray(description)) {
      return description.join("\n"); // Convert array to string with line breaks
    }
    return description || ""; // Fallback
  };
  
  // On change in textarea
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setDescription(text);
  
    // Split back into an array
    const descriptionArray = text.split("\n").filter((line) => line.trim() !== "");
    setDescription(descriptionArray);
  };
  

  useEffect(() => {
    axios.get(`${baseURL}/product/${productId}`)
      .then(res => {
        const { data } = res;
        setCurrentProduct(res.data)
  
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
        setDescription(data.description); 
        setWarranty(data.warranty);
        setProductid(data.product_id)
        // Parse warranty into number and unit
        const warrantyParts = data.warranty?.split(" ") || [];
        setSelectedNumber(warrantyParts[0] || ''); // e.g., "2"
        setSelectedUnit(warrantyParts[1]?.replace(/s$/, '') || ''); 
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
    // Validate required fields (you can add your validation logic here)
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
    formData.append('warranty', selectedValue);
    formData.append('description', description);
  
    // Store the previous product data (before updating)
    const previousProductData = {
      name: currentProduct.name,
      category: currentProduct.category,
      supplier: currentProduct.supplier,
      buying_price: currentProduct.buying_price,
      selling_price: currentProduct.selling_price,
      sub_category: currentProduct.sub_category,
      model: currentProduct.model,
      warranty: currentProduct.warranty,
      description: currentProduct.description,
    };
  
    // Compare previous and updated values to capture only the changed fields
    const updatedProductData = {
      name: name !== currentProduct.name ? { previous: currentProduct.name, updated: name } : null,
      category: category !== currentProduct.category ? { previous: currentProduct.category, updated: category } : null,
      supplier: supplier !== currentProduct.supplier ? { previous: currentProduct.supplier, updated: supplier } : null,
      buying_price: buyingPrice !== currentProduct.buying_price ? { previous: currentProduct.buying_price, updated: buyingPrice } : null,
      selling_price: sellingPrice !== currentProduct.selling_price ? { previous: currentProduct.selling_price, updated: sellingPrice } : null,
      sub_category: subCategory !== currentProduct.sub_category ? { previous: currentProduct.sub_category, updated: subCategory } : null,
      model: model !== currentProduct.model ? { previous: currentProduct.model, updated: model } : null,
      warranty: selectedValue !== currentProduct.warranty ? { previous: currentProduct.warranty, updated: selectedValue } : null,
      description: description !== currentProduct.description ? { previous: currentProduct.description, updated: description } : null,
    };
  
    // Remove null values from the updatedProductData object
    const changes = Object.fromEntries(Object.entries(updatedProductData).filter(([_, value]) => value !== null));
  
    // Create the event string based on the changed fields
    const events = Object.keys(changes).map(field => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
      return `Update the ${fieldName} of product ${productid}  `;
    }).join(', ');
  
    // Set the audit log entry
// Set the audit log entry
const auditData = {
  user: user.name,
  action: 'Update',
  module: 'Product',
  event: events || 'Update product info', // Default if no field is updated
  previousValue: Object.fromEntries(
    Object.entries(changes).map(([key, value]) => [
      key,
      { previous: value?.previous }, // Only store the previous value
    ])
  ),
  updatedValue: Object.fromEntries(
    Object.entries(changes).map(([key, value]) => [
      key,
      { updated: value?.updated }, // Only store the updated value
    ])
  ),
};

  
    // Send the audit log data to the server
    axios.put(`${baseURL}/product/${productId}`, formData)
      .then(res => {
        toast.success('Product updated successfully!');
  
        axios.post(`${baseURL}/audit`, auditData)
          .then(auditRes => {
            console.log('Audit logged successfully:', auditRes.data);
          })
          .catch(auditErr => {
            console.error('Audit log error:', auditErr);
          });
  
        setTimeout(() => {
          handleBackClick(); // Trigger handleBackClick after the delay
        }, 1000);
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


  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    
    // Filter to find the subcategories for the selected category
    const foundCategory = categories.find(cat => cat.name === selectedCategory);
    setSubCategories(foundCategory ? foundCategory.subcategories : []);
    setSubCategory(''); // Reset sub-category when category changes
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
            <div className={`w-[40%] flex flex-col justify-between h-full gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                <p>DATE ADDED</p>
                <p>DATE UPDATED</p>
              </div>
              <div className="w-[60%] flex flex-col justify-between h-full gap-4 font-semibold">
                <p>{formatDate(dateAdded)}</p>
                <p>{formatDate(updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Middle Section: Basic Information */}
          <div className="w-[30%] bg-white rounded-lg shadow-md p-6  flex flex-col">
            <h2 className="text-xl font-bold mb-4">BASIC INFORMATION</h2>
            <div className="mt-4 text-md p-4 font-medium flex py-4 ">
              <div className={`w-[40%] flex flex-col justify-between h-full gap-7 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                <p>Category<span className="text-red-500">*</span></p>
                <p>Sub-Category<span className="text-red-500">*</span></p>
                <p>Model<span className="text-red-500">*</span></p>
                <p>Warranty<span className="text-red-500">*</span></p>
                <p>Status<span className="text-red-500">*</span></p>
              </div>
              <div className="w-[60%] flex flex-col justify-between h-full gap-7">
              <div className="flex w-full gap-2 justify-between">
                  <select 
                    id="category"
                    className={`border rounded p-2 my-1 font-semibold w-full ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
                    value={category} 
                    onChange={handleCategoryChange}
                  >
                    <option value="" disabled selected={!category}>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex w-full gap-2 justify-between">
                  <select 
                    id="sub-category" 
                    className={`border rounded p-2 my-1 font-semibold w-full ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    disabled={!category} // Disable subcategory if no category is selected
                  >
                    <option value="" disabled selected={!subCategory}>Select Sub-Category</option>
                    {subCategories.map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>

                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model" className="border rounded p-2" />

                <div className="flex w-full gap-2 justify-between">
                    <div className='flex gap-2 w-full'>
                      <select
                        value={selectedNumber}
                        onChange={(e) => {
                          setSelectedNumber(e.target.value);
                          handleChange(e.target.value, selectedUnit);
                        }}
                        className="border border-gray-300 rounded p-2 w-[30%]"
                      >
                        <option value="">0</option> {/* Placeholder option */}
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedUnit}
                        onChange={(e) => {
                          setSelectedUnit(e.target.value);
                          handleChange(selectedNumber, e.target.value);
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                      >
                        <option value="">Time Frame</option> {/* Placeholder option */}
                        <option value={`Year`}>Year{selectedNumber > 1 ? 's' : ''}</option>
                        <option value={`Month`}>Month{selectedNumber > 1 ? 's' : ''}</option>
                        <option value={`Day`}>Day{selectedNumber > 1 ? 's' : ''}</option>
                      </select>
                    </div>
                  </div>


                <input
                    type="text"
                    value={currentStockStatus}
                    readOnly
                    className={`rounded p-2 text-center ${getStatusStyles(currentStockStatus).bgClass} ${getStatusStyles(currentStockStatus).textClass}`} // Apply text color from statusStyles
                  />
              </div>
            </div>
          </div>

          {/* Right Section: Purchase Info and Stock Level */}
          <div className="w-[30%] space-y-8  flex flex-col">
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">PURCHASE INFORMATION</h2>
              <div className="mt-4 text-md p-4 font-medium flex py-4">
                <div className={`w-[40%] flex flex-col justify-between h-full gap-4 py-2 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">BUYING PRICE<span className="text-red-500">*</span></div>
                  <div className="text-gray-500">SELLING PRICE<span className="text-red-500">*</span></div>
                  <div className="text-gray-500">SUPPLIER</div>
                </div>
                <div className="w-[60%] flex flex-col justify-between h-full gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg">₱</span>
                    <input 
                      type="number" 
                      value={buyingPrice} 
                      onChange={(e) => setBuyingPrice(e.target.value)} 
                      placeholder="Buying Price" 
                      className="border rounded p-2 pl-7"  // Add padding-left to make room for the peso sign
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg">₱</span>
                    <input 
                      type="number" 
                      value={sellingPrice} 
                      onChange={(e) => setSellingPrice(e.target.value)} 
                      placeholder="Selling Price" 
                      className="border rounded p-2 pl-7"  // Add padding-left to make room for the peso sign
                    />
                  </div>

                  <div className="flex w-full gap-2 items-center justify-between">
                    <select
                      id="supplier"
                      className="border rounded p-2 pl-7"  // Add padding-left to make room for the peso sign
                      value={supplier}  // Keep this one
                      onChange={(e) => setSupplier(e.target.value)}
                      style={{ maxHeight: '200px', overflowY: 'auto' }} // Makes the dropdown scrollable
                    >
                      <option value="" disabled>
                        Select Supplier
                      </option>

                      {suppliers.length > 0 ? (
                        // Sort suppliers alphabetically before mapping
                        suppliers
                          .sort((a, b) => a.localeCompare(b)) // Alphabetically sort suppliers
                          .map((supplierName, index) => (
                            <option key={index} value={supplierName}>
                              {supplierName}
                            </option>
                          ))
                      ) : (
                        <option value="" disabled>
                          No Suppliers Available
                        </option>
                      )}
                    </select>
                  </div>

                </div>

              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 w-full h-full">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xl font-bold">STOCK LEVEL</h2>
                <div className="bg-green-500 text-white px-4 py-1 rounded-[6px] text-sm flex gap-2 items-center justify-center">
                  Total stock <span className="font-bold">{availableUnitsCount}</span>
                </div>
              </div>
              <div className="mt-4 text-md p-4 font-medium flex py-4">
                <div className={`w-[70%] flex flex-col justify-between h-full gap-4 ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'} uppercase tracking-wider`}>
                  <div className="text-gray-500">LOW STOCK<span className="text-red-500">*</span></div>
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
          <h2 className="text-xl w-full text-left font-bold mb-4">PRODUCT SPECIFICATION<span className="text-red-500">*</span></h2>
          <textarea
              className="w-full overflow-y-auto p-2 border"
              style={{ maxHeight: "250px" }}
              rows={rows}
              placeholder="Description"
              value={parseDescription()} // Convert array to string for editing
              onChange={handleDescriptionChange}
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
