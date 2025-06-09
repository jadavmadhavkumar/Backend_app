const mongoose = require("mongoose")
const Restaurant = require("../models/Restaurant")
const User = require("../models/User")

const seedData = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/fooddelivery")

    // Clear existing data
    await Restaurant.deleteMany({})
    await User.deleteMany({})

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@fooddelivery.com",
      password: "admin123",
      phone: "+1234567890",
      role: "admin",
    })
    await adminUser.save()

    // Sample restaurants data
    const restaurants = [
      {
        name: "Mario's Italian Kitchen",
        description: "Authentic Italian cuisine with fresh ingredients",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
        cuisine: ["Italian", "Pizza", "Pasta"],
        rating: 4.5,
        totalRatings: 150,
        deliveryTime: "25-35 mins",
        deliveryFee: 2.99,
        minimumOrder: 15,
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          coordinates: { latitude: 40.7128, longitude: -74.006 },
        },
        menu: [
          {
            name: "Margherita Pizza",
            description: "Fresh tomatoes, mozzarella, basil",
            price: 16.99,
            category: "Pizza",
            image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300",
            isVegetarian: true,
          },
          {
            name: "Pepperoni Pizza",
            description: "Classic pepperoni with mozzarella cheese",
            price: 18.99,
            category: "Pizza",
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300",
          },
          {
            name: "Spaghetti Carbonara",
            description: "Creamy pasta with bacon and parmesan",
            price: 14.99,
            category: "Pasta",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300",
          },
          {
            name: "Caesar Salad",
            description: "Crisp romaine lettuce with caesar dressing",
            price: 9.99,
            category: "Salads",
            image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300",
            isVegetarian: true,
          },
        ],
      },
      {
        name: "Spice Garden",
        description: "Authentic Indian and Asian fusion",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
        cuisine: ["Indian", "Asian", "Curry"],
        rating: 4.3,
        totalRatings: 89,
        deliveryTime: "30-40 mins",
        deliveryFee: 3.49,
        minimumOrder: 20,
        address: {
          street: "456 Oak Ave",
          city: "New York",
          state: "NY",
          zipCode: "10002",
          coordinates: { latitude: 40.7589, longitude: -73.9851 },
        },
        menu: [
          {
            name: "Chicken Tikka Masala",
            description: "Tender chicken in creamy tomato sauce",
            price: 15.99,
            category: "Main Course",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300",
          },
          {
            name: "Vegetable Biryani",
            description: "Fragrant basmati rice with mixed vegetables",
            price: 13.99,
            category: "Rice",
            image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300",
            isVegetarian: true,
          },
          {
            name: "Samosas (4 pieces)",
            description: "Crispy pastries filled with spiced potatoes",
            price: 6.99,
            category: "Appetizers",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300",
            isVegetarian: true,
          },
        ],
      },
      {
        name: "Burger Palace",
        description: "Gourmet burgers and American classics",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
        cuisine: ["American", "Burgers", "Fast Food"],
        rating: 4.1,
        totalRatings: 203,
        deliveryTime: "20-30 mins",
        deliveryFee: 2.49,
        minimumOrder: 12,
        address: {
          street: "789 Burger Blvd",
          city: "New York",
          state: "NY",
          zipCode: "10003",
          coordinates: { latitude: 40.7505, longitude: -73.9934 },
        },
        menu: [
          {
            name: "Classic Cheeseburger",
            description: "Beef patty with cheese, lettuce, tomato",
            price: 12.99,
            category: "Burgers",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
          },
          {
            name: "Chicken Deluxe",
            description: "Grilled chicken breast with avocado",
            price: 13.99,
            category: "Burgers",
            image: "https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=300",
          },
          {
            name: "Sweet Potato Fries",
            description: "Crispy sweet potato fries with aioli",
            price: 5.99,
            category: "Sides",
            image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300",
            isVegetarian: true,
          },
        ],
      },
    ]

    await Restaurant.insertMany(restaurants)
    console.log("Sample data seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
