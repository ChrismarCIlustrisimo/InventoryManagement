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

const DashboardProductList = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const navigate = useNavigate();
  const baseURL = "http://localhost:5555";

  // State for filters and search query
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // State for checkboxes
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productCount, setProductCount] = useState();
  const [suppliersList, setSuppliersList] = useState([]); // State for suppliers

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${baseURL}/supplier`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setSuppliers(response.data.data); // Update state with fetched data
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

  const supplierMap = suppliers.reduce((map, supplier) => {
    map[supplier._id] = supplier.name;
    return map;
  }, {});

  // Handler functions
  const handleDateFilter = () => {};
  const handleSortByChange = e => setSortBy(e.target.value);
  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSearchQuery(''); // Clear search query
  };

  const handleAddProductClick = () => {
    navigate('/addproduct');
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = e => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setCheckedItems(isChecked ? products.map((_, index) => index) : []);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (index) => {
    setCheckedItems(prevCheckedItems => {
      if (prevCheckedItems.includes(index)) {
        return prevCheckedItems.filter(item => item !== index);
      } else {
        return [...prevCheckedItems, index];
      }
    });
  };

  useEffect(() => {
    // Fetch suppliers when component mounts
    axios.get('http://localhost:5555/supplier')
      .then(res => {
        setSuppliersList(res.data.data); // Assuming your API response contains an array of suppliers
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err.response ? err.response.data : err.message);
      });
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setProducts(response.data.data); // Update state with fetched data
      setProductCount(response.data.count); 
      console.log("Products:", response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message); // Log error message
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchProducts();
    }
  }, [user]);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className='w-full flex justify-end gap-6'>
            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
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
                  onChange={handleDateFilter}
                  className={`border rounded p-2 my-1 border-none text-primary outline-none ${darkMode ? 'bg-light-ACCENT text-dark-TEXT' : 'dark:bg-dark-ACCENT light:text-light-TEXT'}`}
                >
                  <option value=''>Select Category</option>
                  <option value='components'>Components</option>
                  <option value='peripherals'>Peripherals</option>
                  <option value='accessories'>Accessories</option>
                  <option value='pc_furniture'>PC Furniture</option>
                  <option value='os_software'>OS & Software</option>
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
                  onChange={(e) => setSuppliersList(e.target.value)}
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
                    <input type='checkbox' name='stockAlert' value='lowStock' id='lowStock' />
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Low Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='nearLowStock' id='nearLowStock' />
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>Near Low Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='highStock' id='highStock' />
                    <span className='checkmark'></span>
                    <span className={`label-text ${darkMode ? 'text-light-TEXT' : 'dark:text-dark-TEXT'}`}>High Stock</span>
                  </label>
                  <label className='custom-checkbox flex items-center'>
                    <input type='checkbox' name='stockAlert' value='outOfStock' id='outOfStock' />
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
              <thead>
                <tr className={`border-b text-sm ${darkMode ? 'border-light-TABLE bg-light-CARD' : 'border-dark-TABLE bg-dark-CARD'}`}>
                  <th className='p-2 text-center'>
                    <div className={`custom-checkbox border-2 rounded-md ${darkMode ? 'border-light-TABLE' : 'border-dark-TABLE'}`}>
                      <input
                        type='checkbox'
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                    </div>
                  </th>
                  <th className='p-2 text-left'>Product</th>
                  <th className='p-2 text-center'>Category</th>
                  <th className='p-2 text-center'>In-stock</th>
                  <th className='p-2 text-center'>Supplier</th>
                  <th className='p-2 text-center'>Product Code</th>
                  <th className='p-2 text-center'>Buying Price (PHP)</th>
                  <th className='p-2 text-center'>Selling Price (PHP)</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={index} className={`border-b ${darkMode ? 'border-light-TABLE' : 'border-dark-TABLE'}`}>
                    <td className='p-2 px-4 text-center'>
                      <div className={`custom-checkbox border-2 rounded-md ${darkMode ? 'border-light-TABLE' : 'border-dark-TABLE'}`}>
                        <input
                          type="checkbox"
                          id="custom-checkbox"
                          checked={checkedItems.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </div>
                    </td>
                    <td className='flex items-center py-2'>
                      <img src={`${baseURL}/images/${product.image.substring(14)}`} alt={product.name} className='w-12 h-12 object-cover mr-[10px]' />
                      <p>{product.name}</p>
                    </td>
                    <td className='p-2 text-center'>{product.category}</td>
                    <td className='p-2 text-center'>{product.quantity_in_stock}</td>
                    <td className='p-2 text-center'>{supplierMap[product.supplier] ? supplierMap[product.supplier] : 'No Supplier'}</td>
                    <td className='p-2 text-center'>{product.product_id}</td>
                    <td className='p-2 text-center'>{product.buying_price}</td>
                    <td className='p-2 text-center'>{product.selling_price}</td>
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
