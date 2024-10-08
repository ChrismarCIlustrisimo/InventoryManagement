// components/UnitsTable.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackOutline } from "react-icons/io5";
import axios from "axios";
import { useAdminTheme } from '../context/AdminThemeContext';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import ConfirmationDialog from "../components/ConfirmationDialog";

const UnitsTable = () => {
  const { productId } = useParams();
  const [units, setUnits] = useState([]);
  const [productName, setProductName] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editUnitIndex, setEditUnitIndex] = useState(null);
  const [editSerialNumber, setEditSerialNumber] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false); // State for confirmation dialog
  const [unitToDelete, setUnitToDelete] = useState(null); // Unit ID to delete
  const navigate = useNavigate();
  const baseURL = "http://localhost:5555";
  const { darkMode } = useAdminTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${baseURL}/product/${productId}`);
        const inStockUnits = response.data.units.filter(unit => unit.status === 'in_stock');
        setUnits(inStockUnits);
        setProductName(response.data.name);
      } catch (error) {
        console.error("Error fetching product units:", error.message);
      }
    };
    fetchUnits();
  }, [productId]);

  const handleBackClick = (num) => {
    navigate(num);
  };

  const handleEditClick = (index, serialNumber) => {
    setIsEditing(true);
    setEditUnitIndex(index);
    setEditSerialNumber(serialNumber);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditUnitIndex(null);
    setEditSerialNumber("");
  };

  const handleDeleteUnit = (unitId) => {
    setUnitToDelete(unitId); // Set the unit ID to be deleted
    setConfirmDelete(true); // Show the confirmation dialog
  };

  const confirmDeleteUnit = async () => {
    try {
      const response = await axios.delete(`${baseURL}/product/${productId}/unit/${unitToDelete}`);
      if (response.status === 200) {
        setUnits(units.filter(unit => unit._id !== unitToDelete)); // Remove the deleted unit from state
        toast.success("Unit deleted successfully!"); // Success toast
      } else {
        console.error('Error deleting unit: Unexpected response code', response.status);
        toast.error("Error deleting unit."); // Error toast
      }
    } catch (error) {
      console.error("Error deleting unit:", error.response ? error.response.data : error.message);
      toast.error("Error deleting unit."); // Error toast
    } finally {
      setConfirmDelete(false); // Close the confirmation dialog
      setUnitToDelete(null); // Reset the unit to delete
    }
  };

  const cancelDeleteUnit = () => {
    setConfirmDelete(false); // Close the confirmation dialog
    setUnitToDelete(null); // Reset the unit to delete
  };

  const handleUpdateUnit = async (unitId) => {
    setLoading(true); // Start loading state
    try {
      const response = await axios.put(`${baseURL}/product/${productId}/unit/${unitId}`, { serial_number: editSerialNumber });
      if (response.status === 200) {
        const updatedUnit = response.data.unit; // Ensure this is correct
        const updatedUnits = units.map((unit) => {
          if (unit._id === updatedUnit._id) { // Match by unit ID
            return { ...unit, serial_number: updatedUnit.serial_number };
          }
          return unit;
        });
        setUnits(updatedUnits); // Update state with the modified units
        setIsEditing(false);
        setEditUnitIndex(null);
        setEditSerialNumber("");
        toast.success("Unit updated successfully!"); // Success toast
      } else {
        console.error('Error updating unit: Unexpected response code', response.status);
        toast.error("Error updating unit."); // Error toast
      }
    } catch (error) {
      console.error("Error updating unit:", error.response ? error.response.data : error.message);
      toast.error("Error updating unit."); // Error toast
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className={`h-full w-full flex flex-col border ${darkMode ? 'text-light-textPrimary bg-light-bg' : 'text-dark-textPrimary bg-dark-bg'}`}>
      <div className={`flex items-center justify-between h-[8%] p-4 border-b-2 ${darkMode ? 'bg-light-bg' : 'bg-light-bg'}`}>
        <button
          className={`flex gap-2 items-center py-2 px-4 rounded-md ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'} hover:underline`}
          onClick={() => handleBackClick(-2)}
        >
          <IoCaretBackOutline /> Back to inventory
        </button>
      </div>

      <div className="w-full flex items-center justify-between px-48 py-6">
        <h1 className="text-3xl font-bold">{productName}</h1>
        <button className={`${darkMode ? 'bg-light-button' : 'bg-dark-button'} text-white px-4 py-2 rounded`} onClick={() => handleBackClick(-1)}>Back to Description</button>
      </div>

      <div className="w-full h-full flex items-start justify-center">
        <div className="w-[60%] h-[90%] overflow-y-auto border border-gray-200 shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-center">Image</th>
                <th className="px-4 py-2 text-center">Serial Number</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr key={unit._id} className="even:bg-gray-100">
                  <td className="px-4 py-2 text-center">
                    <img
                      src={`${baseURL}/${unit.serial_number_image}`}
                      alt={`Unit ${index + 1}`}
                      className="h-24 w-auto mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2 text-center font-semibold text-xl">
                    {editUnitIndex === index ? (
                      <input
                        type="text"
                        value={editSerialNumber}
                        onChange={(e) => setEditSerialNumber(e.target.value)}
                        className="border rounded px-2"
                      />
                    ) : (
                      unit.serial_number
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {editUnitIndex === index ? (
                      <>
                        <button
                          onClick={() => handleUpdateUnit(unit._id)}
                          className={`bg-green-500 text-white px-2 py-1 rounded mr-2 ${darkMode ? 'hover:bg-light-hover' : 'hover:bg-dark-hover'}`}
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className={`bg-red-500 text-white px-2 py-1 rounded ${darkMode ? 'hover:bg-light-hover' : 'hover:bg-dark-hover'}`}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(index, unit.serial_number)}
                          className={`bg-yellow-500 text-white px-2 py-1 rounded mr-2 ${darkMode ? 'hover:bg-light-hover' : 'hover:bg-dark-hover'}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUnit(unit._id)}
                          className={`bg-red-500 text-white px-2 py-1 rounded ${darkMode ? 'hover:bg-light-hover' : 'hover:bg-dark-hover'}`}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
      </div>
      <ToastContainer /> {/* Add ToastContainer for displaying toasts */}
      <ConfirmationDialog
        isOpen={confirmDelete}
        onConfirm={confirmDeleteUnit}
        onCancel={cancelDeleteUnit}
        message="Are you sure you want to delete this unit?"
      />
    </div>
  );
};

export default UnitsTable;
