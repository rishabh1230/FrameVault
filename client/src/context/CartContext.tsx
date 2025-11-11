import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Film } from '../types/Film';

// Define the type for an item in the cart
interface CartItem extends Film {
  quantity: number;
}

// Define the shape of the context
interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  addItemToCart: (film: Film) => void;
  removeItemFromCart: (filmId: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
}

// CRITICAL FIX: Define default functions so that destructuring doesn't fail 
// before the provider loads or if a component is rendered outside the provider.
const defaultContextValue: CartContextType = {
    cart: [],
    itemCount: 0,
    // Provide functions that do nothing, but satisfy the interface
    addItemToCart: () => {}, 
    removeItemFromCart: () => {},
    clearCart: () => {},
    placeOrder: () => {},
}

// Create the context using the default value
const CartContext = createContext<CartContextType>(defaultContextValue);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  // Optional check, but useful if we didn't set the default value correctly:
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItemToCart = (film: Film) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === film.id);
      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map((item) =>
          item.id === film.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Otherwise, add new item with quantity 1
        return [...prevCart, { ...film, quantity: 1 }];
      }
    });
  };

  const removeItemFromCart = (filmId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== filmId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = () => {
    // Using custom modal/notification instead of alert is recommended
    console.log('Order placed:', cart);
    alert(`Order placed successfully for ${itemCount} items!`);
    clearCart();
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    itemCount,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
