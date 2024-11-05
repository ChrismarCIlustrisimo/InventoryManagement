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
        <div className="w-full h-auto px-6 py-2 bg-white shadow-md mt-4">
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
                <h1 className="text-center text-2xl font-semibold my-8">Return Merchandise Authorization</h1>
                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                <div className="mb-6 flex flex-col gap-2">
                    <h2 className="font-semibold text-lg">Irig Computer Trading</h2>
                    <p>23 Gen. Tinio St. Bgy 85, Caloocan, Philippines</p>
                    <p>Tel. No.: 8-364-6039</p>
                    <p>CP. No.: 0923-444-1030</p>
                    <p>Email: irigcomputers@gmail.com</p>
                </div>
                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>
                <div className="mb-4">
                    <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }} className="print-container gap-2">
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p style={{ width: '30%' }} className="print-title"><strong>RMA ID:</strong></p>
                            <p style={{ width: '70%' }} className="print-value">{rma?.rma_id}</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p style={{ width: '30%' }} className="print-title"><strong>Customer Name:</strong></p>
                            <p style={{ width: '70%' }} className="print-value">{rma?.customer_name}</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p style={{ width: '30%' }} className="print-title"><strong>Date Initiated:</strong></p>
                            <p style={{ width: '70%' }} className="print-value">{rma?.date_initiated}</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p style={{ width: '30%' }} className="print-title"><strong>Product Name:</strong></p>
                            <p style={{ width: '70%' }} className="print-value">{rma?.product}</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p style={{ width: '30%' }} className="print-title"><strong>Serial Number:</strong></p>
                            <p style={{ width: '70%' }} className="print-value">{rma?.serial_number}</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p style={{ width: '30%' }} className="print-title"><strong>Reason for RMA:</strong></p>
                            <p style={{ width: '70%' }} className="print-value">{rma?.reason}</p>
                        </div>
                    </div>
                </div>
                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                <div className="mb-4">
                    <p><strong>Instructions: </strong>Instructions: 
                    Please return the above item for repair or replacement.
                    Preferred Shipping Method: Ground Shipping
                    </p>
                </div>

                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                <div className="mb-4">
                    <p><strong>Warranty Status:</strong> {rma?.warrantyStatus || "Under Warranty"}</p>
                </div>

                <div className={`border-b-2 border-gray-300 mb-4 ${darkMode ? 'border-light-textPrimary' : 'border-dark-textPrimary'}`}></div>

                <div className="flex items-center justify-end py-4">
                    <div className="w-[15%] flex items-center flex-col justify-center">
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
        .print-container {
            width: 50% !important; /* Set to 50% width */
            display: inline-block; /* Align two .print-container side by side */
            vertical-align: top;
        }
        .print-conatiner {
            width: 50%;
        }
        .print-value {
            width: 70%;
        }
    .print-container {
        break-inside: avoid; /* Prevent breaks inside print containers */
    }
    }
`}</style>
        </div>
    );
};

export default RMAForm;
