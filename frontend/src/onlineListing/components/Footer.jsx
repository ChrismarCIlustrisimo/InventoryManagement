import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import WebsiteLogo from '../../assets/WebsiteLogo.png'; // Make sure the path is correct

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand Section */}
        <div>
          {/* Responsive image for logo */}
          <img src={WebsiteLogo} alt="iRIG Logo" className="w-24 md:w-32 h-auto mb-4 mx-auto md:mx-0" />
          
          <p className="font-semibold text-sm md:text-base lg:text-lg">Empowering Innovation, One Device at a Time</p>
          <p className="mt-4 text-sm md:text-base">
            We are dedicated to offering the latest in computer and tech products,
            combined with expert support to ensure you get the most out of your technology.
            Our commitment is to deliver quality, reliability, and innovation in every product
            we offer and every interaction we have.
          </p>

          {/* Social Links */}
          <div className="mt-4 flex justify-center md:justify-start space-x-4">
            <a href="https://www.facebook.com" className="text-gray-600 text-2xl">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com" className="text-gray-600 text-2xl">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-sm md:text-base lg:text-lg">FAQ</h3>
          <p className="font-semibold text-sm md:text-base">1. What types of products does iRIG Computers offer?</p>
          <p className="mt-2 text-sm md:text-base">
            We offer a wide range of computer and tech products including laptops, desktops, peripherals, accessories, and software. Whether you're a gamer, professional, or casual user, we have the right solution for your needs.
          </p>
          <p className="font-semibold mt-4 text-sm md:text-base">2. Can I return a product if I’m not satisfied?</p>
          <p className="mt-2 text-sm md:text-base">
            Yes, we have a 30-day return policy. If you're not satisfied with your purchase, you can return it within 30 days for a full refund or exchange, provided the product is in its original condition and packaging.
          </p>
        </div>

        {/* Customer Service Section */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-sm md:text-base lg:text-lg">Customer Service</h3>
          <p className="font-semibold text-sm md:text-base">Need Assistance? We're Here to Help!</p>
          <ul className="mt-4 text-sm md:text-base">
            <li>
              <span className="font-semibold">Email Support: </span>
              For general inquiries or support, email us at support@irigcomputers.com
            </li>
            <li className="mt-2">
              <span className="font-semibold">Phone Support: </span>
              Call us at 1-800-123-4567. Our team is available Monday to Friday, from 9 AM to 6 PM (EST).
            </li>
            <li className="mt-2">
              <span className="font-semibold">Visit Us: </span>
              Find our nearest store location <a href="/" className="underline">here</a>.
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 text-center border-t border-gray-300 pt-4 text-sm md:text-base">
        <p>Copyright &copy; 2024 iRIG Computers. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
