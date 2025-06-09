const express = require("express")
const Restaurant = require("../models/Restaurant")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all restaurants
router.get("/", async (req, res) => {
  try {
    const { search, cuisine, minRating, sortBy } = req.query
    const query = { isOpen: true }

    // Search functionality
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { cuisine: { $in: [new RegExp(search, "i")] } }]
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: [cuisine] }
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number.parseFloat(minRating) }
    }

    let restaurants = Restaurant.find(query)

    // Sorting
    if (sortBy === "rating") {
      restaurants = restaurants.sort({ rating: -1 })
    } else if (sortBy === "deliveryTime") {
      restaurants = restaurants.sort({ deliveryTime: 1 })
    } else {
      restaurants = restaurants.sort({ createdAt: -1 })
    }

    const result = await restaurants.exec()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }
    res.json(restaurant)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get restaurant menu
router.get("/:id/menu", async (req, res) => {
  try {
    const { category } = req.query
    const restaurant = await Restaurant.findById(req.params.id)

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    let menu = restaurant.menu.filter((item) => item.isAvailable)

    if (category) {
      menu = menu.filter((item) => item.category.toLowerCase() === category.toLowerCase())
    }

    res.json(menu)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create restaurant (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body)
    await restaurant.save()
    res.status(201).json(restaurant)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update restaurant (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    res.json(restaurant)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
