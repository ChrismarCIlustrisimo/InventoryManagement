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
import io from 'socket.io-client'; 
import { useLocation } from 'react-router-dom';
import { GrView } from "react-icons/gr";
import ConfirmationDialog from '../components/ConfirmationDialog';
import { MdDelete } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { API_DOMAIN } from '../utils/constants';


const PendingProducts = () => {
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
  const [actionType, setActionType] = useState(null);



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
  
      // Filter products to include only those that are not approved
      const products = response.data.data.filter(product => !product.isApproved);
  
      const updatedProducts = products.map(product => {
        const availableUnits = product.units.filter(unit => unit.status === 'in_stock').length;
        const lowStockThreshold = product.low_stock_threshold || 0; // Use product-specific thresholds
  
        // Determine stock status based on available units
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
      setProductCount(updatedProducts.length); // Update count based on filtered products
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
    const isInPriceRange = (minPrice || maxPrice)
      ? product.selling_price >= minPrice && product.selling_price <= maxPrice
      : true; 
    
    const isInCategory = categoryFilter === '' || product.category === categoryFilter;
    
    const isInSupplier = selectedSupplier === '' || product.supplier === selectedSupplier;

    const matchesSearchQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesSearchQuery &&
      isInCategory &&
      isInSupplier &&
      isInPriceRange
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

  const handleResetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchQuery('');
    setCategoryFilter(''); // Reset category filter
    setPriceRange(''); // Reset price range

    fetchProducts();
  };

    // Function to open the dialog for delete
    const handleDeleteClick = (id) => {
      setProductId(id);
      setActionType('delete');
      setIsDialogOpen(true);
    };
  
    // Function to open the dialog for approve
    const handleApproveClick = (id) => {
      setProductId(id);
      setActionType('approve');
      setIsDialogOpen(true);
    };


  const deleteProduct = async () => {
    if (!productId) return;

    try {
      await axios.delete(`${baseURL}/product/${productId}`);
      console.log('Delete successful');
      fetchProducts(); // Assuming this function reloads the products
    } catch (error) {
      console.error('Error deleting product:', error.response ? error.response.data : error.message);
    } finally {
      setIsDialogOpen(false);
      setProductId(null);
    }
  };

  const approveProduct = async () => {
    if (!productId) return;

    try {
      await axios.patch(`${baseURL}/product/approve/${productId}`);
      console.log('Product approved:', productId);
      fetchProducts(); // Assuming this function reloads the products
    } catch (error) {
      console.error('Error approving product:', error.message);
    } finally {
      setIsDialogOpen(false);
      setProductId(null);
    }
  };


  const handleViewProduct = (productId) => {
    navigate(`/view-product/${productId}`);
  };

  

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4'>
        <div className='flex items-center justify-center py-5'>
          <div className='flex w-[60%]'>
            <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Unapproved Products</h1>
            <div className={`flex w-[40%] gap-2 items-center justify-center border rounded-xl ${darkMode ? 'border-black' : 'border-white'}`}>
              <p className={`font-semibold text-lg ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>{productCount}</p>
              <p className={`text-xs ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>total products</p>
            </div>
          </div>
          <div className='w-full flex justify-end gap-2'>
           <SearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search product by name or model'}/>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col'>
                <label htmlFor='category' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CATEGORY</label>
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
                <label htmlFor='sortBy' className={`text-xs mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>SORT BY</label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={handleSortByChange}
                    className={`border rounded p-2 my-1 outline-none font-semibold ${
                        sortBy === ''
                            ? (darkMode 
                                ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                                : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                            : (darkMode 
                                ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                                : 'bg-light-activeLink text-dark-primary border-dark-primary')
                    }`}
                >
                    <option value="" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Select Option</option>
                    <option value="price_asc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Price Lowest to Highest</option>
                    <option value="price_desc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Price Highest to Lowest</option>
                    <option value="product_name_asc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Product Name A-Z</option>
                    <option value="product_name_desc" className={`${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>Product Name Z-A</option>
                </select>
              </div>
              
                <label className={`text-xs font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PRICE RANGE BY SELLING PRICE</label>

                <select
                  id='price_range'
                  value={priceRange}
                  onChange={handlePriceRange}
                  className={`border rounded p-2 my-1 
                    ${priceRange === '' 
                      ? (darkMode 
                        ? 'bg-transparent text-black border-[#a1a1aa] placeholder-gray-400' 
                        : 'bg-transparent text-white border-gray-400 placeholder-gray-500')
                    : (darkMode 
                        ? 'bg-dark-activeLink text-light-primary border-light-primary' 
                        : 'bg-light-activeLink text-dark-primary border-dark-primary')
                      } 
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
                        className={`w-[130px] border rounded bg-transparent pl-1 ${minPrice === '' ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary' : 'border-dark-primary')}`}
                      >
                        <input
                          type='number'
                          id='minPrice'
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value);
                            handleMinPriceChange(e);
                          }}
                          className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${minPrice === '' ? (darkMode ? 'text-black' : 'text-white') : darkMode ? 'text-black' : 'text-white'}`}
                          min='0'
                          placeholder='Min'
                        />
                      </div>
                    </div>

                    <span className='text-2xl text-center h-full text-[#a8adb0] mx-2'>-</span>

                    <div className='flex flex-col'>
                      <div 
                        className={`w-[130px] border rounded bg-transparent pl-1 ${maxPrice === '' ? `${darkMode ? 'border-black' : 'border-white'}` : (darkMode ? 'border-light-primary' : 'border-dark-primary')}`}
                      >
                        <input
                          type='number'
                          id='maxPrice'
                          value={maxPrice}s
                          onChange={(e) => {
                            setMaxPrice(e.target.value);
                            handleMaxPriceChange(e);
                          }}
                          className={`border-none px-2 py-1 text-sm bg-transparent w-[100%] outline-none ${minPrice === '' ? (darkMode ? 'text-black' : 'text-white') : darkMode ? 'text-black' : 'text-white'}`}
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
                    <th className='p-2 text-center' style={{ width: '400px' }}>Product Name</th>
                    <th className='p-2 text-center text-xs' style={{ width: '100px' }}>Model</th>
                    <th className='p-2 text-center text-xs' style={{ width: '120px' }}>Category</th>
                    <th className='p-2 text-center text-xs' style={{ width: '80px' }}>Qty.</th>
                    <th className='p-2 text-center text-xs' style={{ width: '80px' }}>Supplier</th>
                    <th className='p-2 text-center text-xs' style={{ width: '150px' }}>Buying Price</th>
                    <th className='p-2 text-center text-xs' style={{ width: '150px' }}>Selling Price</th>
                    <th className='p-2 text-center text-xs' style={{ width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
                    .map((product, index) => {
                      const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;

                      return (
                        <tr key={index} className={`border-b font-medium ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                          <td className='flex items-center justify-left p-2'>
                            <img src={product.image} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                            <p className='text-xs'>{product.name}</p>
                          </td>
                          <td className='text-center text-xs'>{product.model}</td>
                          <td className='text-center text-xs'>{product.category}</td>
                          <td className={`text-center text-xs font-semibold ${inStockUnits > 0 ? (darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary') : 'text-red-500'}`}>
                            {inStockUnits}
                          </td>
                          <td className='text-center text-xs'>{product.supplier || 'N/A'}</td>
                          <td className='text-center text-xs'>{product.buying_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className='text-center text-xs'>{product.selling_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="text-center">
                              <div className="relative inline-block group">
                                <button
                                  onClick={() => handleViewProduct(product._id)}
                                  className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                >
                                  <GrView size={25} />
                                </button>
                                <span
                                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    darkMode ? 'bg-gray-200 text-black' : 'bg-black text-white'
                                  }`}
                                >
                                  View
                                </span>
                              </div>

                              <div className="relative inline-block group">
                                <button
                                  onClick={() => handleApproveClick(product._id)}
                                  className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                >
                                  <IoCheckmarkCircleOutline size={25} />
                                </button>
                                <span
                                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    darkMode ? 'bg-gray-200 text-black' : 'bg-black text-white'
                                  }`}
                                >
                                  Approve
                                </span>
                              </div>

                              {product.canDelete && product.sales === 0 && (
                                <div className="relative inline-block group">
                                  <button
                                    onClick={() => handleDeleteClick(product._id)}
                                    className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                  >
                                    <MdDelete size={25} />
                                  </button>
                                  <span
                                    className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                      darkMode ? 'bg-gray-200 text-black' : 'bg-black text-white'
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
                <p className={`${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>No products found matching the filter criteria.</p>
              </div>
            )}

            </div>

        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onConfirm={actionType === 'delete' ? deleteProduct : approveProduct} // Use the appropriate function
        onCancel={() => {
          setIsDialogOpen(false);
          setProductId(null);
        }}
        message={
          actionType === 'delete'
            ? "Are you sure you want to delete this product?"
            : "Are you sure you want to approve this product?"
        }
      />

    </div>
  );
};

export default PendingProducts;