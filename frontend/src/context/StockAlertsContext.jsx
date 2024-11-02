import React, { createContext, useState, useContext } from 'react';

const StockAlertsContext = createContext();

export const useStockAlerts = () => {
  return useContext(StockAlertsContext);
};

export const StockAlertsProvider = ({ children }) => {
  const [stockAlerts, setStockAlerts] = useState({
    LOW: false,
    HIGH: false,
    OUT_OF_STOCK: false,
  });

  return (
    <StockAlertsContext.Provider value={{ stockAlerts, setStockAlerts }}>
      {children}
    </StockAlertsContext.Provider>
  );
};
