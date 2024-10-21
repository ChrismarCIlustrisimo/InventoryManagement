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

const stockColors = {
  "HIGH": "#1e7e34", // Darker Green
  "LOW": "#d39e00", // Darker Yellow
  "OUT OF STOCK": "#c82333", // Darker Red
};

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
        textClass: 'text-[#BF6A02]',
        bgClass: 'bg-[#FFF1C2]',
      };
      break;
    case 'OUT OF STOCK':
      statusStyles = {
        textClass: 'text-[#EC221F]',
        bgClass: 'bg-[#FEE9E7]',
      };
      break;
  }

  return statusStyles; // Return the status styles directly
};

const DashboardProductList = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const baseURL = "http://localhost:5555";
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState();
  const [suppliers, setSuppliers] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const location = useLocation();
  const [productId, setProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(''); // State to hold selected price range
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isInputsEmpty = minPrice === '' && maxPrice === '';
  const [stockAlerts, setStockAlerts] = useState({
    "LOW": false,
    "HIGH": false,
    "OUT OF STOCK": false,
  });


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
  
      // Get unique suppliers
      const uniqueSuppliers = [...new Set(response.data.data.map(product => product.supplier))];
      setSuppliers(uniqueSuppliers);
  
      const products = response.data.data;
  
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
  
        return {
          ...product,
          current_stock_status: stockStatus,
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

const filteredProducts = products
  .filter(product => {
    const isInPriceRange = priceRange
      ? product.selling_price >= priceRanges[priceRange][0] && 
        product.selling_price <= priceRanges[priceRange][1]
      : true; // If no price range is selected, include all products
    
    return (
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === '' || product.category === categoryFilter) &&
      (selectedSupplier === '' || product.supplier === selectedSupplier) && // Include supplier filter
      (stockAlerts['LOW'] && product.current_stock_status === 'LOW' ||
      stockAlerts['HIGH'] && product.current_stock_status === 'HIGH' ||
      stockAlerts['OUT OF STOCK'] && product.current_stock_status === 'OUT OF STOCK' ||
      (!stockAlerts['LOW'] && !stockAlerts['HIGH'] && !stockAlerts['OUT OF STOCK'])) &&
      isInPriceRange // Add the price range filter
    );
  })
  .sort((a, b) => {
    if (sortBy === 'price_asc') return a.selling_price - b.selling_price;
    if (sortBy === 'price_desc') return b.selling_price - a.selling_price;
    if (sortBy === 'product_name_asc') return a.name.localeCompare(b.name);
    if (sortBy === 'product_name_desc') return b.name.localeCompare(a.name);
    return 0;
  });



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

  const handleSortByChange = e => setSortBy(e.target.value);

  const handlePriceRange = (event) => {
    setPriceRange(event.target.value); // Update the state based on selected value
  };

  const handlePriceRangeFilter = () => {
    setProducts(prevProducts => prevProducts.filter(product =>
      (minPrice === '' || product.selling_price >= parseFloat(minPrice)) &&
      (maxPrice === '' || product.selling_price <= parseFloat(maxPrice))
    ));
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchQuery('');
    setCategoryFilter(''); // Reset category filter
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
  };

  const deleteProduct = async () => {
    if (!productId) return; // Ensure productId is valid
  
    try {
      await axios.delete(`${baseURL}/product/${productId}`);
      console.log('Delete successful');
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error('Error deleting product:', error.response ? error.response.data : error.message);
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

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
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
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search products by name and product id'}/>
            <button className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary' : 'dark:bg-dark-primary'}`} onClick={handleAddProductClick}> Add Product</button>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='category' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CATEGORY</label>
                <select
                    id='category'
                    value={selectedCategory} // Set the value of the select to the state
                    onChange={handleCategoryChange}
                    className={`border rounded p-2 my-1 
                      ${selectedCategory === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}
                >
                    <option value=''>Select Category</option>
                    <option value='Components'>Components</option>
                    <option value='Peripherals'>Peripherals</option>
                    <option value='Accessories'>Accessories</option>
                    <option value='PC Furniture'>PC Furniture</option>
                    <option value='OS & Software'>OS & Software</option>
                </select>


              </div>
              

              <div className='flex flex-col'>
                <label htmlFor='sortBy' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SORT BY</label>
                <select
                    id='sortBy'
                    value={sortBy} // Set the value of the select to the state
                    onChange={handleSortByChange}
                    className={`border rounded p-2 my-1 
                      ${sortBy === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}S
                  >
                    <option value=''>Select Option</option>
                    <option value='price_asc'>Price Lowest to Highest</option>
                    <option value='price_desc'>Price Highest to Lowest</option>
                    <option value='product_name_asc'>Product Name A-Z</option>
                    <option value='product_name_desc'>Product Name Z-A</option>
                  </select>
              </div>


              <div className='flex flex-col mb-2'>
                <label htmlFor='stockAlert' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>STOCK ALERT</label>
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
              

                <label className={`text-xs font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PRICE RANGE BY SELLING PRICE</label>

                <select
                  id='price_range'
                  value={priceRange}
                  onChange={handlePriceRange}
                  className={`border rounded p-2 my-1 
                    ${priceRange === '' 
                      ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                      : (darkMode 
                        ? 'bg-light-activeLink text-light-primary' 
                        : 'bg-transparent text-black')} 
                    outline-none font-semibold`}
                >
                  <option value=''>Select Option</option>
                  <option value='1K-5K'>₱1K - 5K</option>
                  <option value='6K-10K'>₱6K - 10K</option>
                  <option value='11K-20K'>₱11K - 20K</option>
                  <option value='21K-30K'>₱21K - 30K</option>
                </select>


                <div className={`flex justify-between items-center gap-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>

                  <div className={`flex flex-col`}>
                    <div className={`w-[100px] rounded bg-transparent pl-1 border ${isInputsEmpty ? `${darkMode ? `border-black` : `border-white`}` : (darkMode ? 'border-light-primary' : 'dark:border-dark-primary')}`}>
                      <input
                        type='number'
                        id='minPrice'
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                          handleMinPriceChange(e);
                        }}
                        className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${isInputsEmpty ? 'text-black' : ''}`}
                        min='0'
                        placeholder='Min'
                      />
                    </div>
                  </div>
                  <span className='text-2xl text-center h-full text-[#a8adb0]'>-</span>
                  <div className={`flex flex-col`}>
                  <div className={`w-[100px] rounded bg-transparent pl-1 border ${isInputsEmpty ? `${darkMode ? `border-black` : `border-white`}` : (darkMode ? 'border-light-primary' : 'dark:border-dark-primary')}`}>
                  <input
                        type='number'
                        id='maxPrice'
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                          handleMaxPriceChange(e);
                        }}
                        className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${isInputsEmpty ? 'text-black' : ''}`}
                        min='0'
                        placeholder='Max'
                      />
                    </div>
                  </div>
                  <button
                    className={`p-2 text-xs rounded-md text-white ${isInputsEmpty ? (darkMode ? 'bg-light-textSecondary' : 'bg-dark-textSecondary') : (darkMode ? 'bg-light-primary' : 'bg-dark-primary')} hover:bg-opacity-60 active:bg-opacity-30`}
                    onClick={handlePriceRangeFilter}
                  >
                    <FaPlay />
                  </button>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
            <button
              className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-transparent border-2 
                ${darkMode ? 'hover:bg-opacity-30 hover:bg-dark-textSecondary' : 'hover:bg-opacity-30 hover:bg-light-textSecondary'}`}
                    onClick={handleResetFilters}
              >
                <HiOutlineRefresh className={`mr-2 text-2xl ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`} />
                <p className={`text-lg ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`}>Reset Filters</p>
              </button>
            </div>
          </div>

          <div className={`h-[78vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
              {filteredProducts.length > 0 ? (
                <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                  <thead className={`sticky top-0 z-5 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                    <tr>
                      <th className='p-2 text-center' style={{ width: '400px' }}>Product Name</th>
                      <th className='p-2 text-center text-xs' style={{ width: '100px' }}>Model</th>
                      <th className='p-2 text-center text-xs' style={{ width: '120px' }}>Category</th>
                      <th className='p-2 text-center text-xs' style={{ width: '80px' }}>Qty.</th>
                      <th className='p-2 text-center text-xs' style={{ width: '80px' }}>Supplier</th>
                      <th className='p-2 text-center text-xs' style={{ width: '150px' }}>Buying Price</th>
                      <th className='p-2 text-center text-xs' style={{ width: '150px' }}>Selling Price</th>
                      <th className='p-2 text-center text-xs' style={{ width: '180px' }}>Status</th>
                      <th className='p-2 text-center text-xs' style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => {
                      const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;
                      const statusStyles = getStatusStyles(product.current_stock_status);

                      return (
                        <tr key={index} className={`border-b font-medium ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                          <td className='flex items-center justify-left p-2'>
                            <img src={`${baseURL}/${product.image}`} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                            <p className='text-xs'>{product.name}</p>
                          </td>
                          <td className='text-center text-xs'>{product.model}</td>
                          <td className='text-center text-xs'>{product.category}</td>
                          <td className={`text-center text-xs font-semibold ${inStockUnits > 0 ? (darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary') : 'text-red-500'}`}>
                            {inStockUnits}
                          </td>
                          <td className='text-center text-xs'>{product.supplier || 'N/A'}</td>
                          <td className='text-center text-xs'>{product.buying_price}</td>
                          <td className='text-center text-xs'>{product.selling_price}</td>
                          <td className={`text-sm text-center font-semibold`}>
                            <span className={`${statusStyles.textClass} ${statusStyles.bgClass} py-2 w-[80%] inline-block rounded-md`}>
                              {product.current_stock_status}
                            </span>
                          </td>

                          <td className='text-center'>
                            <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`} onClick={() => handleViewProduct(product._id)}>
                              <GrView size={20} />
                            </button>
                            <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`} onClick={() => handleEditProduct(product._id)}>
                              <BiEdit size={20} />
                            </button>
                            <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`} onClick={() => { setProductId(product._id); setIsDialogOpen(true); }}>
                              <AiOutlineDelete size={20} />
                            </button>
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
        onConfirm={deleteProduct}
        onCancel={() => {
          setIsDialogOpen(false);
          setProductId(null); // Reset productId on cancel
        }}
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default DashboardProductList;
