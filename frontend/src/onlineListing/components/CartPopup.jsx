import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartPopup = ({
    isOpen,
    onClose,
    cartItems = [],
    onIncreaseQuantity,
    onDecreaseQuantity,
    onRemoveItem,
}) => {
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";

    if (!isOpen) return null;

    // Calculate total price based on selling_price and quantity
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.selling_price * (item.quantity || 1)), 0);

    const handleViewCart = () => {
        navigate('/iRIG/view-cart');
        onClose();
    };

    console.log(cartItems); // Log cart items to see their structure
    
    return (
        <>
            <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>
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
                                    <img
                                        src={`${baseURL}/${item.image}`}
                                        alt={item.name}
                                        className="w-16 h-16 mr-4 object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        {/* Calculate item total price based on quantity */}
                                        <p className="text-orange-500 font-bold">
                                            ₱{(item.selling_price * (item.quantity || 1)).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="flex items-center border border-gray-300">
                                            <button className="px-2 py-1" onClick={() => onDecreaseQuantity(index)}>-</button>
                                            <span className="px-3 text-black">{item.quantity || 1}</span>
                                            <button className="px-2 py-1" onClick={() => onIncreaseQuantity(index)}>+</button>
                                        </div>
                                        <button className="text-red-500 text-sm" onClick={() => onRemoveItem(index)}>Remove</button>
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
                        <button onClick={onClose} className={`px-4 py-2 ${cartItems.length > 0 ? 'bg-orange-500' : 'bg-gray-500'} text-white rounded`}>
                            {cartItems.length > 0 ? 'Checkout' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPopup;
