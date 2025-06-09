"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [restaurant, setRestaurant] = useState(null)

  useEffect(() => {
    loadCart()
  }, [])

  useEffect(() => {
    saveCart()
  }, [cartItems, restaurant])

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart")
      const storedRestaurant = await AsyncStorage.getItem("cartRestaurant")

      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
      if (storedRestaurant) {
        setRestaurant(JSON.parse(storedRestaurant))
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cartItems))
      if (restaurant) {
        await AsyncStorage.setItem("cartRestaurant", JSON.stringify(restaurant))
      }
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  const addToCart = (item, restaurantInfo) => {
    // If adding from a different restaurant, clear cart
    if (restaurant && restaurant._id !== restaurantInfo._id) {
      setCartItems([])
      setRestaurant(restaurantInfo)
    } else if (!restaurant) {
      setRestaurant(restaurantInfo)
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem._id === item._id)

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item._id !== itemId)
      if (updatedItems.length === 0) {
        setRestaurant(null)
      }
      return updatedItems
    })
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item._id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
    setRestaurant(null)
    AsyncStorage.removeItem("cart")
    AsyncStorage.removeItem("cartRestaurant")
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    restaurant,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
