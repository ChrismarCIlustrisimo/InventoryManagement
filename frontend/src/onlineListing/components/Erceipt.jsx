import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Erceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef(); // Reference to the receipt container
  const { transaction, total, transaction_Id } = location.state || {};
  const baseURL = "http://localhost:5555";

  const formatDate = (dateString) => {
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };

  const downloadPDF = () => {
    html2canvas(receiptRef.current, { useCORS: true, scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 150; // Reduced width
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add the first page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('erceipt.pdf');
    });
};

  const handleDone = () => {
    navigate('/iRIG/'); // Navigate to /iRIG/
  };

  if (!transaction) return <p>Loading...</p>;

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 md:pt-4">
      <div ref={receiptRef} className="max-w-xl w-full mx-auto bg-white p-6 rounded-lg shadow-lg text-gray-800">
        <header className="text-center mb-6">
          <h2 className="text-base font-semibold">Order Number</h2>
          <p className="text-3xl md:text-5xl font-bold">{transaction_Id || 'N/A'}</p>
        </header>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-center">Claim Your Reserved Items!</h3>
          <p className="text-sm text-center">Please present this receipt at our store to claim your reserved tech products.</p>
          <div className="flex flex-row justify-between mt-2">
            <span className="text-xs">RESERVATION DATE</span>
            <span className="font-semibold text-sm">{formatDate(transaction.transaction_date)}</span>
          </div>
          <div className="flex flex-row justify-between mt-2">
            <span className="text-xs">EXPIRY DATE</span>
            <span className="font-semibold text-sm">{formatDate(transaction.transaction_date)}</span>
          </div>
        </section>

        <section className="mb-6 border-b">
          <h3 className="text-lg font-semibold mb-2">Items Reserved</h3>
          {transaction.products.map((item, index) => (
            <div key={index}>
              <div className={`flex flex-row justify-between mt-2 pt-2`}>
                <span className="text-xs">PRODUCT</span>
                <span className={`font-semibold text-xs text-right w-[60%] ${item.product_name.length > 15 ? 'h-15' : 'h-10'}`}>{item.product_name || 'N/A'}</span>
              </div>
              <div className="flex flex-row justify-between mt-2 pt-2">
                <span className="text-xs">QUANTITY</span>
                <span className="font-semibold text-sm">{item.quantity}</span>
              </div>
            </div>
          ))}
          <div className="flex flex-row justify-between mt-2 pt-2">
            <span className="text-xs">TOTAL PRICE</span>
            <span className="font-bold text-lg">₱{total.toLocaleString()}</span>
          </div>
        </section>

        <section className="mb-6 border-b py-2">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal pl-5 text-xs space-y-2">
            <li>Present this receipt at our store.</li>
            <li>Bring a valid ID for verification.</li>
            <li>Proceed to payment.</li>
            <li>Ensure you collect your items before the expiry date.</li>
          </ol>
        </section>

        <section className="mb-6 border-b">
          <h3 className="text-lg font-semibold mb-2">Store Location</h3>
          <p className="text-xs">23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Need Assistance?</h3>
          <p className="text-xs">Call us at: 8-364-6039 / 0923-444-1030</p>
          <p className="text-xs">Email: irigcomputers@gmail.com</p>
        </section>
        <p className="text-sm mb-4 flex flex-col w-full border-t pt-4 text-center">
          <span className="font-semibold text-lg">Thank you for your reservation!</span>
          <span>We look forward to serving your tech needs.</span>
        </p>
      </div>

      <footer className="text-center flex flex-col gap-4 w-full items-center justify-center py-4">
        <div className="w-[39%] min-md:w-[80%] flex flex-col gap-2">
          <button
            onClick={downloadPDF}
            className="border border-blue-500 text-blue-500 bg-transparent w-full py-2 rounded-lg transform transition-transform duration-200 hover:scale-105"
          >
            Download PDF Erceipt
          </button>
          <button
            onClick={handleDone}
            className="bg-blue-500 text-white w-full py-2 rounded-lg transform transition-transform duration-200 hover:scale-105"
          >
            Done
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Erceipt;
