import React, { createContext, useState, useContext } from 'react';

// Create the context
export const ProductContext = createContext();

// Provider component
const ProductProvider = ({ children }) => {
      const demoProducts = [
            { id: 1, name: 'Logitech G502 HERO Gaming Mouse', price: 2995, image: '/path-to-image/mouse.jpg' },
            { id: 2, name: 'Razer BlackWidow V3 Mechanical Keyboard', price: 6495, image: '/path-to-image/keyboard.jpg' },
            { id: 3, name: 'MSI Optix MAG271CQR Gaming Monitor', price: 23995, image: '/path-to-image/monitor.jpg' },
      ];

      const [cart, setCart] = useState([]);

      const addToCart = (product) => {
            setCart((prevCart) => [...prevCart, product]);
      };

      return (
            <ProductContext.Provider value={{ demoProducts, cart, addToCart }}>
                  {children}
            </ProductContext.Provider>
      );
};

// Export a custom hook for easy access to the context
export const useProductContext = () => useContext(ProductContext);

export default ProductProvider;
