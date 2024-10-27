import React, { useState } from 'react';
import WebsiteLogo from '../../assets/WebsiteLogo.png';
import Searchbar from './Searchbar';
import { MdOutlineShoppingCart } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi"; // Import hamburger icon
import Badge from '@mui/material/Badge';
import { FaAngleDown } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Navbar = ({ query, onQueryChange, cartItemCount }) => {
      const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

      const toggleMenu = () => {
            setIsMenuOpen(prev => !prev);
      };

      return (
            <header className="text-black fixed left-0 right-0 top-0 flex flex-col items-center bg-light-primary z-50">
                  <div className="w-[70%] flex items-center justify-between py-4">
                        <img src="/iRig1.png" alt="Website Logo" className=" max-w-full" />
                        <Searchbar
                              query={query}
                              onQueryChange={onQueryChange}
                              placeholderMessage="Search..."
                        />
                        <div className="flex gap-2 items-center text-white text-xl font-medium">
                              <Badge
                                    badgeContent={cartItemCount}
                                    sx={{
                                          '& .MuiBadge-badge': {
                                                backgroundColor: '#C85232',
                                                color: 'white',
                                          }
                                    }}
                              >
                                    <MdOutlineShoppingCart className="text-2xl" />
                              </Badge>
                              <p>Cart</p>
                        </div>
                        <GiHamburgerMenu className="text-6xl cursor-pointer md:hidden" onClick={toggleMenu} /> {/* Hamburger icon */}
                  </div>
                  <nav className={`bg-white w-full py-2 flex justify-center ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                        <div className="flex flex-col md:flex-row justify-center gap-24 items-center w-full">
                              <Link to={"/ecommerce/irigpc/"} className="text-dark-TEXT hover:text-gray-400 transition py-2">Home</Link>
                              <Link to={"/ecommerce/irigpc/products"} className="text-dark-TEXT hover:text-gray-400 transition py-2">Products <FaAngleDown className='ml-2 inline' /></Link>
                              <Link to={"/ecommerce/irigpc/our-store"} className="text-dark-TEXT hover:text-gray-400 transition py-2">Our Store</Link>
                              <Link to={"/ecommerce/irigpc/contact-us"} className="text-dark-TEXT hover:text-gray-400 transition py-2">Contact Us</Link>
                        </div>
                  </nav>
            </header>
      );
}

export default Navbar;
