import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAdminTheme } from '../context/AdminThemeContext';
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { BiImages } from 'react-icons/bi';
import { AiOutlineUpload } from "react-icons/ai";
import ProductModal from '../components/ProductModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const handleCloseModal = () => setOpenModal(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [subCategory, setSubCategory] = useState(''); // New sub-category state
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [localInputs, setLocalInputs] = useState([]);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [serialNumberImages, setSerialNumberImages] = useState([]); 
  const [editModes, setEditModes] = useState(Array(serialNumbers.length).fill(false));
  const [savedCount, setSavedCount] = useState(0);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [descriptionArray, setDescriptionArray] = useState([]);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);


  const categories = [
    {
      name: "Components",
      subcategories: ["Chassis Fan", "CPU Cooler", "Graphics Card", "Hard Drive", "Memory", "Motherboard", "PC Case", "Power Supply", "Intel Processor", "Processor Tray", "Solid State Drive (SSD)"]
    },{
      name: "Peripherals",
      subcategories: [ "CCTV Camera", "Headset", "Keyboard", "Keyboard and Mouse Combo", "Monitor", "Mouse", "Network Devices", "Printer & Scanner", "Projector", "Audio Recorder", "Speaker", "UPS & AVR", "Web & Digital Camera"]
    },{
      name: "Accessories",
      subcategories: [ "Cables", "Earphones", "Gaming Surface", "Power Bank"]
    },{
      name: "PC Furniture",
      subcategories: [ "Chairs", "Tables"]
    },{
      name: "OS & Software",
      subcategories: [ "Antivirus Software", "Office Applications", "Operating Systems"]
    },{
      name: "Laptops",
      subcategories: ["Chromebooks", "Laptops"]
    },{
      name: "Desktops",
      subcategories: [ "Home Use Builds", "Productivity Builds", "Gaming Builds"]
    }
  ];

    // Handler to update the combined value
    const handleChange = (number, unit) => {
      if (!number || !unit) {
        setSelectedValue("N/A"); // Use "N/A" if either field is not selected
      } else {
        setSelectedValue(`${number} ${unit}`);
      }
    };
    


  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    
    // Filter to find the subcategories for the selected category
    const foundCategory = categories.find(cat => cat.name === selectedCategory);
    setSubCategories(foundCategory ? foundCategory.subcategories : []);
    setSubCategory(''); // Reset sub-category when category changes
  };


const handleCheckClick = (index) => {
  // Update serial numbers based on local inputs
  const newSerialNumbers = serialNumbers.map((serial, i) => 
    ({ ...serial, serialNumber: localInputs[i] || serial.serialNumber })
  );
  setSerialNumbers(newSerialNumbers);

  setEditModes((prev) => {
    const newEditModes = [...prev];
    newEditModes[index] = true; 
    return newEditModes;
  });

  setSavedCount(prevCount => Math.min(prevCount + 1, quantity)); // Increment saved count
};


const handleEditClick = (index) => {
  setEditModes((prev) => {
    const newEditModes = [...prev];
    newEditModes[index] = false; 
    return newEditModes;
  });

  setSavedCount(prevCount => Math.max(prevCount - 1, 0));   // Decrement the saved count when entering edit mode
};


  const handleSerialNumberImageChange = (index, file) => {
    const newSerialNumbers = [...serialNumbers];
    newSerialNumbers[index].image = file; // Store the file in the state
    setSerialNumbers(newSerialNumbers);
    
    // Update the serialNumberImages state
    const newImages = [...serialNumberImages];
    newImages[index] = file;
    setSerialNumberImages(newImages);
  };




  const handleButtonClick = () => {
    if (file) {
      console.log("Uploading file:", file);
      setFile(null);
    } else {
      fileInputRef.current.click();
    }
  };

  const validate = () => {
    if (!name) return toast.error('Product name is required');
    if (!category) return toast.error('Product category is required');
    if (!subCategory) return toast.error('Sub-category is required'); 
    if (!buyingPrice || isNaN(buyingPrice) || buyingPrice <= 0) return toast.error('Valid buying price is required');
    if (!sellingPrice || isNaN(sellingPrice) || sellingPrice <= 0) return toast.error('Valid selling price is required');
    if (!lowStockThreshold || isNaN(lowStockThreshold) || lowStockThreshold < 0) return toast.error('Valid low stock threshold is required');
    if (!file) return toast.error('Product image is required');
    if (!selectedNumber) return toast.error('Select Number for Warranty');
    if (!selectedUnit) return toast.error('Select Number for Time Frame');
    return ''; // No errors
};


  const handleOpenModal = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      setOpenModal(true);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleInputChange = (index, value) => {
    const newLocalInputs = [...localInputs];
    newLocalInputs[index] = value; 
    setLocalInputs(newLocalInputs); 
};

const handleDescriptionChange = (e) => {
  const text = e.target.value;
  setDescription(text);
  setDescriptionArray(text.split("\n").filter(line => line.trim() !== ""));
};


  const upload = () => {
    const validationError = validate();
    if (validationError) {
        setError(validationError);
        return;
    }

    // Check for empty serial numbers or missing images
    for (let i = 0; i < serialNumbers.length; i++) {
        if (!serialNumbers[i].serialNumber) {
            setError(`Serial number ${i + 1} is required.`);
            return;
        }
        if (!serialNumberImages[i]) {
            setError(`Image for serial number ${i + 1} is required.`);
            return;
        }
    }

    const formData = new FormData();
    formData.append('file', file); // Main product image
    formData.append('name', name);
    formData.append('category', category);
    formData.append('sub_category', subCategory);
    formData.append('supplier', supplier);
    formData.append('description', JSON.stringify(descriptionArray)); // Add descriptionArray to form data
    formData.append('model', model);
    formData.append('low_stock_threshold', lowStockThreshold);
    formData.append('buying_price', buyingPrice);
    formData.append('selling_price', sellingPrice);
    formData.append('warranty', selectedValue);

    // Create an array of units with serial numbers and their respective images
    const units = serialNumbers.map((sn, index) => {
        const imageFile = serialNumberImages[index];
        formData.append('serialImages', imageFile); // Append the image file directly to FormData
        return {
            serial_number: sn.serialNumber, // Correctly extract the serial number string
            status: 'in_stock',
            purchase_date: new Date().toISOString(),
        };
    });

    // Append the units as a JSON string
    formData.append('units', JSON.stringify(units));

    // Send the request to the server
    axios.post('http://localhost:5555/product', formData)
        .then(res => {
            console.log('Product added:', res.data);
            handleBackClick();
        })
        .catch(err => {
            const errorMessage = err.response?.data.message || 'An unknown error occurred';
            console.error('Error:', errorMessage);
            setError(errorMessage);
        });
};

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
    setSerialNumbers(Array.from({ length: value }, () => ({ serialNumber: '', image: null })));
    setSerialNumberImages(Array(value).fill(null));
  };

  return (
    <div className={`h-full w-full flex flex-col gap-2 ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
      <div className='flex items-center justify-start h-[8%]'>
        <button className={`flex gap-2 items-center py-4 px-6 outline-none ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'} hover:underline`} onClick={handleBackClick}>
          <IoCaretBackOutline /> Back to sales order
        </button>
      </div>
      <p className='text-3xl text-center mb-12 font-semibold'>Add New Product</p>
          <div className='w-full h-[82%] flex items-start justify-center gap-8'>
            <div className='flex flex-col w-[25%] gap-8'>
              <div className='flex flex-col items-center justify-center border-2 rounded-md p-4 border-dashed bg-transparent'>
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="Product" className="w-64 h-64 object-cover" />
                ) : (
                  <BiImages className="w-64 h-64 text-gray-500" />
                )}
              </div>
              <input type='file' id="file" ref={fileInputRef} className={`hidden`} onChange={handleFileChange}/>
              <button className="bg-blue-500 text-white rounded-md p-2 px-6 flex items-center justify-start gap-2" onClick={handleButtonClick} >
                <AiOutlineUpload className='text-2xl'/>
                {file ? 'Upload Product Photo' : 'Upload Product Photo'}
              </button>
            </div>

            <div className="flex flex-col w-[25%] gap-4 p-4 rounded-[10px] bg-white">
                <p className="text-2xl font-semibold">Basic information</p>
                <div className="flex w-full gap-2 justify-between">
                  <label htmlFor="name" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT NAME</label>
                  <input type="text"  id="name" placeholder="Name"
                    className={`border bg-transparent rounded-md p-2 w-[58%] ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>


                <div className="flex w-full gap-2 justify-between">
                  <label htmlFor="category" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CATEGORY</label>
                  <select id="category" className={`border rounded p-2 my-1 font-semibold w-[58%] ${ darkMode ? 'text-dark-textSecondary' : 'light:text-light-textSecondary'}`}  value={category} onChange={handleCategoryChange} >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="flex w-full gap-2 justify-between">
                  <label htmlFor="sub-category" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SUB-CATEGORY</label>
                  <select id="sub-category" 
                    className={`border rounded p-2 my-1 font-semibold w-[58%] ${darkMode ? 'text-dark-textSecondary' : 'light:text-light-textSecondary'}`} 
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    disabled={!category}
                >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((subCat) => (
                        <option key={subCat} value={subCat}>
                            {subCat}
                        </option>
                    ))}
                </select>
                </div>

                <div className="flex w-full gap-2 justify-between">
                  <label htmlFor="model" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>MODEL</label>
                  <input type="text"  id="model" placeholder="Model"
                    className={`border bg-transparent rounded-md p-2 w-[58%] ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>

                <div className="flex w-full gap-2 justify-between">
                    <label htmlFor="warranty" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                      WARRANTY
                    </label>
                    <div className='flex gap-2 w-[58%]'>
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
                        className="border border-gray-300 rounded p-2 w-[70%]"
                      >
                        <option value="">Time Frame</option> {/* Placeholder option */}
                        <option value="Year">Year</option>
                        <option value="Months">Months</option>
                        <option value="Days">Days</option>
                      </select>
                    </div>
                  </div>


              </div>

              <div className="flex flex-col w-[25%] gap-4">
                <div className='flex flex-col p-4 gap-4 bg-white rounded-[10px]'>
                   <p className="text-2xl font-semibold">Purchase information</p>
                  <div className='flex w-full gap-2 items-center justify-between'>
                    <label htmlFor="buying_price" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>BUYING PRICE</label>
                    <input type='number' placeholder='Buying Price' id="buying_price"
                      className={`border bg-transparent rounded-md p-2 w-[58%] ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
                      value={buyingPrice}
                      onChange={(e) => setBuyingPrice(e.target.value)}
                    />
                  </div>

                  <div className='flex w-full gap-2 items-center justify-between'>
                    <label htmlFor="selling_price" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SELLING PRICE</label>
                    <input type='number'  placeholder='Selling Price' id="selling_price"
                      className={`border bg-transparent rounded-md p-2 w-[58%] ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                    />
                  </div>

                  <div className='flex w-full gap-2 items-center justify-between'>
                    <label htmlFor="supplier" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SUPPLIER</label>
                    <input type='text' placeholder='Supplier Name' id="supplier"
                      className={`border bg-transparent rounded-md p-2 w-[58%] ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                    />
                  </div>
                </div>

                <div className='flex flex-col p-4 gap-4 bg-container bg-white rounded-[10px]'>
                  <div className='w-full flex items-center justify-between'>
                    <p className="text-2xl font-semibold">Stock Level</p>
                  </div>
                  <div className='flex w-full gap-2 items-center justify-between'>
                    <label htmlFor="low_stock_threshold" className={`flex items-center ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>LOW STOCK</label>
                    <input type='number' placeholder='Low Stock' id="low_stock_threshold"
                      className={`border bg-transparent rounded-md p-2 w-[58%] ${darkMode ? 'border-light-border' : 'border-dark-border'}`}
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <ProductModal
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                serialNumbers={serialNumbers}
                serialNumberImages={serialNumberImages}
                localInputs={localInputs}
                editModes={editModes}
                handleInputChange={handleInputChange}
                handleEditClick={handleEditClick}
                handleCheckClick={handleCheckClick}
                handleSerialNumberImageChange={handleSerialNumberImageChange}
                upload={upload}
            />
      

          </div>
          {error && <p className='text-red-500 text-xl text-center'>{error}</p>}
                {/* Description Modal */}
          {openDescriptionModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className={`p-4 rounded-lg w-1/2 h-[50%] flex flex-col ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
                  <h2 className="text-xl mb-4">Add Product Description</h2>
                  
                  {/* Scrollable Textarea */}
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter product description. Use a new line to add another item."
                    className={`w-full flex-grow p-2 border rounded-md resize-none overflow-y-auto ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}
                    style={{ maxHeight: '60%' }}
                  />
                  
                  {/* Buttons Section */}
                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      onClick={() => setOpenDescriptionModal(false)}
                      className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleOpenModal}
                      className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

          )}
          <ToastContainer />
          <div className={`w-full h-[10%] px-4 py-6 border-t-2 flex items-center justify-end ${darkMode ? 'bg-light-container border-light-border' : 'bg-dark-container border-dark-border'}`}>
            <div className="flex items-center gap-4"> 
              <button type="button" onClick={() => handleBackClick()} className={`px-8 py-2 bg-transparent border rounded-md ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}>Cancel</button> 
              <div className={`flex-grow border-l h-[38px] ${darkMode ? 'border-light-border' : 'border-dark-border'}`}></div> 
              <button type="button" variant="contained" onClick={() => setOpenDescriptionModal(true)} className={`px-6 py-2 rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Continue</button> 
            </div> 
         </div>
        </div>
  );
};

export default AddProduct;
