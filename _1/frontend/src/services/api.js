import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const BASE_URL = "http://localhost:5000/api" // Change this to your backend URL

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
}

// Restaurant API
export const restaurantAPI = {
  getAll: (params = {}) => api.get("/restaurants", { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  getMenu: (id, category) =>
    api.get(`/restaurants/${id}/menu`, {
      params: category ? { category } : {},
    }),
}

// Order API
export const orderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
}

// User API
export const userAPI = {
  updateProfile: (userData) => api.put("/users/profile", userData),
}

export default api
