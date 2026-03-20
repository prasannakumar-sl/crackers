'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Cart hydrated from localStorage:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const quantityToAdd = product.quantity || 1;
      // Create a unique cart item ID for each addition to support duplicate items
      const cartItemId = `${product.id}-${Date.now()}-${Math.random()}`;
      return [...prevCart, { ...product, quantity: quantityToAdd, cartItemId }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      let price = 0;
      if (typeof item.price === 'number') {
        price = item.price;
      } else if (item.price) {
        price = parseFloat(item.price.replace('₹', ''));
      }
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.length;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    showCart,
    setShowCart,
    isHydrated,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
