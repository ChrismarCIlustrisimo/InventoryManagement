import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import UpdateStatusPopup from './UpdateStatusPopup';
import AddNotes from './AddNotes';
import { AiOutlineClose } from "react-icons/ai";

const ViewRMA = ({ rma, onClose, darkMode }) => {
    const baseURL = "http://localhost:5555";
    const [isApproveRMA, setIsApproveRMA] = useState(false);
    const [isAddNotesOpen, setIsAddNotesOpen] = useState(false);
    const [isConfirmCloseOpen, setConfirmCloseOpen] = useState(false); // State for confirmation modal
    const navigate = useNavigate(); // Initialize useNavigate

    const toggleIsApproveRMA = () => {
        setIsApproveRMA(!isApproveRMA);
    };

    const toggleAddNotes = () => {
        setIsAddNotesOpen(!isAddNotesOpen);
    };

    // Function to toggle the confirmation modal
    const toggleConfirmClose = () => {
        setConfirmCloseOpen(!isConfirmCloseOpen);
    };

    const handleCloseRMA = () => {
        onClose(); // Close the RMA view page
        setConfirmCloseOpen(false); // Close the modal after confirmation
    };

    const getStatusStyles = (status) => {
        let statusStyles = {
            textClass: 'text-[#8E8E93]',
            bgClass: 'bg-[#E5E5EA]',
        };

        switch (status) {
            case 'Approved':
                statusStyles = {
                    textClass: 'text-[#14AE5C]',
                    bgClass: 'bg-[#CFF7D3]',
                };
                break;
            case 'Pending':
                statusStyles = {
                    textClass: 'text-[#BF6A02]',
                    bgClass: 'bg-[#FFF1C2]',
                };
                break;
            case 'In Progress':
                statusStyles = {
                    textClass: 'text-[#007BFF]',
                    bgClass: 'bg-[#C2D7FF]',
                };
                break;
            case 'Completed':
                statusStyles = {
                    textClass: 'text-[#8E8E93]',
                    bgClass: 'bg-[#E5E5EA]',
                };
                break;
            case 'Rejected':
                statusStyles = {
                    textClass: 'text-[#EC221F]',
                    bgClass: 'bg-[#FEE9E7]',
                };
                break;
        }

        return statusStyles;
    };

    const getWarrantyStyles = (warrantyStatus) => {
        let warrantyStyles = {
            textClass: '',
            bgClass: ''
        };

        if (warrantyStatus === 'Valid') {
            warrantyStyles.textClass = 'text-[#14AE5C]'; // White text
            warrantyStyles.bgClass = 'bg-[#CFF7D3]'; // Green background
        } else if (warrantyStatus === 'Expired') {
            warrantyStyles.textClass = 'text-[#EC221F]'; // White text
            warrantyStyles.bgClass = 'bg-[#FEE9E7]'; // Red background
        } else {
            warrantyStyles.textClass = 'text-[#8E8E93]'; // Default gray text
            warrantyStyles.bgClass = 'bg-[#E5E5EA]'; // Default light gray background
        }

        return warrantyStyles;
    };

    const handleGenerateRMAForm = () => {
        navigate('/RMAForm', { state: { rma } });
    };

    const statusStyles = getStatusStyles(rma.status);
    const warrantyStyles = getWarrantyStyles(rma.warranty_status);


    const handleStatusUpdate = async (newProcess, newStatus) => {
        try {
            const response = await fetch(`${baseURL}/rma/${rma._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus,
                    notes: rma.notes,
                    process: newProcess,
                }),
            });
    
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message || 'Failed to update status');
            }
            const updatedRMA = await response.json();
            console.log(updatedRMA);
            onClose();
            toggleIsApproveRMA(); // Close the popup after successful update
        } catch (error) {
            console.error(error);
            alert(error.message); // Display error message to the user
        }
    };
    

    const handleAddNotes = async (newNotes) => {
        try {
            const response = await fetch(`${baseURL}/rma/${rma._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notes: newNotes,
                }),
            });

            if (!response.ok) throw new Error('Failed to add notes');
            const updatedRMA = await response.json();
            console.log(updatedRMA);
            onClose();
            toggleAddNotes(); // Close the popup after successful addition of notes
        } catch (error) {
            console.error(error);
        }
    };

    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short', // This will return 'Oct' for 'October'
          day: 'numeric',
          year: 'numeric'
        });
      };
      
    

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
            <div className={`bg-white shadow-lg rounded-lg px-6 py-4 w-[50%] h-[80%] relative ${darkMode ? 'bg-dark-container' : 'bg-light-container'}`}>
                <div className={`flex flex-col gap-2 w-full h-full ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                    <div className={`w-full flex items-center justify-between border-b p-2 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
                        <p className='text-4xl font-semibold'>{rma.rma_id}</p>
                        <button className='text-red-800 hover:text-red-600 text-xl' onClick={toggleConfirmClose}>
                              <AiOutlineClose />
                        </button>
                    </div>
                    <div className='flex flex-col w-full h-full justify-start px-6 py-4 gap-4'>
                        <div className={`text-sm flex items-center justify-between`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.transaction?.transaction_id}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>DATE INITIATED</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{formatDate(rma.date_initiated)}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CUSTOMER NAME</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.customer_name}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>PRODUCT</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.product?.name}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SERIAL NUMBER</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.serial_number}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>REASON</p>
                            <p className={`w-[70%] font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{rma.reason}</p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>STATUS</p>
                            <p className={`py-2 rounded-md w-[70%]`}>
                                <span className={`p-2 rounded-md ${statusStyles.textClass} ${statusStyles.bgClass}`}>{rma.status}</span>
                            </p>
                        </div>
                        <div className={`text-sm flex items-center justify-between ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            <p className={`font-medium w-[30%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>WARRANTY STATUS</p>
                            <p className={`py-2 rounded-md w-[70%]`}>
                                <span className={`p-2 rounded-md ${warrantyStyles.textClass} ${warrantyStyles.bgClass}`}>{rma.warranty_status}</span>
                            </p>
                        </div>
                        <div className="w-full flex flex-col space-y-2 py-4 gap-2">
                            <p className={`text-xl w-full flex items-center justify-start font-semibold py-2`}>RMA Actions</p>
                            <div className='flex gap-2'>
                                <button 
                                    className={`bg-[#14AE5C] text-white font-semibold py-2 px-4 rounded ${rma.status === 'Approved' || rma.status === 'Rejected' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    onClick={toggleIsApproveRMA} 
                                    disabled={rma.status === 'Approved' || rma.status === 'Rejected'}
                                >
                                    Approve
                                </button>
                                <button 
                                    className={`bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 ${rma.status === 'Rejected' || rma.status === 'Approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => handleStatusUpdate('None', 'Rejected')}
                                    disabled={rma.status === 'Approved' || rma.status === 'Rejected'}
                                >
                                    Reject
                                </button>
                                <button className='bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600' onClick={handleGenerateRMAForm}>
                                    Generate RMA Form
                                </button>
                                <button className='bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600' onClick={toggleAddNotes}>
                                    Add Notes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isApproveRMA && <UpdateStatusPopup onClose={toggleIsApproveRMA} rmaId={rma._id}  currentStatus={rma.status} onUpdate={handleStatusUpdate} />}
                {isAddNotesOpen && <AddNotes onClose={(newNotes) => {handleAddNotes(newNotes); toggleAddNotes();}} rmaId={rma.rma_id}  />}
                {isConfirmCloseOpen && (
                     <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
                          <div className={`bg-white shadow-lg rounded-lg p-6 w-[30%] relative flex flex-col gap-4 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} `}>
                           <p className='pb-12 pt-4'>Are you sure you want to close this RMA?</p>
                            <div className='flex justify-end space-x-2'>
                                <button onClick={handleCloseRMA} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'>
                                    Confirm
                                </button>
                                <button onClick={toggleConfirmClose} className='bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded'>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRMA;
