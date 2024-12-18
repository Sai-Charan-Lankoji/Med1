{/*import { IDesign } from '@/@types/models';
import { nanoid } from 'nanoid';
import React, { createContext, useContext, useState, useEffect } from 'react';
//import { createCart } from '../app/hooks/useCart'
interface CartItem {
  designs: IDesign[];
  quantity: number;
  title: string;
  price: number;
  color: string;
}

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (designs: IDesign[]) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  mergeLocalCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const customerId = sessionStorage.getItem('customerId');
      if (customerId) {
        const userCart = localStorage.getItem(`cart_${customerId}`);
        if (userCart) {
          try {
            setCart(JSON.parse(userCart));
          } catch (error) {
            console.error('Error parsing user cart:', error);
            setCart([]);
          }
        }
      } else {
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) {
          try {
            setCart(JSON.parse(guestCart));
          } catch (error) {
            console.error('Error parsing guest cart:', error);
            setCart([]);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customerId = sessionStorage.getItem('customerId');
      if (customerId) {
        localStorage.setItem(`cart_${customerId}`, JSON.stringify(cart));
      } else {
        localStorage.setItem('guest_cart', JSON.stringify(cart));
      }
    }
  }, [cart]);

  //const addToCart = (designs: IDesign[]) => {
    //const newCartItem: CartItem = {
      designs: designs,
      quantity: 1,
      price: 100,  
      //email: sessionStorage.getItem('customerId'),
      //customer_id: sessionStorage.getItem('email')
    };
    // createCart(newCartItem, {
    //   onSuccess: (response) => {
     //   },
    //   onError: (err) => {
    //     console.error("Error creating apparel design:", err);
    //   },
    // });
     setCart(prevCart => [...prevCart, newCartItem]);
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      const customerId = sessionStorage.getItem('customerId');
      if (customerId) {
        localStorage.removeItem(`cart_${customerId}`);
      } else {
        localStorage.removeItem('guest_cart');
      }
    }
  };

  
  const mergeLocalCart = () => {
    // if (typeof window !== 'undefined') {
    //   const customerId = sessionStorage.getItem('customerId')
    //   if (!customerId) return

    //   const guestCart = localStorage.getItem('guest_cart')
    //   const userCart = localStorage.getItem(`cart_${customerId}`)

    //   if (guestCart) {
    //     const guestCartItems: CartItem[] = JSON.parse(guestCart)
    //     const userCartItems: CartItem[] = userCart ? JSON.parse(userCart) : []

    //     const mergedCart = [...userCartItems]
    //     guestCartItems.forEach((guestItem) => {
    //       const existingItem = mergedCart.find((item) => item.id === guestItem.id)
    //       if (existingItem) {
    //         existingItem.quantity += guestItem.quantity
    //         existingItem.backgroundTShirt = guestItem.backgroundTShirt || existingItem.backgroundTShirt
    //       } else {
    //         mergedCart.push({
    //           ...guestItem,
    //           backgroundTShirt: guestItem.backgroundTShirt || { url: '', color: '' }
    //         })
    //       }
    //     })

    //     setCart(mergedCart)
    //     localStorage.setItem(`cart_${customerId}`, JSON.stringify(mergedCart))
    //     localStorage.removeItem('guest_cart')
    //   }
    // }
  }

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      mergeLocalCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
*/}