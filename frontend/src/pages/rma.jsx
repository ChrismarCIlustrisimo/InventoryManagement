import React, { useState } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import AdminSearchBar from '../components/adminSearchBar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { BsArrowRepeat } from "react-icons/bs";
import { GrView } from 'react-icons/gr';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import ViewRMA from '../components/ViewRMA';
import RMARequestForm from './RMARequestForm';

const demoData = [
  {
      rmaId: 'RMA-1001',
      submissionDate: '2024-10-02',
      customerName: 'Emily Johnson',
      productName: 'Intel i9 Processor',
      location: 'Loc-01',
      serialNumber: 'SN23104223',
      requestType: 'John Doe',
      reason: 'Defective',
      status: 'Approved',
  },
  {
      rmaId: 'RMA-1001',
      submissionDate: '2024-10-02',
      customerName: 'Emily Johnson',
      productName: 'Intel i3 Processor',
      location: 'Loc-01',
      serialNumber: 'SN23304231',
      requestType: 'John Doe',
      reason: 'Defective',
      status: 'Pending',
  },
  {
      rmaId: 'RMA-1001',
      submissionDate: '2024-10-02',
      customerName: 'Mark Taylor',
      productName: 'Intel i3 Processor',
      location: 'Loc-01',
      serialNumber: 'SN23104237',
      requestType: 'John Doe',
      reason: 'Defective',
      status: 'In Progress',
  },
  {
      rmaId: 'RMA-1001',
      submissionDate: '2024-10-02',
      customerName: 'Mark Taylor',
      productName: 'Intel i3 Processor',
      location: 'Loc-01',
      serialNumber: 'SN23104237',
      requestType: 'John Doe',
      reason: 'Defective',
      status: 'Completed',
  },
  // Add more entries as needed...
];

const Rma = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRma, setSelectedRma] = useState(null);  // State to store selected RMA
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
    const [isNewRmaModalOpen, setIsNewRmaModalOpen] = useState(false); // New state for the RMA form modal

    // Demo filtering logic based on the search query
    const filteredProducts = demoData.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // Function to open the modal and set selected RMA
    const handleViewRMA = (rma) => {
        setSelectedRma(rma);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRma(null);
    };


        // Open new RMA modal
    const handleAddProductClick = () => {
        setIsNewRmaModalOpen(true);
    };

    const closeNewRmaModal = () => {
        setIsNewRmaModalOpen(false);
    };

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <div className='pt-[70px] px-6 py-4 w-full h-full'>
                <div className='flex items-center justify-center py-5'>
                    <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                        RMA / Warranty
                    </h1>
                    <div className='w-full flex justify-end gap-2'>
                        <AdminSearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search Transaction by transaction id'} />
                        <button className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary' : 'dark:bg-dark-primary'}`} onClick={handleAddProductClick}>
                            <span className='flex items-center justify-center gap-2'>
                                <BsArrowRepeat size={20} />
                                New RMA Request
                            </span>
                        </button>
                    </div>
                </div>
                <div className='flex gap-4'>
                    <div className={`h-[76vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                        {/* ADD FILTER HERE */}
                    </div>
                    <div className={`h-[76vh] w-[77%] overflow-auto rounded-2xl ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
                        {filteredProducts.length > 0 ? (
                            <table className={`w-full border-collapse p-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                <thead className={`sticky top-0 z-10 ${darkMode ? 'border-light-border bg-light-container' : 'border-dark-border bg-dark-container'} border-b text-sm`}>
                                    <tr>
                                        <th className='p-2 text-center'>RMA ID</th>
                                        <th className='p-2 text-center text-xs'>Submission Date</th>
                                        <th className='p-2 text-center text-xs'>Customer Name</th>
                                        <th className='p-2 text-center text-xs'>Product Name</th>
                                        <th className='p-2 text-center text-xs'>Serial Number</th>
                                        <th className='p-2 text-center text-xs'>Request Type</th>
                                        <th className='p-2 text-center text-xs'>Reason</th>
                                        <th className='p-2 text-center text-xs'>Status</th>
                                        <th className='p-2 text-center text-xs'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((rmaRequest, index) => (
                                        <tr key={index} className={`border-b font-medium ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                                            <td className='text-center py-4'>{rmaRequest.rmaId}</td>
                                            <td className='text-center py-4'>{rmaRequest.submissionDate}</td>
                                            <td className='text-center py-4'>{rmaRequest.customerName}</td>
                                            <td className='text-center py-4'>{rmaRequest.productName}</td>
                                            <td className='text-center py-4'>{rmaRequest.serialNumber}</td>
                                            <td className='text-center py-4'>{rmaRequest.requestType}</td>
                                            <td className='text-center py-4'>{rmaRequest.reason}</td>
                                            <td className='text-center py-4'>{rmaRequest.status}</td>
                                            <td className='text-center py-4'>
                                                <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`} onClick={() => handleViewRMA(rmaRequest)}>
                                                    <GrView size={20} />
                                                </button>
                                                <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}>
                                                    <AiOutlineCheckCircle size={20} />
                                                </button>
                                                <button className={`mx-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}>
                                                    <AiOutlineCloseCircle size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='flex items-center justify-center h-[76vh] text-lg text-center'>
                                <p className={`${darkMode ? 'text-light-textPrimary' : 'dark:text-dark-textPrimary'}`}>No products found matching the filter criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ViewRMA Modal */}
            {isModalOpen && <ViewRMA rma={selectedRma} onClose={closeModal} darkMode={darkMode} />}
            
            {/* New RMA Form Modal */}
            {isNewRmaModalOpen && <RMARequestForm onClose={closeNewRmaModal} darkMode={darkMode} /> }           
        </div>
    );
}

export default Rma;
