import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

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

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.selling_price * (item.quantity || 1)), 0);

    const handleViewCart = () => {
        navigate('/iRIG/view-cart');
        onClose();
    };

    const handleQuantityChange = (index, value) => {
        const newQuantity = Math.max(1, parseInt(value) || 1);
        // Update quantity in context
        if (newQuantity > cartItems[index].quantity) {
            for (let i = cartItems[index].quantity; i < newQuantity; i++) {
                onIncreaseQuantity(index);
            }
        } else {
            for (let i = cartItems[index].quantity; i > newQuantity; i--) {
                onDecreaseQuantity(index);
            }
        }
    };

    const handleRemoveItem = (index) => {
        onRemoveItem(index);
        // Show toast notification
        toast.success(`${cartItems[index].name} has been removed from your cart!`);
    };

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
                                        <p className="text-orange-500 font-bold">
                                            ₱{(item.selling_price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <input
                                            type="number"
                                            value={item.quantity || 1}
                                            min="1"
                                            className="border border-gray-300 w-12 text-center"
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        />
                                        <button className="text-red-500 text-sm" onClick={() => handleRemoveItem(index)}>Remove</button>
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
