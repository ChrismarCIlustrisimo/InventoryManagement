import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackOutline } from "react-icons/io5";
import axios from "axios";
import { useAdminTheme } from '../context/AdminThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { API_DOMAIN } from '../utils/constants';
import SearchBar from '../components/adminSearchBar';

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
  const baseURL = API_DOMAIN;
  const { darkMode } = useAdminTheme();
  const [editStatus, setEditStatus] = useState("");
  const { user } = useAuthContext();
  const [filteredUnits, setFilteredUnits] = useState([]); // New state for filtered units
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
  const [productID, setProductID] = useState(null);

  const handleSearchChange = (newQuery) => {
    setSearchTerm(newQuery);
  };

  // Effect to filter units based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUnits(units);
    } else {
      setFilteredUnits(
        units.filter(unit =>
          unit.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by serial number
        )
      );
    }
  }, [searchTerm, units]);


  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${baseURL}/product/${productId}`);
        const inStockUnits = response.data.units.filter(unit => unit.status === 'in_stock');
        setUnits(response.data.units);
        setProductName(response.data.name);
        setProductID(response.data.product_id);
      } catch (error) {
        console.error("Error fetching product units:", error.message);
      }
    };
    fetchUnits();
  }, [productId]);

  const handleBackClick = (num) => {
    navigate(num);
  };

  const handleEditClick = (index) => { 
    setEditUnitIndex(index);
    setEditSerialNumber(units[index].serial_number);
    setEditStatus(units[index].status);
    setIsEditing(true);
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
      // Find the unit being deleted
      const deletedUnit = units.find(unit => unit._id === unitToDelete);
  
      // Proceed with the delete request
      const response = await axios.delete(`${baseURL}/product/${productId}/unit/${unitToDelete}`);
      if (response.status === 200) {
        // Remove the deleted unit from the state
        setUnits(units.filter(unit => unit._id !== unitToDelete));
        toast.success("Unit deleted successfully!");
  
        // Log the audit event
        const auditData = {
          user: user.name, // Replace `user.name` with the actual user context if necessary
          action: 'Delete',
          module: 'Product Units',
          event: `Deleted unit from product ${productId}`,
          previousValue: {
            serial_number: {
              previous: deletedUnit.serial_number,
            },
          },
          updatedValue: null, // No updated value for deletion
        };
  
        await axios.post(`${baseURL}/audit`, auditData);
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
    setLoading(true); // Start loading when the update begins
    const formData = new FormData();
    formData.append("serial_number", editSerialNumber);
    formData.append("status", editStatus);
  
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
  
        // Find the previous unit data
        const previousUnit = units.find(unit => unit._id === unitId);
  
        // Build previous and updated values dynamically
        const changes = {};
        if (previousUnit.serial_number !== updatedUnit.serial_number) {
          changes.serial_number = {
            previous: previousUnit.serial_number,
            updated: updatedUnit.serial_number,
          };
        }
        if (previousUnit.status !== updatedUnit.status) {
          changes.status = {
            previous: previousUnit.status,
            updated: updatedUnit.status,
          };
        }
        if (editImageFile) {
          changes.serial_number_image = {
            previous: "N/A",
            updated: "N/A",
          };
        }
  
        // Log audit event
        const auditData = {
          user: user.name, // Replace with actual user context
          action: 'Update',
          module: 'Product Units',
          event: `Updated unit in product ${productID}`,
          previousValue: Object.keys(changes).reduce((acc, key) => {
            acc[key] = { previous: changes[key].previous };
            return acc;
          }, {}),
          updatedValue: Object.keys(changes).reduce((acc, key) => {
            acc[key] = { updated: changes[key].updated };
            return acc;
          }, {}),
        };
  
        await axios.post(`${baseURL}/audit`, auditData);
  
        // Update state with new unit data
        const updatedUnits = units.map((unit) => {
          if (unit._id === updatedUnit._id) {
            return {
              ...unit,
              serial_number: updatedUnit.serial_number,
              serial_number_image: updatedUnit.serial_number_image,
              status: updatedUnit.status,
            };
          }
          return unit;
        });
  
        setUnits(updatedUnits);
        setIsEditing(false);
        setEditUnitIndex(null);
        setEditSerialNumber("");
        setEditImageFile(null);
        setEditStatus("");
        toast.success("Unit updated successfully!");
      } else {
        console.error('Error updating unit: Unexpected response code', response.status);
        toast.error("Error updating unit.");
      }
    } catch (error) {
      console.error("Error updating unit:", error.response ? error.response.data : error.message);
      toast.error("Error updating unit.");
    } finally {
      setLoading(false); // Stop loading when the process ends
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

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((error) => {
          console.error("Error accessing camera: ", error);
        });
    }
  };

  const captureImage = () => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
        setEditImageFile(file);
      });
    } else {
      console.error("Video not ready for capturing");
    }
  };
  

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${baseURL}/product/${productId}`);
        const inStockUnits = response.data.units.filter(unit => unit.status === 'in_stock');
        setUnits(response.data.units);
        setProductName(response.data.name);
      } catch (error) {
        console.error("Error fetching product units:", error.message);
      }
    };
    fetchUnits();
  }, [productId]);





  
  // ConfirmationDialog component
const ConfirmationDialog = ({ title, message, onConfirm, onCancel, darkMode }) => (
  <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50`}>
    <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'text-dark-textPrimary bg-dark-container' : 'text-light-textPrimary bg-light-container'}`}>
      <p className="text-lg mb-4">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onConfirm}
          className={`w-[46%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-dark-textPrimary hover:bg-dark-primary'}`}
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
        <div className="w-full flex items-center justify-between px-24 py-6">
          <h1 className="text-3xl font-bold">{productName}</h1>

          <div className="flex gap-4">
          <SearchBar 
            query={searchTerm}
            onQueryChange={handleSearchChange}
            placeholderMessage="Search by Serial Number"
          />
          <button className={`${darkMode ? 'bg-light-button' : 'bg-dark-textSecondary'} text-white px-4 py-2 rounded`} onClick={() => handleBackClick(-1)}>Back to Description</button>


          </div>
        </div>
        <div className="w-[90%] h-[84%] overflow-y-auto border border-gray-200 shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-300' : 'bg-dark-textSecondary'}`}>
              <tr>
                <th className="px-4 py-2 text-center">Unit ID</th>
                <th className="px-4 py-2 text-center">Image</th>
                <th className="px-4 py-2 text-center">Serial Number</th>
                <th className="px-4 py-2 text-center">Status</th>
                {user.role === 'admin' ? '' : <th className="px-4 py-2 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUnits.map((unit, index) => (
                <tr key={unit._id}   className={`${
                  index % 2 === 0
                    ? darkMode ? 'bg-light-container' : 'bg-dark-container'
                    : darkMode ? 'bg-gray-100' : 'bg-light-textSecondary'
                }`}
              >
                  <td className="px-4 py-2 text-center">{unit.unit_id}</td>
                  <td className="px-4 py-2 flex items-center justify-center">
                    {editUnitIndex === index ? (
                      <div>
                          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
                          
                          {editImageFile ? (
                            <img src={URL.createObjectURL(editImageFile)} alt="Captured" className="mt-4" width="320" height="240" />
                          ) : (
                            <video ref={videoRef} width="320" height="240" className="mt-4 border-2 border-dashed" />
                          )}
                          <div className="w-auto flex gap-2  items-center justify-between mt-2">
                            <button onClick={captureImage} className="bg-green-500 text-white p-2 rounded-md w-[50%] hover:scale-110 transition-transform duration-200">Capture Image</button>
                            <button onClick={startCamera} className="bg-blue-500 text-white p-2 rounded-md w-[50%] hover:scale-110 transition-transform duration-200">Open Camera</button>
                          </div>
                        </div>

                    ) : (
                        <img
                          src={unit.serial_number_image}
                          alt={`Unit ${index + 1}`}
                          className="h-16 w-16 transform transition-transform duration-300 hover:scale-110 rounded-md"
                          onClick={() => handleImageClick(unit.serial_number_image)}
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

                  <td className="px-4 py-2 text-center">
                  {isEditing && editUnitIndex === index ? ( 
                        <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="border"
                      >
                        <option value="">Select Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="sold">Sold</option>
                        <option value="reserved">Reserved</option>
                        <option value="rma">RMA</option>

                      </select>
                    ) : (
                    unit.status
                   )}
                  </td>

                  {user.role === 'admin' ? '' : <td className="px-4 py-2  gap-4">
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
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="relative">
              <img src={modalImage} alt="Modal" className="max-w-full max-h-screen rounded-md" />
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

  {loading && ( 
      <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50`}>
        <div className={`p-6 rounded-md shadow-lg w-full max-w-sm ${darkMode ? 'text-light-textPrimary bg-light-container' : 'text-dark-textPrimary bg-dark-container'}`}>
          <div className="flex justify-center items-center gap-2">
            {/* Moving Loading Animation */}
            <div className="relative w-8 h-8">
              <div className="absolute w-full h-full rounded-full border-4 border-t-4 border-white border-t-light-primary animate-spin"></div>
            </div>
            <span className={`${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Please wait while the unit are being updated...</span>
          </div>
        </div>
      </div>
    )}

      <ToastContainer />
    </div>
  );
};

export default UnitsTable;
