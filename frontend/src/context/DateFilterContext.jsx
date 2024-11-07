// DateFilterContext.js
import React, { createContext, useState, useContext } from 'react';

const DateFilterContext = createContext();

export const useDateFilter = () => {
    return useContext(DateFilterContext);
};

export const DateFilterProvider = ({ children }) => {
    const [dateFilter, setDateFilter] = useState('');

    const handleDateFilterChange = (filter) => {
        setDateFilter(filter);
    };

    return (
        <DateFilterContext.Provider value={{ dateFilter, handleDateFilterChange }}>
            {children}
        </DateFilterContext.Provider>
    );
};
