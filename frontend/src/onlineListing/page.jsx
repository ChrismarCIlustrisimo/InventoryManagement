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
                (item) => item.name === product.name && item.selling_price === product.selling_price // Add more conditions if necessary
            );

            if (existingProductIndex > -1) {
                // If product exists, increase its quantity
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex].quantity += 1; // Increase quantity by 1
                return updatedCart;
            } else {
                // If not, add the product with quantity 1
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const increaseQuantity = (index) => {
      setCart((prevCart) => {
          const updatedCart = [...prevCart]; // Create a new array from the previous state
          if (updatedCart[index]) {
              updatedCart[index].quantity += 1; // Increase quantity by 1 if the item exists
          }
          return updatedCart; // Return the updated cart
      });
  };
  
    const decreaseQuantity = (index) => {
        setCart((prevCart) => {
            const updatedCart = [...prevCart];
            if (updatedCart[index].quantity > 1) {
                updatedCart[index].quantity -= 1;
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
