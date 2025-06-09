const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const restaurantRoutes = require("./routes/restaurants")
const orderRoutes = require("./routes/orders")
const userRoutes = require("./routes/users")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fooddelivery", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err)
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/restaurants", restaurantRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
  res.json({ message: "Food Delivery API is running!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
