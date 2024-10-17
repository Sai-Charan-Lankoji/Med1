'use client'

import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { FaUserCircle, FaShoppingCart } from "react-icons/fa"
import navlogoS from "../../public/navlogoS.png";
import { useCart } from "@/context/cartContext"
import { MdDeleteForever } from "react-icons/md"
import { useUserContext } from "@/context/userContext"
import { useCustomerLogout } from "../hooks/useCustomerLogout"
import { useRouter } from "next/navigation"

const Navbar: React.FC = () => {
  const { cart, removeFromCart } = useCart()
  const { email,  customerToken } = useUserContext() // Access customerToken here
  const { logout } = useCustomerLogout()
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCartItemsCount(totalItems)
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setCartTotal(total)
  }, [cart])

  const handleCartClick = () => {
    setIsCartOpen((prevState) => !prevState)
    setIsProfileOpen(false)
  }

  const handleProfileClick = () => {
    setIsProfileOpen((prevState) => !prevState)
    setIsCartOpen(false)
  }

  const handleLogout = () => {  
    setIsCartOpen(false)
    setIsProfileOpen(false)
    logout()
  }

  const handleViewCart = () => {
    if (!customerToken) { 
      router.push("/auth")
    } else {
      router.push("/cart")
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.cart-dropdown') && !target.closest('.profile-dropdown')) {
        setIsCartOpen(false)
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white backdrop-blur-sm bg-opacity-90 fixed w-full top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={navlogoS}
                alt="Logo"
                className="h-20 w-auto transition-transform duration-200 hover:scale-105"
                height={60}
                width={60}
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-gray-700">
              Customized Baseball Jersey Design
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {email ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                Logout
              </button>
            ) : (
              <Link
                href="./auth"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:from-blue-600 hover:to-purple-600 transition duration-200 ease-in-out shadow-md"
              >
                LogIn / SignUp
              </Link>
            )}

            <div className="relative profile-dropdown">
              <button 
                onClick={handleProfileClick}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <FaUserCircle className="text-2xl text-gray-700" />
                {email && (
                  <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[150px]">
                    {email}
                  </span>
                )}
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-1 transform opacity-100 scale-100 transition-all duration-200">
                  <Link 
                    href="./changepassword"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                  >
                    Change Password
                  </Link>
                </div>
              )}
            </div>

            <div className="relative cart-dropdown">
              <button 
                onClick={handleCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaShoppingCart className="text-2xl text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {isCartOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-200">
                  <div className="p-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Cart Items</h3>
                      {cart.length > 0 && (
                        <span className="text-lg font-bold text-green-600">${cartTotal.toFixed(2)}</span>
                      )}
                    </div>

                    {customerToken ? ( 
                      cart.length > 0 ? (
                        <div className="mt-4 max-h-[400px] overflow-y-auto">
                          <ul className="space-y-4">
                            {cart.map((item) => (
                              <li
                                key={item.id}
                                className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition duration-200"
                              >
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title}
                                  height={50}
                                  width={50}
                                  className="rounded-md object-cover h-16 w-16"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                  <p className="text-sm text-gray-500">{item.side}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 transition duration-200"
                                    title="Remove item"
                                  >
                                    <MdDeleteForever className="text-xl" />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="py-8 text-center text-gray-500">Your cart is empty</p>
                      )
                    ) : (
                      <p className="py-8 text-center text-gray-500">Please log in to view your cart</p>
                    )}

                    <button 
                      onClick={handleViewCart}
                      className="mt-4 w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition duration-200 flex items-center justify-center space-x-2 shadow-md"
                    >
                      <span>View Cart</span>
                      {cartTotal > 0 && (
                        <span className="font-semibold">(${cartTotal.toFixed(2)})</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
