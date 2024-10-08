import React from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const ViewRMA = ({ rma, onClose, darkMode }) => {
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
            <div className={`bg-white shadow-lg rounded-lg p-6 w-[40%] h-[80%] relative ${darkMode ? 'bg-dark-container' : 'bg-light-container'}`}>
                <div className='flex justify-between items-center '>
                    <button className="absolute top-4 right-6 text-black  hover:text-gray-700"  onClick={onClose}>✖</button>
                </div>
                <div className={`flex flex-col gap-2 w-full h-full  ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                    <div className={`text-4xl w-full flex items-center justify-center border-b py-2 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondaryv'}`}>
                        <p className="font-medium mr-2">RMA ID:</p>
                        <p>{rma.rmaId}</p>
                    </div>
                    <div className='flex flex-col w-full h-full px-24 py-4 gap-4'>
                        <div className={`text-sm flex items-center justify-between `}>
                            <p className="font-medium w-[50%]">SUBMISSION DATE</p>
                            <p className='w-[50%]'>{rma.submissionDate}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between `}>
                            <p className="font-medium w-[50%]">CUSTOMER NAME</p>
                            <p className='w-[50%]'>{rma.customerName}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between `}>
                            <p className="font-medium w-[50%]">PRODUCT</p>
                            <p className='w-[50%]'>{rma.productName}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between `}>
                            <p className="font-medium w-[50%]">SERIAL NUMBER</p>
                            <p className='w-[50%]'>{rma.serialNumber}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between `}>
                            <p className="font-medium w-[50%]">REQUEST TYPE</p>
                            <p className='w-[50%]'>{rma.requestType}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between `}>
                            <p className="font-medium w-[50%]">REASON</p>
                            <p className='w-[50%]'>{rma.reason}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between `}>
                            <p className="font-medium w-[50%]">NOTES</p>
                            <p className='w-[50%] '>Needs urgent processing.</p>
                        </div>
                        <div className="w-full flex flex-col space-y-2 py-4">
                            {/* Approve Button */}
                            <button className="w-full py-2 bg-gray-100 text-gray-700 border border-gray-300 font-medium rounded-lg flex items-center justify-center hover:bg-green-100 hover:text-green-700 hover:border-green-700">
                                <AiOutlineCheckCircle className="mr-2" />
                                Approve
                            </button>

                            {/* Deny Button */}
                            <button className="w-full py-2 bg-gray-100 text-gray-700 border border-gray-300 font-medium rounded-lg flex items-center justify-center hover:bg-red-100 hover:text-red-700 hover:border-red-700">
                                <AiOutlineCloseCircle className="mr-2" />
                                Deny
                            </button>

                            {/* Mark as Completed Button */}
                            <button className="w-full py-2 bg-gray-100 text-gray-700 border border-gray-300 font-medium rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 hover:border-blue-700">
                                Mark as Completed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewRMA;
