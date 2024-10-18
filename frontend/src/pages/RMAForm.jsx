import React, { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';
import ReactToPrint from 'react-to-print';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RMAPDF from './RMAPDF';

const RMAForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useAdminTheme();
    const { rma } = location.state || {}; // Access RMA data from location.state
    const componentRef = useRef(); // Ref for the component to print

    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    
    
    
    return (
        <div className="w-full h-full px-6 py-2 bg-white shadow-md mt-4">
            <div className={`flex justify-between items-center mb-6 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                <button className="text-sm hover:underline" onClick={handleBackClick}>
                    &#x25C0; Back to RMA
                </button>
                <div className="flex space-x-4">
                    <ReactToPrint
                        trigger={() => (
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                Print
                            </button>
                        )}
                        content={() => componentRef.current}
                    />
                    {/* PDF Download Button */}
                    <PDFDownloadLink
                        document={<RMAPDF rma={rma} />} // Pass the RMA data to your PDF component
                        fileName="rma-form.pdf"
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                    >
                        {({ loading }) => 
                            loading ? 'Preparing PDF...' : 'Download PDF'
                        }
                    </PDFDownloadLink>
                </div>
            </div>

            <div ref={componentRef} className={`w-full px-12 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                <h1 className="text-center text-2xl font-semibold mb-4">Return Merchandise Authorization</h1>
                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                {/* Business Information */}
                <div className="mb-6">
                    <h2 className="font-semibold text-lg">Irig Computer Trading</h2>
                    <p>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
                    <p>Tel. No.: 8-364-6039</p>
                    <p>CP. No.: 0923-444-1030</p>
                    <p>Email: irigcomputers@gmail.com</p>
                </div>

                {/* RMA Details */}
                <div className="mb-4">
                    <p><strong>RMA ID:</strong> {rma?.rmaId}</p>
                    <p><strong>Customer Name:</strong> {rma?.customerName}</p>
                    <p><strong>Date Initiated:</strong> {rma?.date_initiated}</p>
                    <p><strong>Product Name:</strong> {rma?.productName}</p>
                    <p><strong>Serial Number:</strong> {rma?.serialNumber}</p>
                    <p><strong>Reason for RMA:</strong> {rma?.reason}</p>
                </div>

                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                {/* Shipping and Instructions */}
                <div className="mb-4">
                    <p><strong>Instructions:</strong></p>
                    <p>Please return the above item for repair or replacement.</p>
                    <p><strong>Preferred Shipping Method:</strong> {rma?.shippingMethod || "Ground Shipping"}</p>
                </div>

                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                {/* Warranty Status */}
                <div className="mb-4">
                    <p><strong>Warranty Status:</strong> {rma?.warrantyStatus || "Under Warranty"}</p>
                </div>

                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                {/* Authorized Person */}
                <div className="flex items-center justify-end py-4">
                    <div className='w-[15%] flex items-center flex-col justify-center'>
                        <p className={`border-b-2 w-full text-center font-semibold py-1 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}>Judith Villasin</p>
                        <p className="text-sm italic">Authorized Person</p>
                        <p className="text-sm italic">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Print styles */}
            <style jsx>{`
                @media print {
                    .bg-white {
                        background: white !important;
                    }
                    .text-light-textPrimary,
                    .text-dark-textPrimary {
                        color: black !important; /* Ensure text is black for print */
                    }
                    button {
                        display: none; /* Hide buttons on print */
                    }
                    body{
                      padding: 60px
                    }
                }
            `}</style>

            
        </div>
    );
};

export default RMAForm;
