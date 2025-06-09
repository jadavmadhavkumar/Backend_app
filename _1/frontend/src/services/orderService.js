import { supabase } from "../lib/supabase"

export const orderService = {
  // Create a new order
  async createOrder(orderData) {
    try {
      const { restaurantId, items, deliveryAddress, paymentMethod, notes } = orderData

      // Get restaurant details for delivery fee
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("delivery_fee")
        .eq("id", restaurantId)
        .single()

      if (restaurantError) {
        throw restaurantError
      }

      // Calculate totals
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const deliveryFee = restaurant.delivery_fee
      const tax = totalAmount * 0.08 // 8% tax
      const finalAmount = totalAmount + deliveryFee + tax

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id: restaurantId,
          total_amount: totalAmount,
          delivery_fee: deliveryFee,
          tax: tax,
          final_amount: finalAmount,
          delivery_address: deliveryAddress,
          payment_method: paymentMethod,
          notes: notes,
          estimated_delivery_time: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
        })
        .select()
        .single()

      if (orderError) {
        throw orderError
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        throw itemsError
      }

      return { success: true, data: order }
    } catch (error) {
      console.error("Error creating order:", error)
      return { success: false, message: error.message }
    }
  },

  // Get user's orders
  async getUserOrders(userId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          restaurants (
            id,
            name,
            image
          ),
          order_items (
            id,
            name,
            price,
            quantity
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error fetching user orders:", error)
      return { success: false, message: error.message }
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          restaurants (
            id,
            name,
            image,
            address,
            phone
          ),
          order_items (
            id,
            name,
            price,
            quantity
          )
        `)
        .eq("id", orderId)
        .single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error fetching order:", error)
      return { success: false, message: error.message }
    }
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId, status) {
    try {
      const updates = { status }

      if (status === "delivered") {
        updates.actual_delivery_time = new Date().toISOString()
      }

      const { data, error } = await supabase.from("orders").update(updates).eq("id", orderId).select().single()

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error updating order status:", error)
      return { success: false, message: error.message }
    }
  },

  // Subscribe to order updates
  subscribeToOrderUpdates(orderId, callback) {
    const subscription = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        callback,
      )
      .subscribe()

    return subscription
  },

  // Get all orders (admin only)
  async getAllOrders(filters = {}) {
    try {
      const { status, restaurant } = filters

      let query = supabase.from("orders").select(`
          *,
          users (
            id,
            name,
            phone
          ),
          restaurants (
            id,
            name
          )
        `)

      if (status) {
        query = query.eq("status", status)
      }

      if (restaurant) {
        query = query.eq("restaurant_id", restaurant)
      }

      query = query.order("created_at", { ascending: false })

      const { data, error } = await query

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error("Error fetching all orders:", error)
      return { success: false, message: error.message }
    }
  },
}
