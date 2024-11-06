import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import SearchBar from '../components/SearchBar';
import DatePicker from 'react-datepicker';
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";

const RefundedOrReplaced = () => {
  const { user } = useAuthContext();
  const { darkMode } = useAdminTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cashierName, setCashierName] = useState('');
  const [refundDate, setRefundDate] = useState(null);
  const [rmas, setRmas] = useState([]);
  const [filteredRmas, setFilteredRmas] = useState([]);
  const baseURL = "http://localhost:5555";

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
        const productId = rma.product_id;
        const productUnitsResponse = await axios.get(`${baseURL}/product/${productId}/units`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const filteredUnits = productUnitsResponse.data.units.filter(unit => 
          unit.status === 'refunded' || unit.status === 'replaced'
        );

        return { ...rma, units: filteredUnits };
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
      if (searchQuery && !rma.rma_id?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (customerName && !rma.customer_name?.toLowerCase().includes(customerName.toLowerCase())) {
        return false;
      }
      if (cashierName && !rma.cashier?.toLowerCase().includes(cashierName.toLowerCase())) {
        return false;
      }
      if (refundDate && new Date(rma.refund_date) > refundDate) {
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
  }, [customerName, cashierName, refundDate, searchQuery]);

  const handleResetFilters = () => {
    setCustomerName('');
    setCashierName('');
    setRefundDate(null);
    setFilteredRmas(rmas);
  };

  const handleRefundDateChange = (date) => setRefundDate(date);

  const handleUpdateUnit = async (productId, unitId, newStatus) => {
    try {
      await axios.put(`${baseURL}/product/${productId}/unit/${unitId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      fetchRmas(); // Re-fetch RMAs to update the display
    } catch (error) {
      console.error("Error updating unit:", error);
    }
  };

  const handleDeleteUnit = async (productId, unitId) => {
    try {
      await axios.delete(`${baseURL}/product/${productId}/unit/${unitId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      fetchRmas(); // Re-fetch RMAs to update the display
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  return (
    <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <DashboardNavbar />
      <div className='pt-[70px] px-6 py-4 w-full h-full'>
        <div className='flex items-center justify-center py-5'>
          <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Refunded or Replaced Units</h1>
          <div className='w-full flex justify-end gap-2'>
            <SearchBar
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
                  <label htmlFor='customerName' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CUSTOMER NAME</label>
                  <input
                    type='text'
                    placeholder='Enter Product Name'
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`border rounded p-2 my-1 
                      ${customerName === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}
                  />
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='cashierName' className={`text-md font-semibold ${darkMode ? 'text-dark-border' : 'dark:text-light-border'}`}>CASHIER NAME</label>
                  <input
                    type='text'
                    placeholder='Enter Serial Number'
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    className={`border rounded p-2 my-1 
                      ${cashierName === '' 
                        ? (darkMode ? 'bg-transparent text-black border-black' : 'bg-transparent') 
                        : (darkMode 
                          ? 'bg-light-activeLink text-light-primary' 
                          : 'bg-transparent text-black')} 
                      outline-none font-semibold`}
                  />
                </div>


              </div>
            </div>
            <div className='flex flex-col'>
                  <button
                    className={`text-white py-2 px-4 rounded w-full h-[50px] flex items-center justify-center tracking-wide font-medium bg-transparent border-2 
                      ${darkMode ? 'hover:bg-opacity-30 hover:bg-dark-textSecondary' : 'hover:bg-opacity-30 hover:bg-light-textSecondary'}`}
                    onClick={handleResetFilters}
                  >
                    <HiOutlineRefresh className={`mr-2 text-2xl ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`} />
                    <p className={`text-lg ${darkMode ? 'text-dark-textSecondary' : 'text-dark-textSecondary' }`}>Reset Filters</p>
                  </button>
                </div>
          </div>
          <div className='flex-grow'>
            <table className={`w-full bg-white rounded-lg ${darkMode ? 'bg-dark-container' : 'bg-light-container'}`}>
              <thead>
                <tr>
                  <th className={`text-left p-2 text-sm ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Product Name</th>
                  <th className={`text-left p-2 text-sm ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Reason</th>
                  <th className={`text-left p-2 text-sm ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Condition</th>
                  <th className={`text-left p-2 text-sm ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Serial Numbers</th>
                  <th className={`text-left p-2 text-sm ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Status</th>
                  <th className={`text-left p-2 text-sm ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRmas.map((rma) => (
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
                    <td className='p-2'>{rma.units.length > 0 ? rma.units[0].status : 'N/A'}</td>
                    <td className='p-2'>
                      {rma.units.map((unit) => (
                        <div key={unit.serial_number} className="flex gap-2">
                          <button onClick={() => handleUpdateUnit(rma.product_id, unit._id, 'in_stock')} className='bg-blue-500 text-white rounded px-2 py-1'>
                            <AiOutlineCheckCircle />
                          </button>
                          <button onClick={() => handleDeleteUnit(rma.product_id, unit._id)} className='bg-red-500 text-white rounded px-2 py-1'>
                            <AiOutlineCloseCircle />
                          </button>
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
    </div>
  );
};

export default RefundedOrReplaced;
