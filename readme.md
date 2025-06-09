<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Food Delivery App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 2rem;
      line-height: 1.6;
      background-color: #f9f9f9;
      color: #333;
    }
    pre {
      background-color: #eee;
      padding: 1rem;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    ul {
      list-style: disc;
      margin-left: 2rem;
    }
    a {
      color: #2980b9;
      text-decoration: none;
    }
  </style>
</head>
<body>

<h1>🍽️ Food Delivery App</h1>
<p>A full-stack mobile food delivery application built with React Native and Node.js.</p>

<h2>🚀 Features</h2>

<h3>User App</h3>
<ul>
  <li>User registration and login with JWT authentication</li>
  <li>Browse restaurants with search and filtering</li>
  <li>View restaurant menus with categories</li>
  <li>Add items to cart and place orders</li>
  <li>Real-time order tracking</li>
  <li>User profile management</li>
  <li>Order history</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>RESTful APIs for all functionality</li>
  <li>JWT-based authentication</li>
  <li>MongoDB database with Mongoose</li>
  <li>Order workflow management</li>
  <li>User and restaurant management</li>
</ul>

<h2>🛠 Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>React Native with Expo</li>
  <li>React Navigation for routing</li>
  <li>Context API for state management</li>
  <li>Axios for API calls</li>
  <li>AsyncStorage for local data</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Node.js with Express</li>
  <li>MongoDB with Mongoose</li>
  <li>JWT for authentication</li>
  <li>bcryptjs for password hashing</li>
  <li>CORS for cross-origin requests</li>
</ul>

<h2>📁 Project Structure</h2>

<pre><code>food-delivery-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── screens/
    │   │   ├── LoginScreen.js
    │   │   ├── RegisterScreen.js
    │   │   ├── HomeScreen.js
    │   │   ├── RestaurantScreen.js
    │   │   ├── CartScreen.js
    │   │   ├── OrdersScreen.js
    │   │   ├── ProfileScreen.js
    │   │   └── OrderTrackingScreen.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── services/
    │   │   └── api.js
    │   └── store/
    │       └── store.js
    ├── App.js
    └── package.json
</code></pre>

<h2>⚙️ Setup Instructions</h2>

<h3>Backend Setup</h3>
<ol>
  <li>Navigate to the backend directory:
    <pre><code>cd backend</code></pre>
  </li>
  <li>Install dependencies:
    <pre><code>npm install</code></pre>
  </li>
  <li>Create a <code>.env</code> file with:
    <pre><code>
MONGODB_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
    </code></pre>
  </li>
  <li>Start MongoDB service on your machine</li>
  <li>Seed the database:
    <pre><code>npm run seed</code></pre>
  </li>
  <li>Start the server:
    <pre><code>npm run dev</code></pre>
    It will run at <code>http://localhost:5000</code>
  </li>
</ol>

<h3>Frontend Setup</h3>
<ol>
  <li>Navigate to the frontend directory:
    <pre><code>cd frontend</code></pre>
  </li>
  <li>Install dependencies:
    <pre><code>npm install</code></pre>
  </li>
  <li>Update API base URL in <code>src/services/api.js</code>:
    <pre><code>const BASE_URL = 'http://your-backend-url:5000/api';</code></pre>
  </li>
  <li>Start the Expo server:
    <pre><code>npm start</code></pre>
  </li>
  <li>Use Expo Go or an emulator to run the app</li>
</ol>

<h2>📡 API Endpoints</h2>

<h3>Authentication</h3>
<ul>
  <li>POST <code>/api/auth/register</code> - Register new user</li>
  <li>POST <code>/api/auth/login</code> - User login</li>
  <li>GET <code>/api/auth/me</code> - Get current user</li>
</ul>

<h3>Restaurants</h3>
<ul>
  <li>GET <code>/api/restaurants</code> - Get all restaurants</li>
  <li>GET <code>/api/restaurants/:id</code> - Get restaurant by ID</li>
  <li>GET <code>/api/restaurants/:id/menu</code> - Get restaurant menu</li>
</ul>

<h3>Orders</h3>
<ul>
  <li>POST <code>/api/orders</code> - Create new order</li>
  <li>GET <code>/api/orders/my-orders</code> - Get user's orders</li>
  <li>GET <code>/api/orders/:id</code> - Get order by ID</li>
  <li>PATCH <code>/api/orders/:id/status</code> - Update order status</li>
</ul>

<h3>Users</h3>
<ul>
  <li>PUT <code>/api/users/profile</code> - Update user profile</li>
</ul>

<h2>💡 Key Feature Implementations</h2>

<h3>Authentication</h3>
<ul>
  <li>JWT stored in AsyncStorage</li>
  <li>Automatic token refresh</li>
  <li>Protected routes via middleware</li>
</ul>

<h3>Real-time Order Tracking</h3>
<ul>
  <li>Polling for order updates</li>
  <li>Progress indicators</li>
  <li>ETA display</li>
</ul>

<h3>Cart Management</h3>
<ul>
  <li>Persistent cart</li>
  <li>Restaurant restriction</li>
  <li>Quantity control</li>
</ul>

<h3>Search & Filtering</h3>
<ul>
  <li>By name and cuisine</li>
  <li>Menu category filtering</li>
  <li>Rating and delivery filters</li>
</ul>

<h2>🔮 Future Enhancements</h2>
<ul>
  <li>Push notifications</li>
  <li>Google Maps tracking</li>
  <li>Online payments</li>
  <li>Admin dashboard</li>
  <li>Driver chat system</li>
  <li>Rating/review features</li>
  <li>Promo codes and discounts</li>
</ul>

<h2>🤝 Contributing</h2>
<ol>
  <li>Fork the repo</li>
  <li>Create a feature branch</li>
  <li>Make changes</li>
  <li>Test thoroughly</li>
  <li>Submit a pull request</li>
</ol>

<h2>📄 License</h2>
<p>This project is licensed under the <strong>MIT License</strong>.</p>

</body>
</html>
