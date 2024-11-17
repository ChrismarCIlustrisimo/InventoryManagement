import React from 'react';
import { useAdminTheme } from "../context/AdminThemeContext";

const PendingRMARequests = ({ rmaRequests }) => {
  const { darkMode } = useAdminTheme();

  const getStatusStyles = (status) => {
    let statusStyles = {
      textClass: 'text-[#8E8E93]',
      bgClass: 'bg-[#E5E5EA]',
    };

    // Only handle 'Pending' and 'In Progress' statuses
    switch (status) {
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
    }

    return statusStyles;
  };

  const filteredRMARequests = rmaRequests
    .filter((item) => item.status === 'Pending' || item.status === 'In Progress')
    .slice(0, 5);

    function shortenText(text, maxLength) {
      if (text.length <= maxLength) {
        return text; // Return the original text if it's within the max length
      }
      return text.substring(0, maxLength) + '...'; // Shorten the text and add ellipsis
    }

  return (
    <div className='w-[35%] h-full flex gap-4'>
      <div className={`border border-gray-200 rounded-lg shadow-lg w-full h-full ${darkMode ? 'bg-light-container' : 'dark:bg-dark-container'}`}>
        <div className='w-full px-4 py-2 flex items-center justify-start'>
          <h2 className={`font-semibold text-lg ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`}>Pending RMA Requests</h2>
        </div>
        <div className={`w-full p-2 flex items-center justify-center h-[90%] rounded-lg ${darkMode ? 'bg-light-container text-light-textPrimary' : 'bg-dark-container text-dark-textPrimary'}`}>
          <table className='h-[100%] w-[100%]'>
          <thead>
            <tr>
              <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>
                Product Name
              </th>
              <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>
                Customer Name
              </th>
              <th className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className={`overflow-auto`}>
              {filteredRMARequests.length > 0 ? (
                filteredRMARequests.map((item, index) => (
                  <tr key={index}>
                    <td className={`text-center border-b ${darkMode ? 'border-light-border' : 'border-dark-border'}`}>
                      {shortenText(item.product, 20)} {/* Shorten product name */}
                    </td>
                    <td className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>
                      {shortenText(item.customer_name, 20)} {/* Shorten customer name */}
                    </td>
                    <td className={`text-center border-b-2 ${darkMode ? 'border-light-border' : 'border-dark-border'} py-2`}>
                      <span className={`${getStatusStyles(item.status).textClass} ${getStatusStyles(item.status).bgClass} py-1 px-3 rounded-md`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={`py-4 ${filteredRMARequests.length === 1 ? 'text-left' : 'text-center'}`}>
                    No Pending or In Progress RMA Requests.
                  </td>
                </tr>
              )}
            </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default PendingRMARequests;
