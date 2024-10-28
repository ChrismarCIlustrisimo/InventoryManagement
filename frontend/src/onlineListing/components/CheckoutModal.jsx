import React from 'react';
import { useNavigate } from 'react-router-dom';
import iRig1 from '../assets/iRig1.png';

const CheckoutModal = ({ isOpen, onRequestClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const item = {
    image: iRig1,
    name: 'ASDSADAS',
    price: 3000,
    quantity: 2,
  };

  const total = item.price * item.quantity;

  const handleConfirmReservation = () => {
    navigate('/Ereceipt', { state: { item, total } });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-[50%] relative z-10 text-black">
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
        <table className="w-full text-left border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border-b">Product</th>
              <th className="p-2 border-b">Price</th>
              <th className="p-2 border-b">Quantity</th>
              <th className="p-2 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-b flex gap-2 items-center justify-start">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
                <p className="p-2 border-b">{item.name}</p>
              </td>
              <td className="p-2 border-b text-red-500 font-bold text-center">₱{item.price.toLocaleString()}</td>
              <td className="p-2 border-b text-center">{item.quantity}</td>
              <td className="p-2 border-b text-red-500 font-bold text-center">₱{total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between mb-2">
          <p>Subtotal (1 item)</p>
          <p>₱{item.price.toLocaleString()}</p>
        </div>

        <div className="flex justify-between text-red-500 font-bold text-xl mb-4">
          <p>Total</p>
          <p>₱{total.toLocaleString()}</p>
        </div>

        <button
          className="bg-blue-500 text-white w-full py-2 rounded-lg"
          onClick={handleConfirmReservation}
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
