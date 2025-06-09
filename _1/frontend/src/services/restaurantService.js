import { supabase } from "../lib/supabase"

export const restaurantService = {
  // Get all restaurants with optional filters
  async getRestaurants(filters = {}) {
    try {
      const { search, cuisine, minRating, sortBy } = filters

      let query = supabase.from("restaurants").select("*").eq("is_open", true)

      // Apply search filter
      if (search) {
        query = query.or(`name.ilike.%${search}%,cuisine.cs.{${search}}`)
      }

      // Apply cuisine filter
      if (cuisine && cuisine !== "All") {
        query = query.contains("cuisine", [cuisine])
      }

      // Apply rating filter
      if (minRating) {
        query = query.gte("rating", minRating)
      }

      // Apply sorting
      if (sortBy === "rating") {
        query = query.order("rating", { ascending: false })
      } else if (sortBy === "delivery_time") {
        query = query.order("delivery_time", { ascending: true })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error fetching restaurants:", error)
      return { success: false, message: error.message }
    }
  },

  // Get restaurant by ID
  async getRestaurantById(id) {
    try {
      const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error fetching restaurant:", error)
      return { success: false, message: error.message }
    }
  },

  // Get menu items for a restaurant
  async getMenuItems(restaurantId, category = null) {
    try {
      let query = supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId).eq("is_available", true)

      if (category && category !== "All") {
        query = query.eq("category", category)
      }

      const { data, error } = await query.order("category").order("name")

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error fetching menu items:", error)
      return { success: false, message: error.message }
    }
  },

  // Get menu categories for a restaurant
  async getMenuCategories(restaurantId) {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("category")
        .eq("restaurant_id", restaurantId)
        .eq("is_available", true)

      if (error) {
        throw error
      }

      const categories = ["All", ...new Set(data.map((item) => item.category))]
      return { success: true, data: categories }
    } catch (error) {
      console.error("Error fetching menu categories:", error)
      return { success: false, message: error.message }
    }
  },
}
