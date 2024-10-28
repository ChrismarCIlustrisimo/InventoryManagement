import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const CartPage = () => {
  const [quantity, setQuantity] = useState(1); // Default quantity is set to 1
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

  const demoProducts = [
    {
      id: 1,
      name: 'Logitech G502 HERO Gaming Mouse',
      price: 2995,
      image: '/path-to-image/mouse.jpg',
    },
    {
      id: 2,
      name: 'Razer BlackWidow V3 Mechanical Keyboard',
      price: 6495,
      image: '/path-to-image/keyboard.jpg',
    },
    {
      id: 3,
      name: 'MSI Optix MAG271CQR Gaming Monitor',
      price: 23995,
      image: '/path-to-image/monitor.jpg',
    },
  ];

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handlePlus = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleCheckout = () => {
    setIsPopupOpen(true); // Show the popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow w-full flex flex-col overflow-y-auto">
        <div className='w-full text-black flex flex-col items-start justify-start pt-[180px] px-12'>
          <h1 className='text-2xl font-bold text-center mb-6'>My Cart</h1>

          <div className='flex flex-col lg:flex-row gap-4 w-full items-start justify-center pb-12'>
            <div className='border border-gray-200 rounded-md w-full lg:w-2/3'>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="border-b-2 p-4 text-left">Product</th>
                      <th className="border-b-2 p-4 text-center">Quantity</th>
                      <th className="border-b-2 p-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b p-4 flex items-center">
                        <img
                          src="/path-to-image/laptop.jpg"
                          alt="Acer Predator Helios"
                          className="w-24 h-24 object-cover mr-4"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold">
                            Acer Predator Helios 16 PH16-72-96HB Gaming Laptop (Abyssal Black)
                          </h3>
                          <p className="text-red-500 font-bold">₱125,995.00</p>
                        </div>
                      </td>
                      <td className="border-b p-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex items-center border border-gray-300">
                            <button className="px-2 py-1" onClick={handleMinus}>-</button>
                            <input
                              type="number"
                              className="w-12 text-center border-l border-r border-gray-300 px-2 py-1 outline-none"
                              value={quantity}
                              min="1"
                              readOnly
                            />
                            <button className="px-2 py-1" onClick={handlePlus}>+</button>
                          </div>
                          <button className="text-red-500 text-sm">Remove</button>
                        </div>
                      </td>
                      <td className="border-b p-4 text-right text-lg font-bold">
                        ₱{125995.00 * quantity}.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='border border-gray-200 rounded-md w-full lg:w-1/3'>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
                <div className="flex justify-between mb-2">
                  <p>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</p>
                  <p>₱{125995.00 * quantity}.00</p>
                </div>
                <div className="flex justify-between text-red-500 font-bold text-xl mb-4">
                  <p>Total</p>
                  <p>₱{125995.00 * quantity}.00</p>
                </div>
                <button className="bg-blue-500 text-white w-full py-2 rounded-lg" onClick={handleCheckout}>
                  Checkout
                </button>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  E-Receipt will be printed after checkout.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full text-black flex flex-col items-start justify-start pt-[50px] px-12 py-6'>
          <h1 className='text-2xl font-bold text-center mb-6'>Customers Who Bought This Item Also Bought</h1>
          <div className="flex flex-wrap justify-center gap-6">
            {demoProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Popup for Checkout Confirmation */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
              <h2 className="text-xl font-semibold mb-4">Checkout Confirmation</h2>
              <p>Please confirm your reservation for:</p>
              <div className="flex items-center mb-4">
                <img src="/path-to-image/laptop.jpg" alt="Acer Predator Helios" className="w-24 h-24 object-cover mr-4" />
                <div>
                  <p>Acer Predator Helios 16 PH16-72-96HB Gaming Laptop</p>
                  <p className="text-red-500 font-bold">₱{125995.00 * quantity}.00</p>
                </div>
              </div>
              <button className="bg-blue-500 text-white w-full py-2 rounded-lg" onClick={handleClosePopup}>
                Confirm Reservation
              </button>
              <button className="text-red-500 w-full mt-2" onClick={handleClosePopup}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
