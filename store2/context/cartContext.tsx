"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface BackgroundTShirt {
  url: string ;
  color: string | undefined;
}

interface CartItem {
  title: string;
  thumbnail: any;
  upload: any;
  price: number;
  color: string | undefined;
  id: any;
  quantity: number;
  side: string;
  is_active: boolean;
  backgroundTShirt: BackgroundTShirt;
  svgUrl: string | null;
}

interface CartContextProps {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  mergeLocalCart: () => void
}

const CartContext = createContext<CartContextProps | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const customerId = sessionStorage.getItem('customerId')
      if (customerId) {
        const userCart = localStorage.getItem(`cart_${customerId}`)
        if (userCart) {
          try {
            const parsedCart = JSON.parse(userCart)
            setCart(parsedCart.map((item: CartItem) => ({
              ...item,
              backgroundTShirt: item.backgroundTShirt || { url: '', color: '' }
            })))
          } catch (error) {
            console.error('Error parsing user cart:', error)
            setCart([])
          }
        }
      } else {
        const guestCart = localStorage.getItem('guest_cart')
        if (guestCart) {
          try {
            const parsedCart = JSON.parse(guestCart)
            setCart(parsedCart.map((item: CartItem) => ({
              ...item,
              backgroundTShirt: item.backgroundTShirt || { url: '', color: '' }
            })))
          } catch (error) {
            console.error('Error parsing guest cart:', error)
            setCart([])
          }
        }
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customerId = sessionStorage.getItem('customerId')
      const cartToSave = cart.map(item => ({
        ...item,
        backgroundTShirt: item.backgroundTShirt || { url: '', color: '' }
      }))
      if (customerId) {
        localStorage.setItem(`cart_${customerId}`, JSON.stringify(cartToSave))
      } else {
        localStorage.setItem('guest_cart', JSON.stringify(cartToSave))
      }
    }
  }, [cart])

  const mergeLocalCart = () => {
    if (typeof window !== 'undefined') {
      const customerId = sessionStorage.getItem('customerId')
      if (!customerId) return

      const guestCart = localStorage.getItem('guest_cart')
      const userCart = localStorage.getItem(`cart_${customerId}`)

      if (guestCart) {
        const guestCartItems: CartItem[] = JSON.parse(guestCart)
        const userCartItems: CartItem[] = userCart ? JSON.parse(userCart) : []

        const mergedCart = [...userCartItems]
        guestCartItems.forEach((guestItem) => {
          const existingItem = mergedCart.find((item) => item.id === guestItem.id)
          if (existingItem) {
            existingItem.quantity += guestItem.quantity
            existingItem.backgroundTShirt = guestItem.backgroundTShirt || existingItem.backgroundTShirt
          } else {
            mergedCart.push({
              ...guestItem,
              backgroundTShirt: guestItem.backgroundTShirt || { url: '', color: '' }
            })
          }
        })

        setCart(mergedCart)
        localStorage.setItem(`cart_${customerId}`, JSON.stringify(mergedCart))
        localStorage.removeItem('guest_cart')
      }
    }
  }

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    if (typeof window !== 'undefined') {
      const customerId = sessionStorage.getItem('customerId')
      if (customerId) {
        localStorage.removeItem(`cart_${customerId}`)
      } else {
        localStorage.removeItem('guest_cart')
      }
    }
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
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}