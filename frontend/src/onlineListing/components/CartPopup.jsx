import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import CheckoutModal from './CheckoutModal';

const CartPopup = ({
    isOpen,
    onClose,
    cartItems = [],
    onIncreaseQuantity,
    onDecreaseQuantity,
    onRemoveItem,
    setCart,
}) => {
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    if (!isOpen) return null;

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.selling_price * (item.quantity || 1)), 0);

    const handleViewCart = () => {
        navigate('/iRIG/cart');
        onClose();
    };

    const handleRemoveItem = (index) => {
        onRemoveItem(index);
        toast.success(`${cartItems[index].name} has been removed from your cart!`);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>
            <div className="absolute md:right-20 mt-16 md:w-[550px] bg-white border rounded-md shadow-lg z-50">
                <div className="p-4 w-full">
                    {cartItems.length === 0 ? (
                        <div className="w-full h-[80%] flex items-center justify-center">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        <ul className="md:max-h-[200px] h-[50vh] overflow-y-auto">
                            {cartItems.map((item, index) => (
                                <li key={index} className="flex items-center py-4 border-b">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 mr-4 object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-orange-500 font-bold">
                                            ₱{(item.selling_price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <td className="border-b p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 border-2 border-gray-200 px-2">
                                            <button 
                                                className="p-1" 
                                                onClick={() => onDecreaseQuantity(index)} 
                                            >
                                                -
                                            </button>
                                            <span className="px-1 text-black">{item.quantity || 1}</span>
                                            <button 
                                                className="p-1" 
                                                onClick={() => onIncreaseQuantity(index)} 
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="text-red-500" 
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </li>
                            ))}
                        </ul>
                    )}
                    {cartItems.length > 0 && (
                        <div className="mt-4 flex justify-between items-center font-semibold text-lg">
                            <span>Total</span>
                            <span className="text-orange-500">₱{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    <div className="mt-4 flex justify-start items-center gap-4">
                        <button onClick={handleViewCart} className="px-4 py-2 bg-blue-500 text-white rounded">View Cart</button>
                        <button
                            onClick={() => {
                                if (cartItems.length > 0) {
                                    setIsCheckoutModalOpen(true); // Open the checkout modal
                                } else {
                                    onClose(); // Close the cart popup if there are no items
                                }
                            }}
                            className={`px-4 py-2 ${cartItems.length > 0 ? 'bg-orange-500' : 'bg-gray-500'} text-white rounded`}
                        >
                            {cartItems.length > 0 ? 'Checkout' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>

            {isCheckoutModalOpen && (
                <CheckoutModal
                    isOpen={isCheckoutModalOpen}
                    onRequestClose={() => setIsCheckoutModalOpen(false)}
                    items={cartItems}
                />
            )}
        </>
    );
};

export default CartPopup;
