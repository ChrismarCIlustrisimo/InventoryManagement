import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from './ProfileInfo'
import SearchBar from './SearchBar';
import loginLogo from '../assets/iControlLoginLogo.png'; 

const Navbar = () => {
  return (
    <div className='bg-[#17262e] text-white flex items-center justify-between px-6 py-1 drop-shadow fixed top-0 left-0 right-0 z-10'>
      <img src={loginLogo} alt="Login" className='w-[10%] my-2 ml-8' />
      <SearchBar />
      <ProfileInfo />
    </div>
  );
};

export default Navbar;
