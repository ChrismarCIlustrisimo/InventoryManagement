import React from "react";

const Footer = () => {
      return (
            <footer className="bg-[#F1F5F9] py-8 text-black">
                  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">


                        <div className="flex flex-col items-center md:items-start justify-center md:order-1 md:flex-1">
                              <div className="text-center md:text-left">
                                    <p>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
                                    <p>Tel. No: (02) 83646039</p>
                                    <p>CP. No: 0923-444-1030</p>
                                    <p>irigcomputers@gmail.com</p>
                              </div>
                        </div>


                        <div className="flex flex-col items-center justify-center md:order-2 md:flex-1">
                              <h2 className="font-bold text-lg text-center">Customer Service</h2>
                              <ul className="space-y-1 mt-2 text-left">
                                    <li>
                                          <a href="/return-and-exchange" className="text-blue-500 hover:underline">
                                                Return and Exchange
                                          </a>
                                    </li>
                                    <li>
                                          <a href="/product-warranty" className="text-blue-500 hover:underline">
                                                Product Warranty
                                          </a>
                                    </li>
                                    <li>
                                          <a href="/faqs" className="text-blue-500 hover:underline">
                                                FAQs
                                          </a>
                                    </li>
                                    <li>
                                          <a href="/store-locations" className="text-blue-500 hover:underline">
                                                Store Locations
                                          </a>
                                    </li>
                              </ul>
                        </div>


                        <div className="flex flex-col items-center md:items-end md:order-3 md:flex-1">
                              <h2 className="font-bold text-lg">Follow Us</h2>
                              <a href="https://www.facebook.com" className="text-blue-500 hover:underline mt-2">
                                    <i className="fab fa-facebook-square text-2xl"></i>
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