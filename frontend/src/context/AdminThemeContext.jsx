// AdminThemeContext.jsx
import React, { createContext, useContext, useState } from 'react';

export const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true); // Default is light mode

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AdminThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  return useContext(AdminThemeContext);
};
