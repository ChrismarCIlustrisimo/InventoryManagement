import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import AdminSearchBar from '../components/adminSearchBar';
import DatePicker from 'react-datepicker';
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { API_DOMAIN } from '../utils/constants';

const ConfirmationModal = ({ message, onConfirm, onCancel, darkMode }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'text-dark-textPrimary bg-dark-container'}`}>
      <p className="text-xl mb-4 py-6 font-semibold ">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onConfirm}
          className={`w-[46%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className={`w-[46%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const RefundedOrReplaced = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [ProductName, setProductName] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [rmas, setRmas] = useState([]);
  const [filteredRmas, setFilteredRmas] = useState([]);
  const baseURL = API_DOMAIN;
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});

  const handleReasonChange = (event) => {
    setReason(event.target.value); // Update state with selected value
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value); // Update state with selected value
  };


    // Fetch all RMAs and product units
    const fetchRmas = async () => {
      try {
        const response = await axios.get(`${baseURL}/rma`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setRmas(response.data);

        const rmasWithUnits = await Promise.all(response.data.map(async (rma) => {
          if (!rma.product_id) {
            return { ...rma, units: [] }; // Skip this RMA if no valid product_id
          }
          const productId = rma.product_id;
          try {
            const productUnitsResponse = await axios.get(`${baseURL}/product/${productId}/units`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const filteredUnits = productUnitsResponse.data.units.filter(unit =>
              unit.status === 'refunded' || unit.status === 'replaced'
            );
            return { ...rma, units: filteredUnits };
          } catch (error) {
            console.error(`Error fetching units for product ${productId}:`, error);
            return { ...rma, units: [] }; // Handle error gracefully and return an empty units array
          }
        }));
        
        setRmas(rmasWithUnits);
        const filteredRmas = rmasWithUnits.filter(rma => rma.units.length > 0);
        setFilteredRmas(filteredRmas);
      } catch (error) {
        console.error("Error fetching RMAs:", error);
      }
    };

  const applyFilters = () => {
    const filtered = rmas.filter((rma) => {
      // Check if product name matches (assuming rma.product holds the product name)
      if (ProductName && !rma.product?.toLowerCase().includes(ProductName.toLowerCase())) {
        return false;
      }
  
      // Check if RMA contains at least one unit with "replaced" or "refunded" status
      const hasValidUnit = rma.units.some(unit => 
        unit.status === 'refunded' || unit.status === 'replaced'
      );

      // Filter by reason
      if (reason && rma.reason !== reason) {
        return false;
      }
      
      // Filter by status
      if (status && !rma.units.some(unit => unit.status === status)) {
        return false;
      }
      
      if (!hasValidUnit) {
        return false;
      }
  
      
      return true;
    });
  
    setFilteredRmas(filtered);
  };
  
  

  useEffect(() => {
    fetchRmas();
  }, [user.token]);

  useEffect(() => {
    applyFilters();
  }, [ProductName, reason, status]);

  const handleResetFilters = () => {
    setProductName('');
    setReason('');
    setStatus('');
    setFilteredRmas(rmas);
  };
  const openConfirmDialog = (message, onConfirm) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => onConfirm);
    setIsOpenConfirmDialog(true);
  };


  const handleUpdateUnit = async (productId, unitId) => {
    openConfirmDialog("Put Product Back into Inventory?", async () => {
      try {
        await axios.put(`${baseURL}/product/${productId}/unit/${unitId}`, { status: 'in_stock' }, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchRmas(); // Re-fetch RMAs to update the display
      } catch (error) {
        console.error("Error updating unit:", error);
      }
      setIsOpenConfirmDialog(false);
    });
  };


  const handleDeleteUnit = async (productId, unitId) => {
    openConfirmDialog("Discard/Do Not Return to Inventory?", async () => {
      try {
        await axios.delete(`${baseURL}/product/${productId}/unit/${unitId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchRmas(); // Re-fetch RMAs to update the display
      } catch (error) {
        console.error("Error deleting unit:", error);
      }
      setIsOpenConfirmDialog(false);
    });
  };


  const getStatusStyles = (status) => {
    let statusStyles = {
      textClass: 'text-[#8E8E93]', // Default text color
      bgClass: 'bg-[#E5E5EA]', // Default background color
    };
  
    switch (status) {
      case 'Returned':
        statusStyles = {
          textClass: 'text-[#4E3F77]',
          bgClass: 'bg-[#EADDFF]',
        };
        break;
      case 'Replaced':
        statusStyles = {
          textClass: 'text-[#EC221F]', // Red for Low Stock
          bgClass: 'bg-[#FEE9E7]',
        };
        break;
    }
  
    return statusStyles; // Return the status styles directly
  };

  const handleCancel = () => {
    setIsOpenConfirmDialog(false);
  };

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4 w-full h-full'>
        <div className='flex items-center justify-center py-5'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Refunded and Replaced Units</h1>
          <div className='w-full flex justify-end gap-2'>
            <AdminSearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              placeholderMessage={'Search by RMA ID'}
            />
          </div>
        </div>
        <div className='flex gap-4'>
          <div className={`h-[78vh] w-[22%] rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-light-container text-light-textPrimary' : 'dark:bg-dark-container text-dark-textPrimary'}`}>
            <div className='flex flex-col gap-6 h-full'>
              <div className='flex flex-col gap-2 flex-grow'>
                <div className='flex flex-col'>
                  <label htmlFor='ProductName' className={`text-sm mb-2 font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>PRODUCT NAME</label>
                  <input
                    type='text'
                    placeholder='Enter Product Name'
                    value={ProductName}
                    onChange={(e) => setProductName(e.target.value)}
                    className={`border rounded p-2 my-1 
                      ${ProductName === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}
                  />
                </div>
                <div className='flex flex-col'>
                <label htmlFor="reason" className={`text-sm  font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>REASON</label>
                  <select
                    id="reason"
                    name="reason"
                    value={reason} // Controlled component with state value
                    onChange={handleReasonChange} // Event handler for updating state
                    className={`border rounded p-2 my-1 
                      ${reason === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}                  >
                    <option value="">Select a reason</option>
                    <option value="Defective Product">Defective Product</option>
                    <option value="Product Malfunction">Product Malfunction</option>
                    <option value="Missing Parts">Missing Parts</option>
                    <option value="Warranty Repair">Warranty Repair</option>
                    <option value="Request for Replacement">Request for Replacement</option>
                    <option value="Product Not Compatible">Product Not Compatible</option>
                  </select>
                </div>
                <div className='flex flex-col'>
                <label htmlFor="status" className={`text-sm  font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>STATUS</label>
                  <select
                    id="status"
                    name="status"
                    value={status} // Controlled component with state value
                    onChange={handleStatusChange} // Event handler for updating state
                    className={`border rounded p-2 my-1 
                      ${status === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')}   
                      outline-none font-semibold`}                  >
                    <option value="">Select a reason</option>
                    <option value="refunded">Returned</option>
                    <option value="repalced">Replaced</option>

                  </select>
                </div>


              </div>
            </div>

            <div className='flex flex-col gap-2'>
                  <button
                      className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-gray-400 border-2 
                      ${darkMode ? 'hover:bg-dark-textSecondary hover:scale-105' : 'hover:bg-light-textSecondary hover:scale-105'} transition-all duration-300`}
                      onClick={handleResetFilters}>
                      <HiOutlineRefresh className='mr-2 text-2xl text-white' />
                      <p className='text-lg text-white'>Reset Filters</p>
                  </button>
              </div>
          </div>
          <div className='flex-grow'>
            {}
            <table className={`w-full bg-white rounded-lg ${darkMode ? 'bg-dark-container' : 'bg-light-container'}`}>
              <thead>
                <tr>
                  <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Product Name</th>
                  <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Reason</th>
                  <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Condition</th>
                  <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Serial Numbers</th>
                  <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Status</th>
                  <th className={`text-left p-4 text-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'dark:text-dark-textPrimary bg-dark-container'} text-center`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRmas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((rma) => (
                  <tr key={rma.rma_id} className={`${darkMode ? 'bg-light-container text-light-textPrimary' : 'bg-dark-container text-dark-textPrimary'}`}>
                    <td className='p-2'>{rma.product}</td>
                    <td className='p-2'>{rma.reason}</td>
                    <td className='p-2'>{rma.condition}</td>
                    <td className='p-2'>
                      <ul>
                        {rma.units.map((unit) => (
                          <li key={unit.serial_number}>{unit.serial_number}</li>
                        ))}
                      </ul>
                    </td>
                    <td className={`p-2 text-center`}>
                
                        <div className={`rounded-md py-2 px-4 font-semibold ${getStatusStyles(rma.units[0]?.status === 'replaced' ? 'Replaced' : rma.units[0]?.status === 'refunded' ? 'Returned' : rma.units[0]?.status).bgClass} ${getStatusStyles(rma.units[0]?.status === 'replaced' ? 'Replaced' : rma.units[0]?.status === 'refunded' ? 'Returned' : rma.units[0]?.status).textClass}`}>
                        {rma.units.length > 0 
                          ? rma.units[0].status === 'replaced' 
                            ? 'Replaced' 
                            : rma.units[0].status === 'refunded' 
                              ? 'Returned' 
                              : rma.units[0].status 
                          : 'N/A'}
                        </div>

                      </td>

                      <td className='p-2'>
                          {rma.units.map((unit) => (
                            <div key={unit.serial_number} className="flex">
                              {/* In Stock Button with Tooltip */}
                              <div className="relative inline-block group">
                                <button 
                                  onClick={() => handleUpdateUnit(rma.product_id, unit._id, 'in_stock')} 
                                  className={`rounded px-2 py-1 ${darkMode ? 'text-light-textPrimary hover:text-light-primary' : 'text-dark-textPrimary hover:text-dark-primary'}`}
                                >
                                  <AiOutlineCheckCircle size={30} />
                                </button>
                                <span
                                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    darkMode ? 'bg-gray-200 text-black' : 'bg-black text-white'
                                  }`}
                                >
                                  Return
                                </span>
                              </div>

                              {/* Delete Button with Tooltip */}
                              <div className="relative inline-block group">
                                <button 
                                  onClick={() => handleDeleteUnit(rma.product_id, unit._id)} 
                                  className="rounded px-2 py-1"
                                >
                                  <AiOutlineCloseCircle size={30} />
                                </button>
                                <span
                                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    darkMode ? 'bg-gray-200 text-black' : 'bg-black text-white'
                                  }`}
                                >
                                  Delete
                                </span>
                              </div>
                            </div>
                          ))}
                        </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isOpenConfirmDialog && (
          <ConfirmationModal
            message={confirmMessage}
            onConfirm={onConfirmAction}
            onCancel={handleCancel}
            darkMode={darkMode}
          />
        )}

    </div>
  );
};

export default RefundedOrReplaced;
