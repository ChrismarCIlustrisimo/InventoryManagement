import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import LOGO from '../assets/iRig2.png'




const Footer = () => {
      return (
            <footer className="bg-[#F1F5F9] py-8 text-black">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">


                  <div className="flex flex-col gap-12 md:gap-24 items-center md:flex-row md:items-start justify-center md:order-1 md:flex-1">
                        <img src={LOGO} alt="Logo" />

                        <div className="text-center md:text-left">
                              <p>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
                              <p>Tel. No: (02) 83646039</p>
                              <p>CP. No: 0923-444-1030</p>
                              <p>irigcomputers@gmail.com</p>
                        </div>
                  </div>




                        <div className="flex flex-col md:items-end items-center justify-center md:order-2 md:flex-1">
                              <h2 className="font-bold text-lg text-end">Customer Service</h2>
                              <ul className="space-y-1 mt-2 text-left">
                                    <li>
                                          <Link to={"/iRIG/return-policy/"} className="text-blue-500 hover:underline">
                                                Return and Exchange
                                          </Link>
                                    </li>
                                    <li>
                                          <Link to={"/iRIG/warranty/"} className="text-blue-500 hover:underline">
                                                Product Warranty
                                          </Link>
                                    </li>
                                    <li>
                                          <Link to={"/iRIG/faq/"} className="text-blue-500 hover:underline">
                                                FAQs
                                          </Link>
                                    </li>
                                    <li>
                                          <Link to={"/iRIG/our-store/"} className="text-blue-500 hover:underline">
                                                Store Locations
                                          </Link>
                                    </li>
                              </ul>
                        </div>



                        <div className="flex flex-col items-center md:items-end md:order-3 md:flex-1">
                                <h2 className="font-bold text-lg">Follow Us</h2>
                              <a
                                    href="https://www.facebook.com/@irigcomputers"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline mt-2"
                              >
                                    <FaFacebook className="text-5xl text-blue-500" />
                              </a>
                        </div>

                  </div>


                  <br />
                  <hr />

                  <div className="max-w-6xl mx-auto mt-8 text-center text-sm">
                        <p>© 2024 iRIG Computers. All Rights Reserved.</p>
                  </div>
            </footer>
      );
};


export default Footer;


