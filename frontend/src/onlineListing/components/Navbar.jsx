import React, { useState } from 'react';
import iRig1 from '../assets/iRig1.png';
import Searchbar from './Searchbar';
import { MdOutlineShoppingCart } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import Badge from '@mui/material/Badge';
import { FaAngleDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import CartPopup from './CartPopup';

const categories = [
      { name: "Components", path: "/iRIG/components" },
      { name: "Peripherals", path: "/iRIG/peripherals" },
      { name: "Accessories", path: "/iRIG/accessories" },
      { name: "PC Furniture", path: "/iRIG/pc-furniture" },
      { name: "OS & Software", path: "/iRIG/os-software" },
      { name: "Laptops", path: "/iRIG/laptops" },
      { name: "Desktops", path: "/iRIG/desktops" },
];

const demoCartItems = [
      { name: 'Acer Predator Helios 16', price: 125995.00 },
      { name: 'MSI Thin 15', price: 55495.00 },
      { name: 'Dell G15 Gaming Laptop', price: 79995.00 },
      { name: 'ASUS ROG Zephyrus', price: 105995.00 },
];

const Navbar = ({ query, onQueryChange }) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [isCartOpen, setIsCartOpen] = useState(false);
      const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);

      const toggleMenu = () => {
            setIsMenuOpen(prev => !prev);
      };

      const toggleCart = () => {
            setIsCartOpen(prev => !prev);
      };

      const toggleCategoryPopup = () => {
            setIsCategoryPopupOpen(prev => !prev);
      };

      return (
            <header className="text-black fixed left-0 right-0 top-0 flex flex-col items-center bg-light-primary z-50">
                  <div className="md:w-[80%] w-full flex items-center justify-around py-2 md:py-4 md:gap-2 gap-12">
                        <div className='flex gap-2 h-full items-center justify-center'>
                              <GiHamburgerMenu className="text-5xl cursor-pointer md:hidden text-white" onClick={toggleMenu} />
                              <img src={iRig1} alt="Website Logo" className="h-8 w-auto max-w-[150px] sm:max-w-[100px] md:max-w-full md:h-12" />
                        </div>
                        <Searchbar
                              query={query}
                              onQueryChange={onQueryChange}
                              placeholderMessage="Search..."
                              className=" w-[90%] md:w-[600px] hidden md:block"
                        />
                        <div className="flex gap-2 items-center text-white text-xl font-medium">
                              <Badge
                                    badgeContent={demoCartItems.length}
                                    sx={{
                                          '& .MuiBadge-badge': {
                                                backgroundColor: '#E8B931',
                                                color: 'white',
                                          }
                                    }}
                              >
                                    <MdOutlineShoppingCart className="text-2xl cursor-pointer" onClick={toggleCart} />
                              </Badge>
                              <p className="hidden md:block cursor-pointer" onClick={toggleCart}>Cart</p>
                        </div>
                  </div>
                  <nav className={`bg-white w-full py-2 flex justify-center shadow-lg ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                        <div className="flex flex-col md:flex-row justify-center gap-24 items-center w-full">
                              <Link to={"/iRIG/"} className="text-dark-TEXT hover:text-gray-400 transition py-2">Home</Link>
                              <div className="relative">
                                    <button className="text-dark-TEXT hover:text-gray-400 transition py-2" onClick={toggleCategoryPopup}>
                                          Products <FaAngleDown className='ml-2 inline' />
                                    </button>
                                    {isCategoryPopupOpen && (
                                          <div className="absolute z-50 bg-white shadow-md rounded-md mt-2 p-2 w-64">
                                                {categories.map((category) => (
                                                      <Link
                                                            key={category.name}
                                                            to={category.path}
                                                            className="block py-1 hover:bg-gray-200 transition"
                                                      >
                                                            {category.name}
                                                      </Link>
                                                ))}
                                          </div>
                                    )}
                              </div>
                              <Link to={"/iRIG/our-store"} className="text-dark-TEXT hover:text-gray-400 transition py-2">Our Store</Link>
                              <Link to={"/iRIG/contact-us"} className="text-dark-TEXT hover:text-gray-400 transition py-2">Contact Us</Link>
                        </div>
                  </nav>

                  {/* Cart Popup */}
                  <CartPopup isOpen={isCartOpen} onClose={toggleCart} cartItems={demoCartItems} />
            </header>
      );
};

export default Navbar;
