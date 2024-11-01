import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
export const ProductContext = createContext();

// Provider component
const ProductProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProductIndex = prevCart.findIndex(
                (item) => item.name === product.name && item.selling_price === product.selling_price
            );
    
            if (existingProductIndex > -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex].quantity += product.quantity; // Increase by the passed quantity
                return updatedCart;
            } else {
                return [...prevCart, { ...product, quantity: product.quantity }]; // Add new product with its quantity
            }
        });
    };
    
    
    

    const increaseQuantity = (index) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            if (updatedCart[index]) {
                updatedCart[index].quantity += 1; // Increase quantity by 1
            }
            return updatedCart;
        });
    };
    
    const decreaseQuantity = (index) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            if (updatedCart[index] && updatedCart[index].quantity > 1) {
                updatedCart[index].quantity -= 1; // Decrease quantity by 1 if more than 1
            }
            return updatedCart;
        });
    };
    
    
    
    const removeItem = (index) => {
      console.log("Removing item at index:", index); 
      setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };
  
    return (
        <ProductContext.Provider value={{ cart, setCart, addToCart, increaseQuantity, decreaseQuantity, removeItem }}>
            {children}
        </ProductContext.Provider>
    );
};

// Export a custom hook for easy access to the context
export const useProductContext = () => useContext(ProductContext);

export default ProductProvider;
