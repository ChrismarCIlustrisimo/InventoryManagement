
import { useAdminTheme } from "../context/AdminThemeContext";
import React, { useRef, useState } from 'react';

const DateModal = ({ startDate, endDate, setStartDate, setEndDate, closeModal }) => {
  const { darkMode } = useAdminTheme();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData); // Set the captured image to state
  };


  return (
      <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${darkMode ? "text-light-textPrimary" : "dark:text-dark-textPrimary"}`}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h2 className="text-lg font-semibold mb-4">Select Dates</h2>
              <div className="mb-4">
                  <label className="block mb-1">Start Date:</label>
                  <input
                      type="date"
                      value={startDate || ''} // Use empty string if startDate is null
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                  />
              </div>
              <div className="mb-4">
                  <label className="block mb-1">End Date:</label>
                  <input
                      type="date"
                      value={endDate || ''} // Use empty string if endDate is nullm 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-gray-300 rounded p-2 w-full"
                  />
              </div>

              <div>
            <button onClick={startCamera}>Open Camera</button>
            <video ref={videoRef} autoPlay style={{ width: '200px' }}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }} width="200" height="150"></canvas>
            <button onClick={captureImage}>Capture Image</button>
            {capturedImage && (
                <div>
                    <h3>Captured Image:</h3>
                    <img src={capturedImage} alt="Captured" style={{ width: '200px', height: 'auto' }} />
                </div>
            )}
        </div>
              <div className="flex justify-end">
                  <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Close
                  </button>
              </div>
          </div>
      </div>
  );
};

export default DateModal;
