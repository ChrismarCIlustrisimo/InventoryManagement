import React from 'react';

const CheckoutModal = ({ isOpen, onRequestClose, cartItem }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg relative z-10 text-black">
        <button className="text-blue-500 mb-4" onClick={onRequestClose}>
          &lt; Return to Cart
        </button>
        <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
        <form className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" className="border p-2 rounded" />
          <input type="text" placeholder="Last Name" className="border p-2 rounded" />
          <input type="text" placeholder="Street Address" className="col-span-2 border p-2 rounded" />
          <input type="text" placeholder="City" className="border p-2 rounded" />
          <input type="text" placeholder="Province" className="border p-2 rounded" />
          <input type="text" placeholder="Phone" className="col-span-2 border p-2 rounded" />
          <input type="email" placeholder="Email" className="col-span-2 border p-2 rounded" />
        </form>

        <h2 className="text-xl font-semibold mt-6 mb-4">Items To Reserve</h2>
        <div className="flex items-center mb-4">
          <img src={cartItem.image} alt={cartItem.name} className="w-24 h-24 object-cover mr-4" />
          <div>
            <p>{cartItem.name}</p>
            <p className="text-red-500 font-bold">₱{cartItem.price.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <p>Subtotal (1 item)</p>
          <p>₱{cartItem.price.toLocaleString()}</p>
        </div>

        <div className="flex justify-between text-red-500 font-bold text-xl mb-4">
          <p>Total</p>
          <p>₱{cartItem.price.toLocaleString()}</p>
        </div>

        <button className="bg-blue-500 text-white w-full py-2 rounded-lg">Confirm Reservation</button>
      </div>
    </div>
  );
};

export default CheckoutModal;
