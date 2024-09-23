import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import SearchBar from '../components/adminSearchBar';
import 'react-datepicker/dist/react-datepicker.css';
import { GrPowerReset } from 'react-icons/gr';
import '../App.css';
import axios from 'axios';
import { FaPlay } from "react-icons/fa";
import io from 'socket.io-client'; // Import socket.io-client
import { useLocation } from 'react-router-dom';

const stockColors = {
  "IN STOCK": "#1e7e34", // Darker Green
  "NEAR LOW": "#e06c0a", // Darker Orange
  "LOW": "#d39e00", // Darker Yellow
  "OUT OF STOCK": "#c82333", // Darker Red
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
  const [stockAlerts, setStockAlerts] = useState({
    "LOW": false,
    "NEAR LOW": false,
    "IN STOCK": false,
    "OUT OF STOCK": false,
  });

  const categoryThresholds = {
    'Components': { nearLow: 10, low: 5 },
    'Peripherals': { nearLow: 15, low: 3 },
    'Accessories': { nearLow: 20, low: 10 },
    'PC Furniture': { nearLow: 20, low: 10 },
    'OS & Software': { nearLow: 10, low: 5 },
    // Add more categories as needed
  };
  

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

          // Add this right after fetching products in the fetchProducts function
          const uniqueSuppliers = [...new Set(response.data.data.map(product => product.supplier))];
          setSuppliers(uniqueSuppliers);
          

  
      const products = response.data.data;
  
      // Update current_stock_status based on category thresholds
      const updatedProducts = products.map(product => {
        const thresholds = categoryThresholds[product.category];
        let stockStatus = 'IN STOCK';
  
        if (product.quantity_in_stock === 0) {
          stockStatus = 'OUT OF STOCK';
        } else if (product.quantity_in_stock <= thresholds.low) {
          stockStatus = 'LOW';
        } else if (product.quantity_in_stock <= thresholds.nearLow) {
          stockStatus = 'NEAR LOW';
        }
  
        return {
          ...product,
          current_stock_status: stockStatus
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


const filteredProducts = products
  .filter(product =>
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.product_id.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter === '' || product.category === categoryFilter) &&
    (selectedSupplier === '' || product.supplier === selectedSupplier) && // Include supplier filter
    (stockAlerts['LOW'] && product.current_stock_status === 'LOW' ||
    stockAlerts['NEAR LOW'] && product.current_stock_status === 'NEAR LOW' ||
    stockAlerts['IN STOCK'] && product.current_stock_status === 'IN STOCK' ||
    stockAlerts['OUT OF STOCK'] && product.current_stock_status === 'OUT OF STOCK' ||
    (!stockAlerts['LOW'] && !stockAlerts['NEAR LOW'] && !stockAlerts['IN STOCK'] && !stockAlerts['OUT OF STOCK']))
  )
  .sort((a, b) => {
    if (sortBy === 'price_asc') return a.selling_price - b.selling_price;
    if (sortBy === 'price_desc') return b.selling_price - a.selling_price;
    if (sortBy === 'product_name_asc') return a.name.localeCompare(b.name);
    if (sortBy === 'product_name_desc') return b.name.localeCompare(a.name);
    return 0;
  });




  const handleCategoryChange = e => {
    setCategoryFilter(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleSortByChange = e => setSortBy(e.target.value);

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
      "NEAR LOW": false,
      "IN STOCK": false,
      "OUT OF STOCK": false,
    }); // Reset stock alerts

    // Refetch products to ensure the display reflects the unfiltered state
    fetchProducts();
  };

  const handleAddProductClick = () => {
    navigate('/addproduct');
  };

  const handleRowClick = (productId) => {
    navigate(`/update-product/${productId}`);
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
          <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='category' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CATEGORY</label>
                <select
                  id='category'
                  onChange={handleCategoryChange}
                  className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
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
                  onChange={handleSortByChange}
                  className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
                >
                  <option value=''>Select Option</option>
                  <option value='price_asc'>Price Lowest to Highest</option>
                  <option value='price_desc'>Price Highest to Lowest</option>
                  <option value='product_name_asc'>Product Name A-Z</option>
                  <option value='product_name_desc'>Product Name Z-A</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='supplier' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SUPPLIER</label>
                <select
                  id='supplier'
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className={`border rounded p-2 my-1 border-none text-activeLink outline-none font-semibold ${darkMode ? 'bg-light-activeLink text-dark-primary' : 'dark:bg-dark-activeLink light:text-light-primary' }`}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.filter(supplier => supplier).map((supplier, index) => (
                    <option key={index} value={supplier}>{supplier}</option>
                  ))}
                </select>
              </div>



              <div className='flex flex-col'>
                <label htmlFor='stockAlert' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>STOCK ALERT</label>
                <div id='stockAlert' className='flex flex-col'>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='LOW' id='lowStock' checked={stockAlerts['LOW']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Low</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='NEAR LOW' id='nearLowStock' checked={stockAlerts['NEAR LOW']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Near Low</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='IN STOCK' id='highStock' checked={stockAlerts['IN STOCK']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>IN STOCK</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='OUT OF STOCK' id='outOfStock' checked={stockAlerts['OUT OF STOCK']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Out of Stock</span>
                  </label>
                </div>
              </div>
              <label className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PRICE RANGE</label>
              <div className={`flex justify-left items-center gap-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                <div className='flex flex-col'>
                  <div className={`w-[100px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-primary' : 'dark:border-dark-primary'}`}>
                    <input type='number' id='minPrice' value={minPrice} onChange={handleMinPriceChange} className='border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none' min='0' placeholder='Min'/>
                  </div>
                </div>
                <span className='text-2xl text-center h-full text-[#a8adb0]'>-</span>
                <div className='flex flex-col'>
                  <div className={`w-[100px] border rounded bg-transparent border-3 pl-1 ${darkMode ? 'border-light-primary' : 'dark:border-dark-primary' }`}>
                    <input type='number' id='maxPrice' value={maxPrice} onChange={handleMaxPriceChange} className='border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none' min='0' placeholder='Max' /> 
                   </div>
                </div>
                <button className={`p-2 text-xs rounded-md text-white ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'} hover:bg-opacity-60 active:bg-opacity-30`} onClick={handlePriceRangeFilter}><FaPlay /></button>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
            <button
                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium ${darkMode ? 'bg-light-textSecondary text-dark-textPrimary' : 'bg-dark-textSecondary text-dark-textPrimary' }`}
                onClick={handleResetFilters}
              >
                <GrPowerReset className='mr-2' />
                <p>Reset Filters</p>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={`h-[76vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
            {filteredProducts.length > 0 ? (
              <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                <thead className={`sticky top-0 z-10 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                  <tr>
                    <th className='p-2 text-left'>Product</th>
                    <th className='p-2 text-center'>Category</th>
                    <th className='p-2 text-center'>In-stock</th>
                    <th className='p-2 text-center'>Supplier</th>
                    <th className='p-2 text-center'>Product Code</th>
                    <th className='p-2 text-center'>Buying Price (PHP)</th>
                    <th className='p-2 text-center'>Selling Price (PHP)</th>
                    <th className='p-2 text-center'>Stock Status</th> 
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={index}
                        onClick={() => handleRowClick(product._id)}
                        className={`border-b cursor-pointer font-medium ${darkMode ? 'border-light-border' : 'border-dark-border'}
                                  hover:shadow-lg hover:bg-gray-100 dark:hover:${darkMode ? 'bg-light-border' : 'bg-dark-border'}
                                  transform hover:scale-100 hover:translate-x-2 transition-transform transition-shadow`}
                    >
                      <td className='flex items-center justify-left p-2'>
                        <img src={`${baseURL}/images/${product.image.substring(14)}`} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                        <p className='text-sm'>{product.name}</p>
                      </td>
                      <td className='text-center text-sm'>{product.category}</td>
                      <td className='text-center'>{product.quantity_in_stock}</td>
                      <td className='text-center text-xs'>
                        {product.supplier || 'N/A'}
                      </td>
                      <td className='text-center text-sm'>{product.product_id}</td>
                      <td className='text-center'>{product.buying_price}</td>
                      <td className='text-center'>{product.selling_price}</td>
                      <td className='text-xs text-center text-dark-textPrimary' style={{ background: stockColors[product.current_stock_status] || '#ffffff' }}>
                      {product.current_stock_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='flex items-center justify-center h-[76vh] text-lg text-center'>
                <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No products found matching the filter criteria.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardProductList;
