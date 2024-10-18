import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackOutline } from "react-icons/io5";
import axios from "axios";
import { useAdminTheme } from '../context/AdminThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineUpload } from 'react-icons/ai';

const UnitsTable = () => {
  const { productId } = useParams();
  const [units, setUnits] = useState([]);
  const [productName, setProductName] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [editUnitIndex, setEditUnitIndex] = useState(null);
  const [editSerialNumber, setEditSerialNumber] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseURL = "http://localhost:5555";
  const { darkMode } = useAdminTheme();

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
    setEditImageFile(null);
  };

  const handleDeleteUnit = (unitId) => {
    setUnitToDelete(unitId);
    setConfirmDelete(true);
  };

  const confirmDeleteUnit = async () => {
    try {
      const response = await axios.delete(`${baseURL}/product/${productId}/unit/${unitToDelete}`);
      if (response.status === 200) {
        setUnits(units.filter(unit => unit._id !== unitToDelete));
        toast.success("Unit deleted successfully!");
      } else {
        console.error('Error deleting unit: Unexpected response code', response.status);
        toast.error("Error deleting unit.");
      }
    } catch (error) {
      console.error("Error deleting unit:", error.response ? error.response.data : error.message);
      toast.error("Error deleting unit.");
    } finally {
      setConfirmDelete(false);
      setUnitToDelete(null);
    }
  };

  const cancelDeleteUnit = () => {
    setConfirmDelete(false);
    setUnitToDelete(null);
  };

  const handleUpdateUnit = async (unitId) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("serial_number", editSerialNumber);
    if (editImageFile) {
      formData.append("serial_number_image", editImageFile);
    }

    try {
      const response = await axios.put(`${baseURL}/product/${productId}/unit/${unitId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        const updatedUnit = response.data.unit;
        const updatedUnits = units.map((unit) => {
          if (unit._id === updatedUnit._id) {
            return { ...unit, serial_number: updatedUnit.serial_number, serial_number_image: updatedUnit.serial_number_image };
          }
          return unit;
        });
        setUnits(updatedUnits);
        setIsEditing(false);
        setEditUnitIndex(null);
        setEditSerialNumber("");
        setEditImageFile(null);
        toast.success("Unit updated successfully!");
      } else {
        console.error('Error updating unit: Unexpected response code', response.status);
        toast.error("Error updating unit.");
      }
    } catch (error) {
      console.error("Error updating unit:", error.response ? error.response.data : error.message);
      toast.error("Error updating unit.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleImageChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  // ConfirmationDialog component
  const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50`}>
      <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'text-dark-textPrimary bg-dark-container'}`}>
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-full w-full flex flex-col ${darkMode ? 'text-light-textPrimary  bg-light-container' : 'text-dark-textPrimary  bg-dark-container'}`}>
      <div className={`flex items-center justify-between h-[8%] p-4 border-b-2 ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
        <button
          className={`flex gap-2 items-center py-2 px-4 rounded-md ${darkMode ? 'text-light-textPrimary bg-light-container' : 'text-dark-textPrimary bg-dark-container'} hover:underline`}
          onClick={() => handleBackClick(-2)}
        >
          <IoCaretBackOutline /> Back to inventory
        </button>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-start">
        <div className="w-full flex items-center justify-between px-48 py-6">
          <h1 className="text-3xl font-bold">{productName}</h1>
          <button className={`${darkMode ? 'bg-light-button' : 'bg-dark-textSecondary'} text-white px-4 py-2 rounded`} onClick={() => handleBackClick(-1)}>Back to Description</button>
        </div>
        <div className="w-[80%] h-[84%] overflow-y-auto border border-gray-200 shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-300' : 'bg-dark-textSecondary'}`}>
              <tr>
                <th className="px-4 py-2 text-center">Unit ID</th>
                <th className="px-4 py-2 text-center">Image</th>
                <th className="px-4 py-2 text-center">Serial Number</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit, index) => (
                <tr key={unit._id}   className={`${
                  index % 2 === 0
                    ? darkMode ? 'bg-light-container' : 'bg-dark-container'
                    : darkMode ? 'bg-gray-100' : 'bg-light-textSecondary'
                }`}
              >
                  <td className="px-4 py-2 text-center">{unit.unit_id}</td>
                  <td className="px-4 py-2 flex items-center justify-center">
                    {editUnitIndex === index ? (
                      <label
                        className="bg-blue-500 hover:scale-95 text-white rounded-md p-2 px-6 flex items-center justify-center gap-2 cursor-pointer w-full"
                      >
                        <AiOutlineUpload className='text-2xl' />
                        {editImageFile ? 'Change Image' : 'Upload Image'}
                        <input
                          name="serial_number_image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <img
                        src={`${baseURL}/${unit.serial_number_image}`}
                        alt={`Unit ${index + 1}`}
                        className="h-14 w-14 transition-transform duration-200 hover:scale-150 cursor-pointer"
                        onClick={() => handleImageClick(`${baseURL}/${unit.serial_number_image}`)}
                      />
                    )}
                  </td>

                  <td className="px-4 py-2 text-center font-semibold text-xl">
                    {isEditing && editUnitIndex === index ? (
                      <input
                        type="text"
                        value={editSerialNumber}
                        onChange={(e) => setEditSerialNumber(e.target.value)}
                        className="border rounded-md px-2 py-1 text-center"
                      />
                    ) : (
                      unit.serial_number
                    )}
                  </td>

                  <td className="px-4 py-2 text-center">{unit.status}</td>

                  <td className="px-4 py-2  gap-4">
                    {isEditing && editUnitIndex === index ? (
                      <div className="items-center flex justify-center gap-4">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleUpdateUnit(unit._id)}
                        >
                          Save
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="items-center flex justify-center gap-4">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleEditClick(index, unit.serial_number)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteUnit(unit._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="relative">
              <img src={modalImage} alt="Modal" className="max-w-full max-h-screen" />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-2xl bg-red-500 rounded-full p-2"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmationDialog
          title="Confirm Deletion"
          message={`Are you sure you want to delete this unit?`}
          onConfirm={confirmDeleteUnit}
          onCancel={cancelDeleteUnit}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default UnitsTable;
