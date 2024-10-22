import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const Searchbar = ({ query, onQueryChange, placeholderMessage }) => {

      const handleChange = (event) => {
            onQueryChange(event.target.value); // Call the function to update query in parent
      };

      const handleClear = () => {
            onQueryChange(''); // Clear the query in parent
      };

      return (
            <div className="w-[600px] bg-white text-light-primary flex items-center px-4 rounded-md bg-transparent  border-2 text-light-TEXT">
                  <input
                        type="text"
                        placeholder={placeholderMessage}
                        className="w-full text-sm bg-transparent py-[11px] outline-none"
                        value={query}
                        onChange={handleChange}
                  />
                  {query ? (
                        <IoMdClose className="text-light-ACCENT hover:text-white cursor-pointer" onClick={handleClear} />
                  ) : (
                        <FaSearch className="text-light-ACCENT hover:text-white cursor-pointer" />
                  )}
            </div>
      );
};

export default Searchbar;
