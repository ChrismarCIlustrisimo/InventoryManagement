import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import LOGO from '../assets/iRig2.png'
import { toast, ToastContainer } from 'react-toastify';



const Erceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef(); // Reference to the receipt container
  const {
    transaction,
    transaction_Id,
    total,
    totalVat,
    customer,
    email,
    phone,
    fullAddress,
  } = location.state || {};

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.toLocaleString('en-US', { month: 'short' }); // e.g., "Nov"
    const day = d.getDate(); // Day of the month
    const year = d.getFullYear(); // Full year
    const hours = d.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = d.getMinutes().toString().padStart(2, '0'); // Ensure two digits
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM'; // AM/PM suffix
  
    // Add a comma after the day
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  };
  
  // Function to add one day to a date
  const addOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };
  
  



  const downloadPDF = () => {
    html2canvas(receiptRef.current, { useCORS: true, scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        // Get the dimensions of the canvas
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calculate the aspect ratio and adjust to fit the PDF page
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const aspectRatio = imgWidth / imgHeight;

        // Set width and height based on aspect ratio
        let pdfWidth, pdfHeight;

        if (aspectRatio > 1) {
            // Landscape orientation
            pdfWidth = pageWidth - 400; // 200px padding on left and right
            pdfHeight = pdfWidth / aspectRatio;
        } else {
            // Portrait orientation
            pdfHeight = pageHeight - 0; // No adjustment needed for height
            pdfWidth = pdfHeight * aspectRatio;
        }

        // Set x position for padding
        const xPosition = 32; // 200px padding on the left

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', xPosition, 0, pdfWidth, pdfHeight);
        
        // Save the PDF
        pdf.save('erceipt.pdf');
    });
};


  const handleDone = () => {
    navigate('/iRIG/'); // Navigate to /iRIG/
  };


  useEffect(() => {
    if (transaction) {
      toast.success('Reservation created successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [transaction]);

  if (!transaction) return <p>Loading...</p>;
  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 md:pt-4">
      <div ref={receiptRef} className="max-w-xl w-full mx-auto bg-white p-6 rounded-lg shadow-lg text-gray-800">
        <div className='w-full flex items-center justify-center py-4'>
          <img src={LOGO} className="max-w-[120px] w-full h-auto" alt="Logo" />
        </div>
        <header className="text-center mb-6">
          <h2 className="text-xl font-semibold">Order Number</h2> 
          <p className="text-6xl font-bold">{transaction_Id || 'N/A'}</p> 
        </header>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-center">Claim Your Reserved Items!</h3>
          <p className="text-base text-center py-6">Please present this receipt at our store to claim your reserved tech products.</p> 
          <div className="flex flex-row justify-between mt-2">
            <span className="text-sm">RESERVATION DATE</span>
            <span className="font-semibold text-base">{formatDate(transaction.transaction_date)}</span> 
          </div>
          <div className="flex flex-row justify-between mt-2">
            <span className="text-sm">EXPIRY DATE</span>
            <span className="font-semibold text-base">{formatDate(addOneDay(transaction.transaction_date))}</span>
          </div>
        </section>

        <section className="mb-6 border-b py-2">
          <h3 className="text-lg font-semibold mb-2">Items Reserved</h3>
          {transaction.products.map((item, index) => (
            <div key={index} className='border-b '>
              <div className={`flex flex-row justify-between mt-2 pt-2`}>
                <span className="text-sm">PRODUCT</span>
                <span className={`font-semibold text-sm text-right w-[60%] ${item.product_name.length > 15 ? 'h-15' : 'h-10'}`}>{item.product_name || 'N/A'}</span>
              </div>
              <div className="flex flex-row justify-between mt-2 pt-2">
                <span className="text-sm">SERIAL NUMBERS</span>
                <span className="font-semibold text-sm text-right w-[60%]">
                  {item.serial_number?.join(', ') || 'N/A'}
                </span>
              </div>
              <div className="flex flex-row justify-between mt-2 pt-2">
                <span className="text-sm">QUANTITY</span>
                <span className="font-semibold text-base">{item.quantity}</span> 
              </div>
            </div>
          ))}
          <div className="flex flex-row justify-between mt-2 pt-2"> 
            <span className="text-sm">TOTAL PRICE</span>
            <span className="font-bold text-xl">₱ {(total + totalVat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> 
          </div>
        </section>

        <section className="mb-6">
          <div className="flex flex-row justify-between mt-2 pt-2">
            <span className="text-sm">NAME:</span>
            <span className="text-sm">{customer || 'N/A'}</span> 
          </div>
          <div className="flex flex-row justify-between mt-2 pt-2">
            <span className="text-sm">EMAIL:</span>
            <span className=" text-sm">{email || 'N/A'}</span> 
          </div>
          <div className="flex flex-row justify-between mt-2 pt-2">
            <span className="text-sm">ADDRESS:</span>
            <span className="text-sm">{fullAddress || 'N/A'}</span> 
          </div>
          <div className="flex flex-row justify-between mt-2 pt-2">
            <span className="text-sm">CONTACT NO.:</span>
            <span className="text-sm">{phone || 'N/A'}</span> 
          </div>
        </section>

        <section className="mb-6 border-b py-4">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal pl-5 text-base space-y-2"> 
            <li>Present this receipt at our store.</li>
            <li>Bring one valid ID for verification.</li>
            <li>Proceed to payment.</li>
            <li>Ensure you collect your items before the expiry date.</li>
          </ol>
        </section>

        <section className="mb-6 border-b py-2">
          <h3 className="text-lg font-semibold mb-2">Store Location</h3>
          <p className="text-base">23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p> 
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Need Assistance?</h3>
          <p className="text-base">Call us at: 8-364-6039 / 0923-444-1030</p> 
          <p className="text-base">Email: irigcomputers@gmail.com</p> 
        </section>
        <p className="text-base mb-4 flex flex-col w-full border-t pt-4 text-center"> 
          <span className="font-semibold text-lg">Thank you for your reservation!</span>
          <span>We look forward to serving your tech needs.</span>
        </p>
      </div>


      <footer className="text-center flex flex-col gap-4 w-full items-center justify-center py-4">
        <div className="w-[39%] min-md:w-[80%] flex flex-col gap-2">
          <button
            onClick={downloadPDF}
            className="border border-b  border-blue-500 text-blue-500 bg-transparent w-full py-2 rounded-lg transform transition-transform duration-200 hover:scale-105"
          >
            Download E-Receipt
          </button>
          <button
            onClick={handleDone}
            className="bg-blue-500 text-white w-full py-2 rounded-lg transform transition-transform duration-200 hover:scale-105"
          >
            Done
          </button>
        </div>
      </footer>
      <ToastContainer />

    </div>
  );
};

export default Erceipt;
