import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [activeButton, setActiveButton] = useState('profile');

    return (
        <AppContext.Provider value={{ activeButton, setActiveButton }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
