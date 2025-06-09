const express = require("express")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true },
    ).select("-password")

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
