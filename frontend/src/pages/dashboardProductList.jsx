import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import SearchBar from '../components/adminSearchBar';
import 'react-datepicker/dist/react-datepicker.css';
import { HiOutlineRefresh } from "react-icons/hi";
import '../App.css';
import axios from 'axios';
import { FaPlay } from "react-icons/fa";
import io from 'socket.io-client'; // Import socket.io-client
import { useLocation } from 'react-router-dom';
import { GrView } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useStockAlerts } from '../context/StockAlertsContext';
import { IoArchiveOutline } from "react-icons/io5";
import { API_DOMAIN } from '../utils/constants';
import { toast,ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css';

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


const DashboardProductList = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const baseURL = API_DOMAIN;
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const location = useLocation();
  const [productId, setProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(''); // State to hold selected price range
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isInputsEmpty = minPrice === '' && maxPrice === '';
  const { stockAlerts, setStockAlerts } = useStockAlerts();
  const [actionType, setActionType] = useState(null); // State to track the action type
  const [filteredProducts, setFilteredProducts] = useState(products);  // Store filtered products
  const [productID, setProductID] = useState(null);

  
  const handleStockAlertChange = (e) => {
    setStockAlerts(prev => ({
      ...prev,
      [e.target.value]: e.target.checked
    }));
  };



  useEffect(() => {
    if (user && user.token) {
      fetchProducts();
    }
  }, [user, location.pathname]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
  

  
      const products = response.data.data.filter(
        product => product.isApproved && !product.isArchived
      );  
      // Update current_stock_status based on available units and product-specific thresholds
      const updatedProducts = products.map(product => {
        const availableUnits = product.units.filter(unit => unit.status === 'in_stock').length;
        const lowStockThreshold = product.low_stock_threshold || 0;  // Use product-specific thresholds
  
        let stockStatus = 'HIGH';
  
        if (availableUnits === 0) {
          stockStatus = 'OUT OF STOCK';
        } else if (availableUnits <= lowStockThreshold) {
          stockStatus = 'LOW';
        }
        // Calculate if product can be deleted (created within the last hour)
        const productCreatedTime = new Date(product.createdAt);
        const currentTime = new Date();
        const timeDifference = currentTime - productCreatedTime;
        const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
        const canDelete = timeDifference <= oneHourInMs; // true if created within the last hour
  
        return {
          ...product,
          current_stock_status: stockStatus,
          canDelete, // Add canDelete property to each product
        };
      });
  
      setProducts(updatedProducts);
      setProductCount(response.data.count);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };
  
  
  


useEffect(() => {
  const socket = io(baseURL, { transports: ['websocket'], upgrade: true });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.on('product-updated', (updatedProduct) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product._id === updatedProduct._id ? updatedProduct : product
    ));
  });

  return () => {
    socket.disconnect();
  };
}, []);
const priceRanges = {
  '1K-5K': [1000, 5000],
  '6K-10K': [6000, 10000],
  '11K-20K': [11000, 20000],
  '21K-30K': [21000, 30000],
};

// Handle price range selection
const handlePriceRange = (e) => {
  const selectedRange = e.target.value;
  setPriceRange(selectedRange);
  
  // Set min and max prices based on the selected range
  if (selectedRange === '') {
    setMinPrice(null);
    setMaxPrice(null);
  } else {
    const [min, max] = priceRanges[selectedRange];
    setMinPrice(min);
    setMaxPrice(max);
  }
};

useEffect(() => {
  const updatedFilteredProducts = products
    .filter(product => {
      // Price range filter
      const isInPriceRange = (minPrice || maxPrice)
        ? product.selling_price >= (minPrice || 0) && product.selling_price <= (maxPrice || Infinity)
        : true;

      // Category filter
      const isInCategory = categoryFilter === '' || product.category === categoryFilter;

      // Supplier filter
      const isInSupplier = selectedSupplier === '' || product.supplier === selectedSupplier;

      // Stock alerts filter
      const isInStockStatus =
        (stockAlerts['LOW'] && product.current_stock_status === 'LOW') ||
        (stockAlerts['HIGH'] && product.current_stock_status === 'HIGH') ||
        (stockAlerts['OUT OF STOCK'] && product.current_stock_status === 'OUT OF STOCK') ||
        (!stockAlerts['LOW'] && !stockAlerts['HIGH'] && !stockAlerts['OUT OF STOCK']);

      // Search query filter
      const matchesSearchQuery =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.toLowerCase().includes(searchQuery.toLowerCase());

      // Combine all filters
      return matchesSearchQuery && isInCategory && isInSupplier && isInStockStatus && isInPriceRange;
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case 'price_asc':
          return a.selling_price - b.selling_price;
        case 'price_desc':
          return b.selling_price - a.selling_price;
        case 'product_name_asc':
          return a.name.localeCompare(b.name);
        case 'product_name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0; // No sorting if sortBy is empty
      }
    });

  setFilteredProducts(updatedFilteredProducts); // Update state with the filtered products
}, [products, minPrice, maxPrice, categoryFilter, selectedSupplier, stockAlerts, searchQuery, sortBy]);  // Re-run effect when any of these change







  const handleCategoryChange = e => {
    setCategoryFilter(e.target.value);
    setSelectedCategory(event.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchQuery('');
    setCategoryFilter(''); // Reset category filter
    setPriceRange(''); // Reset price range
    setStockAlerts({
      "LOW": false,
      "HIGH": false,
      "OUT OF STOCK": false,
    }); // Reset stock alerts

    // Refetch products to ensure the display reflects the unfiltered state
    fetchProducts();
  };

  const handleAddProductClick = () => {
    navigate('/addproduct');
    toast.success('Product added successfully')
  };

  const deleteProduct = async () => {
    if (!productId) return; // Ensure productId is valid
  
    try {
      await axios.delete(`${baseURL}/product/${productId}`);
  
      // Create the audit log after deleting the product
      const auditData = {
        user: user.name,            // Assuming you have the current user information
        action: 'Delete',           // Action type (in this case, deleting the product)
        module: 'Product',          // The module name (Product in this case)
        event: `Deleted the product ${productId}`,  // Event description (Deleting product)
        previousValue: 'Active',    // Previous value of the product status (before deletion)
        updatedValue: 'Deleted',    // New value of the product status (after deletion)
      };
  
      // Send audit log data to the server
      await axios.post(`${baseURL}/audit`, auditData);
  
      toast.success('Product deleted successfully'); // Toast notification for success
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      toast.error(`Error deleting product: ${error.response ? error.response.data : error.message}`); // Toast notification for error
    } finally {
      setIsDialogOpen(false); // Close the dialog
      setProductId(null); // Reset the productId
    }
  };
  
  
  const archiveProduct = async () => {
    if (!productId || !productID) return;  // Ensure both productId and productID are present
  
    try {
      // Archive the product
      await axios.patch(`${baseURL}/product/archive/${productId}`);
  
      // Create the audit log after archiving the product
      const auditData = {
        user: user.name,            // Assuming you have the current user information
        action: 'Archive',           // Action type (in this case, updating the product's status)
        module: 'Product',          // The module name (Product in this case)
        event: `Archived the product ${productID}` ,  // Event description (Archiving product)
        previousValue: 'Active',    // Previous value of the product status
        updatedValue: 'Archived',   // New value of the product status (after archiving)
      };
  
      // Send audit log data to the server
      await axios.post(`${baseURL}/audit`, auditData);
  
      toast.success('Product archived successfully'); // Toast notification for success
      fetchProducts(); // Refetch products after archiving
    } catch (error) {
      toast.error(`Error archiving product: ${error.response ? error.response.data : error.message}`); // Toast notification for error
    } finally {
      setIsDialogOpen(false); // Close the dialog
      setProductId(null); // Reset the productId
    }
  };
  
  

  const handleEditProduct = (productId) => {
    navigate(`/update-product/${productId}`);
  }

  const handleViewProduct = (productId) => {
    navigate(`/view-product/${productId}`);
  };

  
  const handleLowReports = () => {
    navigate(`/sales-report`);
  };

 
  const sortedProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
      <ToastContainer />
      <div className='pt-[70px] px-6 py-4'>
        <div className='flex items-center justify-center py-5'>
          <div className='flex w-[30%]'>
            <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Product</h1>
            <div className={`flex w-[100%] gap-2 items-center justify-center border rounded-xl ${darkMode ? 'border-black' : 'border-white'}`}>
              <p className={`font-semibold text-lg ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>{productCount}</p>
              <p className={`text-xs ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>total products</p>
            </div>
          </div>
          <div className='w-full flex justify-end gap-2'>
           <SearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search product by name or model'}/>
          <button 
                className={`px-4 py-2 rounded-md font-semibold transform transition-transform duration-200 
                            ${darkMode ? 'bg-light-primary' : 'dark:bg-dark-primary'} 
                            hover:scale-105`} 
                             onClick={handleAddProductClick}>
                               Add Product
              </button>
              {stockAlerts.LOW && (
                  <button
                    className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 border transform transition-transform duration-200 
                                ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-light-primary'} 
                                hover:bg-opacity-10 active:bg-opacity-20 hover:scale-105`}
                    onClick={handleLowReports}
                  >
                    Print Low Stock Reports
                  </button>
                )}
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='category' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CATEGORY</label>
                <select
                      id="category"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className={`border rounded p-2 my-1 outline-none font-semibold ${
                          selectedCategory === ''
                              ? (darkMode 
                                  ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                                  : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                              : (darkMode 
                                  ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                                  : 'bg-light-activeLink text-dark-primary border-dark-primary')
                      }`}
                  >
                      <option value="" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Category</option>
                      <option value="Components" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Components</option>
                      <option value="Peripherals" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Peripherals</option>
                      <option value="Accessories" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Accessories</option>
                      <option value="PC Furniture" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>PC Furniture</option>
                      <option value="OS & Software" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>OS & Software</option>
                  </select>



              </div>
              

              <div className='flex flex-col'>
                <label htmlFor='sortBy' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SORT BY</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={handleSortByChange}
                  className={`border rounded p-2 ${sortBy === '' 
                    ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                    : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                  outline-none font-semibold`}
                >
                  <option value="" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Option</option>
                  <option value="price_asc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Price Lowest to Highest</option>
                  <option value="price_desc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Price Highest to Lowest</option>
                  <option value="product_name_asc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Product Name A-Z</option>
                  <option value="product_name_desc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Product Name Z-A</option>
                </select>
              </div>


              <div className='flex flex-col mb-2'>
                <label htmlFor='stockAlert' className={`text-md font-semibold pb-2 ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>STOCK ALERT</label>
                <div id='stockAlert' className='flex flex-col'>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='HIGH' id='highStock' checked={stockAlerts['HIGH']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>HIGH</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='LOW' id='lowStock' checked={stockAlerts['LOW']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>LOW</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='OUT OF STOCK' id='outOfStock' checked={stockAlerts['OUT OF STOCK']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>OUT OF STOCK</span>
                  </label>
                </div>
              </div>
              

                <label className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PRICE RANGE BY SELLING PRICE</label>

                <select
                  id='price_range'
                  value={priceRange}
                  onChange={handlePriceRange}
                  className={`border rounded p-2 ${priceRange === '' 
                    ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                    : (darkMode ? 'bg-light-activeLink text-light-primary' : 'bg-light-activeLink text-light-primary')} 
                  outline-none font-semibold`}
                >
                  <option value='' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Option</option>
                  <option value='1K-5K' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>₱1K - 5K</option>
                  <option value='6K-10K' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>₱6K - 10K</option>
                  <option value='11K-20K' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>₱11K - 20K</option>
                  <option value='21K-30K' className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>₱21K - 30K</option>
                </select>


                <div className='flex justify-center items-center'>
                    <div className='flex flex-col'>
                      <div 
                        className={`w-[130px] border rounded bg-transparent pl-1 ${minPrice === '' ? (darkMode ? 'border-black' : 'border-white') : (darkMode ? 'border-light-primary' : 'border-dark-primary')}`}
                      >
                        <input
                          type='number'
                          id='minPrice'
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value);
                            handleMinPriceChange(e);
                          }}
                          className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${minPrice === '' ? (darkMode ? 'text-black' : 'text-white') : (darkMode ? 'text-light-primary' : 'text-dark-primary')}`}
                          min='0'
                          placeholder='Min'
                        />
                      </div>
                    </div>

                    <span className='text-2xl text-center h-full text-[#a8adb0] mx-2'>-</span>

                    <div className='flex flex-col'>
                      <div 
                        className={`w-[130px] border rounded bg-transparent pl-1 ${maxPrice === '' ? (darkMode ? 'border-black' : 'border-white') : (darkMode ? 'border-light-primary' : 'border-dark-primary')}`}
                      >
                        <input
                          type='number'
                          id='maxPrice'
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value);
                            handleMaxPriceChange(e);
                          }}
                          className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${maxPrice === '' ? (darkMode ? 'text-black' : 'text-white') : (darkMode ? 'text-light-primary' : 'text-dark-primary')}`}
                          min='0'
                          placeholder='Max'
                        />
                      </div>
                    </div>
                  </div>



            </div>




            <div className='flex flex-col gap-2'>
              <button
                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-gray-400 border-2 
                  ${darkMode ? 'hover:bg-dark-textSecondary hover:scale-105' : 'hover:bg-light-textSecondary hover:scale-105'} transition-all duration-300`}
                onClick={handleResetFilters}
              >
                <HiOutlineRefresh className={`mr-2 text-2xl text-white`} />
                <p className={`text-lg text-white`}>Reset Filters</p>
              </button>
            </div>
          </div>

          <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
              {filteredProducts.length > 0 ? (
                <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                  <thead className={`sticky top-0 z-5 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                    <tr>
                    <th className='p-2 text-left' style={{ width: '400px' }}>Product Name</th>
                      <th className='p-2 text-left text-xs' style={{ width: '60px' }}>Model</th>
                      <th className='p-2 text-left text-xs' style={{ width: '100px' }}>Category</th>
                      <th className='p-2 text-center text-xs' style={{ width: '60px' }}>Qty.</th>
                      <th className='p-2 text-left text-xs' style={{ width: '100px' }}>Supplier</th>
                      <th className='p-2 text-left text-xs' style={{ width: '150px' }}>Buying Price</th>
                      <th className='p-2 text-left text-xs' style={{ width: '150px' }}>Selling Price</th>
                      <th className='p-2 text-center text-xs' style={{ width: '180px' }}>Status</th>
                      <th className='p-2 text-center text-xs' style={{ width: '180px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                      {filteredProducts
                         .sort((a, b) => {
                          if (sortBy) {
                            // Respect the sortBy logic
                            switch (sortBy) {
                              case 'price_asc':
                                return a.selling_price - b.selling_price;
                              case 'price_desc':
                                return b.selling_price - a.selling_price;
                              case 'product_name_asc':
                                return a.name.localeCompare(b.name);
                              case 'product_name_desc':
                                return b.name.localeCompare(a.name);
                              default:
                                return 0;
                            }
                          } 
                          // Default to new to old sorting
                          return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                      .map((product, index) => {
                        const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;
                        const statusStyles = getStatusStyles(product.current_stock_status);

                        return (
                          <tr key={index} className={`border-b font-medium ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                          <td className='flex items-center justify-left p-2'>
                          {/*<img src={`${baseURL}/${product.image}`} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />*/}

                            <img src={product.image} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                            <p className='text-xs'>{product.name}</p>
                          </td>
                          <td className="text-left text-xs p-2 max-w-[150px] truncate">
                            {product.model}
                          </td>

                          <td className='text-left text-xs p-2'>{product.category}</td>
                          <td className={`text-center text-xs p-2 font-semibold ${inStockUnits > 0 ? (darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary') : 'text-red-500'}`}>
                            {inStockUnits}
                          </td>
                          <td className='text-left text-xs p-2'>{product.supplier || 'N/A'}</td>
                          <td className='text-left text-xs p-2'>{product.buying_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className='text-left text-xs p-2'>{product.selling_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className={`text-sm text-center font-semibold p-2`}>
                            <span className={`${statusStyles.textClass} ${statusStyles.bgClass} py-2 w-[80%] inline-block rounded-md`}>
                              {product.current_stock_status}
                            </span>
                          </td>
                            <td className="text-center">
                              <div className="relative inline-block group">
                                <button
                                  className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                  onClick={() => handleViewProduct(product._id)}
                                >
                                  <GrView size={20} />
                                </button>
                                <span
                                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    darkMode ?  'bg-gray-200 text-black' : 'bg-black text-white'
                                  }`}
                                >
                                  View
                                </span>
                              </div>

                              <div className="relative inline-block group">
                                <button
                                  className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                  onClick={() => handleEditProduct(product._id)}
                                >
                                  <BiEdit size={20} />
                                </button>
                                <span
                                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    darkMode ?  'bg-gray-200 text-black' : 'bg-black text-white'
                                  }`}
                                >
                                  Edit
                                </span>
                              </div>


                              <div className="relative inline-block group">
                                <button
                                  className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                  onClick={() => { 
                                    setProductId(product._id);
                                    setProductID(product.product_id); // Set the productID to the product.productID (or whichever value you need) 
                                    setActionType('archive'); // Set the action type to archive
                                    setIsDialogOpen(true); 
                                  }}
                                >
                                  <IoArchiveOutline size={20} />
                                </button>
                                <span
                                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    darkMode ?  'bg-gray-200 text-black' : 'bg-black text-white'
                                  }`}
                                >
                                  Archive
                                </span>
                              </div>

                              {product.canDelete && product.sales === 0 && (
                                <div className="relative inline-block group">
                                  <button
                                    className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                    onClick={() => { 
                                      setProductId(product._id); 
                                      setActionType('delete'); // Set the action type to delete
                                      setIsDialogOpen(true); 
                                    }}
                                  >
                                    <AiOutlineDelete size={20} />
                                  </button>
                                  <span
                                    className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                      darkMode ?  'bg-gray-200 text-black' : 'bg-black text-white'
                                    }`}
                                  >
                                    Delete
                                  </span>
                                </div>
                              )}


                            </td>


                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className='flex items-center justify-center h-[78vh] text-lg text-center'>
                  <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No products found matching the filter criteria.</p>
                </div>
              )}
            </div>

        </div>
      </div>
      <ConfirmationDialog 
          isOpen={isDialogOpen}
          onConfirm={actionType === 'delete' ? deleteProduct : archiveProduct} // Conditional action based on the actionType
          onCancel={() => {
            setIsDialogOpen(false);
            setProductId(null); // Reset productId on cancel
          }}
          message={
            actionType === 'delete' 
              ? "Are you sure you want to delete this product?"
              : "Are you sure you want to archive this product?"
          }
        />
    </div>
  );
};

export default DashboardProductList;