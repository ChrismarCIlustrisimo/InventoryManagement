import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const CartPopup = ({ isOpen, onClose, cartItems = [] }) => {
      const navigate = useNavigate(); // Initialize navigate

      if (!isOpen) return null;

      // Calculate the total price by summing up the price of each item
      const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

      // Function to handle view cart navigation
      const handleViewCart = () => {
            navigate('/iRIG/view-cart');
            onClose(); // Close the popup after navigating
      };

      return (
            <div className="absolute md:right-20 mt-16 w-[450px] bg-white border rounded-md shadow-lg z-50">
                  <div className="p-4 w-full">
                        {cartItems.length === 0 ? (
                              <div className="w-full h-[80%] flex items-center justify-center">
                                    <p>Your cart is empty.</p>
                              </div>
                        ) : (
                              <ul className="max-h-[200px] overflow-y-auto">
                                    {cartItems.map((item, index) => (
                                          <li key={index} className="flex items-center py-4 border-b">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 mr-4 object-cover" />
                                                <div className="flex-1">
                                                      <p className="font-semibold">{item.name}</p>
                                                      <p className="text-orange-500 font-bold">₱{item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                      <div className="flex items-center border border-gray-300">
                                                            <button className="px-2 py-1">-</button>
                                                            <span className="px-3">1</span>
                                                            <button className="px-2 py-1">+</button>
                                                      </div>
                                                      <button className="text-red-500 text-sm">Remove</button>
                                                </div>
                                          </li>
                                    ))}
                              </ul>
                        )}
                        {cartItems.length > 0 && (
                              <div className="mt-4 flex justify-between items-center font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-orange-500">₱{totalPrice.toFixed(2)}</span>
                              </div>
                        )}
                        <div className="mt-4 flex justify-start items-center gap-4">
                              <button onClick={handleViewCart} className="px-4 py-2 bg-blue-500 text-white rounded">View Cart</button>
                              <button onClick={onClose} className="px-4 py-2 bg-orange-500 text-white rounded">Checkout</button>
                        </div>
                  </div>
            </div>
      );
};

export default CartPopup;
