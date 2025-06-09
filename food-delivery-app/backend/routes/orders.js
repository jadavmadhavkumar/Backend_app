const express = require("express")
const Order = require("../models/Order")
const Restaurant = require("../models/Restaurant")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Create new order
router.post("/", auth, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, notes } = req.body

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    // Calculate total amount
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const menuItem = restaurant.menu.id(item.menuItemId)
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item not found: ${item.menuItemId}` })
      }

      const orderItem = {
        menuItem: item.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      }

      orderItems.push(orderItem)
      totalAmount += menuItem.price * item.quantity
    }

    const deliveryFee = restaurant.deliveryFee
    const tax = totalAmount * 0.08 // 8% tax
    const finalAmount = totalAmount + deliveryFee + tax

    // Create order
    const order = new Order({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount,
      deliveryFee,
      tax,
      finalAmount,
      deliveryAddress,
      paymentMethod,
      notes,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    })

    await order.save()
    await order.populate("restaurant", "name image")

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user's orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("restaurant", "name image").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get order by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name image address phone")
      .populate("user", "name phone")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update order status (Admin only)
router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "delivered" && { actualDeliveryTime: new Date() }),
      },
      { new: true },
    ).populate("restaurant", "name")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all orders (Admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const { status, restaurant } = req.query
    const query = {}

    if (status) {
      query.status = status
    }

    if (restaurant) {
      query.restaurant = restaurant
    }

    const orders = await Order.find(query)
      .populate("user", "name phone")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
