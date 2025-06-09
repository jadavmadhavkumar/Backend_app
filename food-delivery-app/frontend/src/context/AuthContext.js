"use client"

import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token")
      const storedUser = await AsyncStorage.getItem("user")

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      const { token: newToken, user: newUser } = response.data

      await AsyncStorage.setItem("token", newToken)
      await AsyncStorage.setItem("user", JSON.stringify(newUser))

      setToken(newToken)
      setUser(newUser)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { token: newToken, user: newUser } = response.data

      await AsyncStorage.setItem("token", newToken)
      await AsyncStorage.setItem("user", JSON.stringify(newUser))

      setToken(newToken)
      setUser(newUser)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setToken(null)
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
