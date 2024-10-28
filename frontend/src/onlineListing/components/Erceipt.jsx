import React from 'react';
import { useLocation } from 'react-router-dom';

const Erceipt = () => {
  const location = useLocation();
  const { item, total } = location.state || {};

  if (!item) return <p className="text-center p-4">No data available</p>;

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 md:pt-4">
      <div className="max-w-xl w-full mx-auto bg-white p-6 rounded-lg shadow-lg text-gray-800">
        <header className="text-center mb-6">
          <h2 className="text-lg font-semibold">Order Number</h2>
          <p className="text-5xl md:text-7xl font-bold">SO-576</p>
        </header>

        <section className="mb-6">
          <h3 className="text-xl font-semibold text-center">Claim Your Reserved Items!</h3>
          <p className="text-md text-center">Please present this receipt at our store to claim your reserved tech products.</p>
          <div className="flex flex-row justify-between mt-2">
            <span className="text-sm">RESERVATION DATE</span>
            <span className="font-semibold">{item.name}</span>
          </div>
          <div className="flex flex-row justify-between mt-2">
            <span className="text-sm">EXPIRY DATE</span>
            <span className="font-semibold">{item.quantity}</span>
          </div>
        </section>

        <section className="mb-6 border-b">
          <h3 className="text-lg font-semibold mb-2">Items Reserved</h3>
          <div className="flex flex-row justify-between">
            <span className="text-sm">PRODUCT</span>
            <span className="font-semibold">{item.name}</span>
          </div>
          <div className="flex flex-row justify-between mt-2">
            <span className="text-sm">QUANTITY</span>
            <span className="font-semibold">{item.quantity}</span>
          </div>
          <div className="flex flex-row justify-between mt-2 pt-2">
            <span className="text-sm">TOTAL PRICE</span>
            <span className="font-bold text-lg">₱{total.toLocaleString()}</span>
          </div>
        </section>

        <section className="mb-6 border-b py-2">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Present this receipt at our store.</li>
            <li>Bring a valid ID for verification.</li>
            <li>Proceed to payment.</li>
            <li>Ensure you collect your items before 10/21/2024.</li>
          </ol>
        </section>

        <section className="mb-6 border-b">
          <h3 className="text-lg font-semibold mb-2">Store Location</h3>
          <p className="text-sm">23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Need Assistance?</h3>
          <p className="text-sm">Call us at: 8-364-6039 / 0923-444-1030</p>
          <p className="text-sm">Email: irigcomputers@gmail.com</p>
        </section>
        <p className="text-md mb-4 flex flex-col w-full border-t pt-4 text-center">
          <span className="font-semibold text-2xl">Thank you for your reservation!</span>
          <span>We look forward to serving your tech needs.</span>
        </p>
      </div>

      <footer className="text-center flex flex-col gap-4 w-full items-center justify-center py-4">
        <div className="w-[39%] min-md:w-[80%] flex flex-col gap-2">
          <button className="border border-blue-500 text-blue-500 bg-transparent w-full py-2 rounded-lg transform transition-transform duration-200 hover:scale-105">
            Download PDF Erceipt
          </button>
          <button className="bg-blue-500 text-white w-full py-2 rounded-lg transform transition-transform duration-200 hover:scale-105">
            Done
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Erceipt;
