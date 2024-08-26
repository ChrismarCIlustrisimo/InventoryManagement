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
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { HiOutlineDotsHorizontal, HiX } from "react-icons/hi";

const DashboardProductList = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const baseURL = "http://localhost:5555";

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenButton, setIsOpenButton] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productCount, setProductCount] = useState();
  const [selectedSupplier, setSelectedSupplier] = useState(''); // State for selected supplier
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockAlerts, setStockAlerts] = useState({
    "LOW STOCK": false,
    "NEAR LOW STOCK": false,
    "HIGH STOCK": false,
    "OUT OF STOCK": false,
  });

  const handleStockAlertChange = (e) => {
    setStockAlerts(prev => ({
      ...prev,
      [e.target.value]: e.target.checked
    }));
  };
  
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${baseURL}/supplier`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setSuppliers(response.data.data);
      console.log("Suppliers:", response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchProducts();
      fetchSuppliers();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setProducts(response.data.data);
      setProductCount(response.data.count); 
      console.log("Products:", response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchProducts();
    }
  }, [user]);

  const filteredProducts = products
  .filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedSupplier === '' || product.supplier === selectedSupplier) &&
    (categoryFilter === '' || product.category === categoryFilter) &&
    (minPrice === '' || product.buying_price >= parseFloat(minPrice)) &&
    (maxPrice === '' || product.buying_price <= parseFloat(maxPrice)) &&
    (stockAlerts['LOW STOCK'] && product.current_stock_status === 'LOW STOCK' ||
    stockAlerts['NEAR LOW STOCK'] && product.current_stock_status === 'NEAR LOW STOCK' ||
    stockAlerts['HIGH STOCK'] && product.current_stock_status === 'HIGH STOCK' ||
    stockAlerts['OUT OF STOCK'] && product.current_stock_status === 'OUT OF STOCK' ||
    (!stockAlerts['LOW STOCK'] && !stockAlerts['NEAR LOW STOCK'] && !stockAlerts['HIGH STOCK'] && !stockAlerts['OUT OF STOCK']))
  )
  .sort((a, b) => {
    if (sortBy === 'price_asc') return a.buying_price - b.buying_price;
    if (sortBy === 'price_desc') return b.buying_price - a.buying_price;
    if (sortBy === 'product_name_asc') return a.name.localeCompare(b.name);
    if (sortBy === 'product_name_desc') return b.name.localeCompare(a.name);
    return 0;
  });



    const handleCategoryChange = e => {
      setCategoryFilter(e.target.value);
    };
    
  const handleSortByChange = e => setSortBy(e.target.value);
  
  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchQuery('');
    setSelectedSupplier(''); // Clear selected supplier
  };

  const handleAddProductClick = () => {
    navigate('/addproduct');
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems(prevCheckedItems => 
      prevCheckedItems.includes(index) 
        ? prevCheckedItems.filter(item => item !== index) 
        : [...prevCheckedItems, index]
    );
  };

  const handleEditProduct = (product) => {
    // Implement the edit functionality
  };

  const handleDeleteProduct = (productId) => {
    // Implement the delete functionality
  };

  const toggleButtons = () => {
    setIsOpenButton(prev => !prev);
  };

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-BG' : 'bg-dark-BG'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4'>
        <div className='flex items-center justify-center py-5'>
          <div className='flex w-[30%]'>
            <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Product</h1>
            <div className={`flex w-[100%] gap-2 items-center justify-center border rounded-xl ${darkMode ? 'border-black' : 'border-white'}`}>
              <p className={`font-semibold text-lg ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>{productCount}</p>
              <p className={`text-xs ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>total products</p>
            </div>
          </div>
          <div className='w-full flex justify-end gap-2'>
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
            <button className={`px-4 py-2 rounded-md font-semibold text-2xl ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD'}`} onClick={toggleButtons}>{isOpenButton ? <HiX /> : <HiOutlineDotsHorizontal />}</button>
            <button className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-ACCENT' : 'dark:bg-dark-ACCENT'}`} onClick={handleAddProductClick}> Add Product</button>
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-CARD' : 'dark:bg-dark-CARD'}`}>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col'>
                <label htmlFor='category' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>CATEGORY</label>
                <select
                  id='category'
                  onChange={handleCategoryChange}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
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
                <label htmlFor='sortBy' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>SORT BY</label>
                <select
                  id='sortBy'
                  onChange={handleSortByChange}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                >
                  <option value=''>Select Option</option>
                  <option value='price_asc'>Price Lowest to Highest</option>
                  <option value='price_desc'>Price Highest to Lowest</option>
                  <option value='product_name_asc'>Product Name A-Z</option>
                  <option value='product_name_desc'>Product Name Z-A</option>
                </select>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='supplier' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>SUPPLIER</label>
                <select
                  id='supplier'
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  <option value="None">None</option>
                  {suppliers.map(supplier => (
                    <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col'>
                <label htmlFor='stockAlert' className={`text-xs mb-2 ${darkMode ? 'text-dark-TABLE' : 'dark:text-light-TABLE'}`}>STOCK ALERT</label>
                <div id='stockAlert' className='flex flex-col'>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='LOW STOCK' id='lowStock' checked={stockAlerts['LOW STOCK']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Low Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='NEAR LOW STOCK' id='nearLowStock' checked={stockAlerts['NEAR LOW STOCK']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Near Low Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='HIGH STOCK' id='highStock' checked={stockAlerts['HIGH STOCK']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>High Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='OUT OF STOCK' id='outOfStock' checked={stockAlerts['OUT OF STOCK']} onChange={handleStockAlertChange}/>
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Out of Stock</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <button
                className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide ${darkMode ? 'bg-light-TABLE text-dark-TEXT' : 'dark:bg-dark-TABLE text-light-TEXT'}`}
                onClick={handleResetFilters}
              >
                <GrPowerReset className='mr-2' />
                <p>Reset Filters</p>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={`h-[76vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-CARD1' : 'dark:bg-dark-CARD1'}`}>
            <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-TEXT' : 'text-dark-TEXT'}`}>
              <thead className={`sticky top-0 z-10 ${darkMode ? 'border-light-TABLE bg-light-CARD' : 'border-dark-TABLE bg-dark-CARD'} border-b text-sm`}>
                <tr>
                  <th className='p-2 text-left'>Product</th>
                  <th className='p-2 text-center'>Category</th>
                  <th className='p-2 text-center'>In-stock</th>
                  <th className='p-2 text-center'>Supplier</th>
                  <th className='p-2 text-center'>Product Code</th>
                  <th className='p-2 text-center'>Buying Price (PHP)</th>
                  <th className='p-2 text-center'>Selling Price (PHP)</th>
                  <th className='p-2 text-center'></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={index} className={`border-b ${darkMode ? 'border-light-TABLE' : 'border-dark-TABLE'}`}>
                    <td className='flex items-center p-2'>
                      <img src={`${baseURL}/images/${product.image.substring(14)}`} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                      <p className='text-sm'>{product.name}</p>
                    </td>
                    <td className='p-2 text-center'>{product.category}</td>
                    <td className='p-2 text-center flex gap-2 items-center justify-center'>
                      <p className='text-center'>{product.quantity_in_stock}</p>
                      <p className='text-center text-sm'>{product.current_stock_status}</p>
                    </td>
                    <td className='p-2 text-center'>{suppliers.find(s => s._id === product.supplier)?.name || 'No Supplier'}</td>
                    <td className='p-2 text-center'>{product.product_id}</td>
                    <td className='p-2 text-center'>{product.buying_price}</td>
                    <td className='p-2 text-center'>{product.selling_price}</td>
                    {isOpenButton && (
                      <td className='p-2 text-2xl'>
                        <div className='w-full h-full flex'>
                          <button className={`p-2 rounded ${darkMode ? 'text-dark-ACCENT' : 'text-light-ACCENT'}`} onClick={() => handleEditProduct(product)}>
                            <FaEdit />
                          </button>
                          <button className={`p-2 rounded ${darkMode ? 'text-dark-ACCENT' : 'text-light-ACCENT'}`} onClick={() => handleDeleteProduct(product._id)}>
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductList;
