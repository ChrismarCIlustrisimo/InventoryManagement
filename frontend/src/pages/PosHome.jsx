import { IoCloseCircle } from "react-icons/io5";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { RiFileList3Fill } from "react-icons/ri";
import { GrTechnology } from "react-icons/gr";
import { FaMouse } from "react-icons/fa";
import { MdCable, MdTableRestaurant } from "react-icons/md";
import { CgSoftwareDownload } from "react-icons/cg";
import '../scrollbar.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import ProceedToPayment from '../components/ProceedToPayment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductLoading from '../components/ProductLoading';
import useSocket from '../hooks/useSocket';
import UnitSelectionModal from "../components/UnitSelectionModal";

const baseURL = 'http://localhost:5555';

const PosHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const { user } = useAuthContext();
  const { darkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadingItems = Array.from({ length: 6 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUnitSelectionOpen, setIsUnitSelectionOpen] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({
    'All Products': 0,
    'Components': 0,
    'Peripherals': 0,
    'Accessories': 0,
    'PC Furniture': 0,
    'OS & Software': 0
  });


  
  const calculateTotal = () => cart.reduce((total, item) => total + (parseFloat(item.product.selling_price) || 0) * (item.quantity || 0), 0);

  const handlePayButton = () => {
    console.log('Proceed to payment button clicked');
    if (cart.length === 0) {
      toast.error('Cart is empty! Please add products before proceeding.', { background: 'toastify-color-dark' });
    } else {
      console.log('Opening payment modal');
      setIsModalOpen(true);
    }
  };
  


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/product`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      const availableProducts = response.data.data.filter(product =>
        product.units.some(unit => unit.status === 'in_stock')
      );

      setFetchedProducts(availableProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };




  const handleCloseModal = () => setIsModalOpen(false);

  const handlePaymentSuccess = async () => {
    toast.success('Payment successful!');
    setCart([]);
    fetchProducts();
    setIsModalOpen(false); // Close the payment modal
  };
  
  const handlePaymentError = () => {
    toast.error('Payment failed!', { background: 'toastify-color-dark' });
    setIsModalOpen(false); // Close the payment modal
  };

  const updateProducts = (updatedProduct) => {
    setProducts(prevProducts => {
      const index = prevProducts.findIndex(p => p._id === updatedProduct._id);
      if (index !== -1) {
        const updatedProducts = [...prevProducts];
        updatedProducts[index] = updatedProduct;
        return updatedProducts;
      }
      return [...prevProducts, updatedProduct];
    });
  };

  const setFetchedProducts = (fetchedProducts) => {
    setProducts(fetchedProducts);
    setFilteredProducts(fetchedProducts);
  
    const counts = fetchedProducts.reduce((acc, product) => {
      // Count the number of units that are in stock
      const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;
  
      if (inStockUnits > 0) {
        const category = product.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + inStockUnits;
        acc['All Products'] = (acc['All Products'] || 0) + inStockUnits;
      }
      return acc;
    }, {
      'All Products': 0,
      'Components': 0,
      'Peripherals': 0,
      'Accessories': 0,
      'PC Furniture': 0,
      'OS & Software': 0,
    });
  
    setCategoryCounts(counts);
  };
  
  
  
  useSocket(setFetchedProducts, updateProducts);



  useEffect(() => {
    if (!user) return;
    fetchProducts();
  }, [user]);



  useEffect(() => {
    setFilteredProducts(products.filter(product => {
      const isInCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    
      const matchesSearchQuery = 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.product_id && product.product_id.toLowerCase().includes(searchQuery.toLowerCase()));
    
      return isInCategory && matchesSearchQuery;
    }));
    
  }, [products, selectedCategory, searchQuery]);
  

  
  const handleCategoryChange = (category) => setSelectedCategory(category);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setIsUnitSelectionOpen(true); // Open the unit selection modal
  };

  const handleSelectUnit = (unit) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.product._id === selectedProduct._id);
      
      if (existingProduct) {
        const updatedCart = prevCart.map(item =>
          item.product._id === selectedProduct._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                unitIds: [...item.unitIds, unit._id], // Add the selected unit ID
              }
            : item
        );
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            product: selectedProduct,
            quantity: 1,
            unitIds: [unit._id], // Start with the selected unit ID
          },
        ];
      }
    });
    setIsUnitSelectionOpen(false); // Close the modal after selecting a unit
  };

  const handleRemoveFromCart = (productId) => setCart(prevCart => prevCart.filter(item => item.product._id !== productId));

  const buttons = [
    { icon: <RiFileList3Fill className='w-8 h-8' />, label: 'All Products', count: categoryCounts['All Products'] || 0 },
    { icon: <GrTechnology className='w-8 h-8' />, label: 'Components', count: categoryCounts['Components'] || 0 },
    { icon: <FaMouse className='w-8 h-8' />, label: 'Peripherals', count: categoryCounts['Peripherals'] || 0 },
    { icon: <MdCable className='w-8 h-8' />, label: 'Accessories', count: categoryCounts['Accessories'] || 0 },
    { icon: <MdTableRestaurant className='w-8 h-8' />, label: 'PC Furniture', count: categoryCounts['PC Furniture'] || 0 },
    { icon: <CgSoftwareDownload className='w-8 h-8' />, label: 'OS & Software', count: categoryCounts['OS & Software'] || 0 }
  ];
  

  const safeToFixed = (value, decimals = 2) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0.00';
    }
    return value.toFixed(decimals);
  };


  return (
    <div className={`${darkMode ? 'bg-light-bg' : 'dark:bg-dark-bg'} h-auto flex gap-1`}>
      <ToastContainer theme={darkMode ? 'light' : 'dark'} />
      <Navbar />
      <div className='h-[100vh] pt-[70px] px-2'>
        <div className='w-[14vw] h-[90vh] flex items-center flex-col justify-center gap-4'>
          <p className={`font-bold text-3xl pt-6 ${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>Cashier</p>
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleCategoryChange(button.label)}
              className={`flex items-center justify-center w-[100%] h-[40%] rounded-xl ${selectedCategory === button.label ? `bg-dark-activeLink ${darkMode ? 'text-light-primary' : 'text-dark-primary bg-'}` : `bg-transparent border-2 ${darkMode ? 'border-light-border text-light-textSecondary' : 'border-dark-border text-dark-textSecondary'}`} transition-all duration-200`}
            >
              <div className='w-[30%]'>
                {button.icon}
              </div>
              <div className={`w-70% flex flex-col font-semibold`}>
                <p className={`w-full text-sm ${darkMode ? 'text-light-primary' : 'dark:text-dark-primary'}`}>{button.label}</p>
                <p className={`w-full text-xs text-start ${darkMode ? 'text-light-textSecondary' : 'dark:text-dark-textSecondary'}`} >{button.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>  

      <div className='flex flex-col w-[80%] pt-[90px] p-5 gap-4 items-end'>
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          placeholderMessage={'Search product by name and product id'}
        />
        <div className='w-full grid grid-cols-4 gap-3 h-[78vh] overflow-auto'>
          {loading ? (
            loadingItems.map((_, index) => (
              <ProductLoading key={index} />
            ))
          ) : (
            filteredProducts.map((product) => {
              // Filter the units with 'in_stock' status and get the count
              const inStockUnits = product.units.filter(unit => unit.status === 'in_stock').length;

              return (
                <ProductCard
                  key={product._id}
                  product={{
                    image: `${baseURL}/${product.image}`,
                    name: product.name,
                    price: parseFloat(product.selling_price) || 0,
                    stock: inStockUnits, // Number of units in stock
                  }}
                  onClick={() => handleAddToCart(product)}
                />
              );
            })
          )}
        </div>
      </div>


      <div className={`flex items-center justify-between flex-col w-[50%] gap-1 pt-[100px] pb-4 px-4 ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container dark:text-dark-textPrimary'} rounded-xl`}>
        <div className={`overflow-y-auto h-[480px] w-full rounded-lg ${darkMode ? 'bg-light-conatiner' : 'dark:bg-dark-conatiner'}`}>
          <div style={{ width: '100%' }}> {/* Adjust this container width if needed */}
            <table className='border-collapse table-fixed h-auto w-full'>
              <thead>
              <tr className="border-b-2 border-textPrimary relative">
                  <th style={{ width: '45%' }} className={`sticky top-0 px-4 py-2 text-left ${darkMode ? 'bg-light-conatiner' : 'dark:bg-dark-conatiner'}`}>PRODUCT</th>
                  <th style={{ width: '20%' }} className={`sticky top-0 px-1 py-2 text-center ${darkMode ? 'bg-light-conatiner' : 'dark:bg-dark-conatiner'}`}>PRICE</th>
                  <th style={{ width: '15%' }} className={`sticky top-0 px-4 pr-2 text-center ${darkMode ? 'bg-light-conatiner' : 'dark:bg-dark-conatiner'}`}>QTY</th>
                  <th style={{ width: '20%' }} className={`sticky top-0 px-4 py-2 text-center ${darkMode ? 'bg-light-conatiner' : 'dark:bg-dark-conatiner'}`}>TOTAL</th>
                  <th style={{ width: '8%' }} className={`sticky top-0 px-4 py-2 text-center ${darkMode ? 'bg-light-conatiner' : 'dark:bg-dark-border'}`}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} className='border-b-2 border-textPrimary gap-2 text-xs'>
                    <td className='flex gap-2 items-center justify-center p-2'>
                      <img
                        src={`${baseURL}/${item.product.image}`}
                        className='w-16 h-16 object-cover rounded-lg'
                      />
                      <p className='w-full font-medium'>{item.product.name}</p>
                    </td>
                    <td className="text-center">₱ {((item.product.selling_price).toLocaleString()) || 0}</td>
                    <td className='text-center'>{item.quantity}</td>
                    <td className='tracking-wide text-center'>₱ {((item.quantity * item.product.selling_price).toLocaleString())}</td>
                    <td>
                      <IoCloseCircle 
                        className="text-lg cursor-pointer" 
                        onClick={() => handleRemoveFromCart(item.product._id)} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex flex-col gap-3 justify-center items-center pt-2 w-full'>
          <div className='flex flex-col gap-2 tracking-wider items-center justify-center'>
            <p className='text-gray-400'>Subtotal</p>
            <p className={`${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>₱ {calculateTotal().toLocaleString()}</p>
          </div>

          <button
            className={`w-[80%] py-3 rounded text-black font-semibold ${darkMode ? 'bg-light-primary text-dark-textPrimary' : 'dark:bg-dark-primary text-dark-textPrimary'}`}
            onClick={handlePayButton}
          >
            Proceed to Payment
          </button>

          <UnitSelectionModal
              isOpen={isUnitSelectionOpen}
              onClose={() => setIsUnitSelectionOpen(false)}
              product={selectedProduct}
              onSelectUnit={handleSelectUnit}
            />

          <ProceedToPayment
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            totalAmount={calculateTotal()}
            cart={cart}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default PosHome;
