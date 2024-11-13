import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';
import { useProductContext } from '../page'; // Adjust the import path as needed
import { ToastContainer } from 'react-toastify';

const CartPage = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeItem } = useProductContext();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const baseURL = "http://localhost:5555";

    console.log("CART", cart);

    const handleCheckout = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const totalPrice = cart.reduce((total, item) => {
        const price = Number(item.selling_price) || 0; 
        const quantity = Number(item.quantity) || 1; // Default to 1 if quantity is NaN
        return total + price * quantity; 
    }, 0);
    
    

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow w-full flex flex-col overflow-y-auto">
                <div className='w-full text-black flex flex-col items-start justify-start pt-[180px] px-12'>
                    <h1 className='text-4xl font-bold text-center mb-6'>My Cart</h1>
                    <div className='flex flex-col lg:flex-row gap-4 w-full items-start justify-center pb-12'>
                        <div className='border border-gray-200 rounded-md w-full lg:w-2/3'>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div>
                                {/* Table view for larger screens */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr>
                                                <th className="border-b-2 p-4 text-left">Product</th>
                                                <th className="border-b-2 p-4 text-center">Quantity</th>
                                                <th className="border-b-2 p-4 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td className="border-b p-4 flex items-center">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-24 h-24 object-cover mr-4"
                                                        />
                                                        <div className="flex flex-col">
                                                            <h3 className="text-lg font-semibold">{item.name}</h3>
                                                            <p className="text-red-500 font-bold">₱{(Number(item.selling_price) || 0).toLocaleString()}</p>
                                                        </div>
                                                    </td>
                                                    <td className="border-b p-4 text-center">
                                                        <div className="flex items-center justify-center gap-2 border-2 border-gray-200">
                                                            <button className="px-2 py-1" onClick={() => decreaseQuantity(index)}>-</button>
                                                            <span className="px-3 text-black">{item.quantity || 1}</span>
                                                            <button className="px-2 py-1" onClick={() => increaseQuantity(index)}>+</button>
                                                        </div>
                                                        <button className="text-red-500" onClick={() => removeItem(index)}>Remove</button>
                                                    </td>
                                                    <td className="border-b p-4 text-right text-lg font-bold">
                                                        ₱{((Number(item.selling_price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Div-based view for mobile screens */}
                                <div className="block md:hidden">
                                    {cart.map((item, index) => (
                                        <div key={item._id} className="border-b p-4 flex flex-col space-y-2">
                                            <div className="flex items-center">
                                                <img
                                                    src={`${baseURL}/${item.image}`}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover mr-4"
                                                />
                                                <div className="flex flex-col">
                                                    <h3 className="text-sm font-semibold">{item.name}</h3>
                                                    <p className="text-red-500 font-bold text-sm">
                                                        ₱{(Number(item.selling_price) || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">Quantity:</span>
                                                <div className="flex items-center gap-2 border-2 border-gray-200">
                                                    <button className="px-2 py-1" onClick={() => decreaseQuantity(index)}>-</button>
                                                    <span className="px-3 text-black">{item.quantity || 1}</span>
                                                    <button className="px-2 py-1" onClick={() => increaseQuantity(index)}>+</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">Total:</span>
                                                <p className="text-lg font-bold text-right">
                                                    ₱{((Number(item.selling_price) || 0) * (Number(item.quantity) || 1)).toLocaleString()}
                                                </p>
                                            </div>
                                            <button className="text-red-500 text-sm" onClick={() => removeItem(index)}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            </div>
                        </div>

                        <div className='border border-gray-200 rounded-md w-full lg:w-1/3'>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
                                <div className="flex justify-between mb-2">
                                <p>Subtotal ({cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)} item{cart.length > 1 ? 's' : ''})</p>
                                <p>₱{totalPrice.toLocaleString() || 0}</p>
                                </div>
                                <div className="flex justify-between text-red-500 font-bold text-xl mb-4">
                                    <p>Total</p>
                                    <p>₱{totalPrice.toLocaleString() || 0}</p>
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
s
                {isPopupOpen && <CheckoutModal isOpen={isPopupOpen} onRequestClose={handleClosePopup} items={cart} />}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
