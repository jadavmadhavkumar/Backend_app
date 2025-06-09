# Food Delivery App

A full-stack mobile food delivery application built with React Native and Node.js.

## Features

### User App
- User registration and login with JWT authentication
- Browse restaurants with search and filtering
- View restaurant menus with categories
- Add items to cart and place orders
- Real-time order tracking
- User profile management
- Order history

### Backend
- RESTful APIs for all functionality
- JWT-based authentication
- MongoDB database with Mongoose
- Order workflow management
- User and restaurant management

## Tech Stack

### Frontend
- React Native with Expo
- React Navigation for routing
- Context API for state management
- Axios for API calls
- AsyncStorage for local data

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Project Structure

\`\`\`
food-delivery-app/
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
\`\`\`

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file with the following variables:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/fooddelivery
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
\`\`\`

4. Start MongoDB service on your machine

5. Seed the database with sample data:
\`\`\`bash
npm run seed
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Update the API base URL in `src/services/api.js`:
\`\`\`javascript
const BASE_URL = 'http://your-backend-url:5000/api';
\`\`\`

4. Start the Expo development server:
\`\`\`bash
npm start
\`\`\`

5. Use the Expo Go app on your phone or an emulator to run the app

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with search/filter)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Users
- `PUT /api/users/profile` - Update user profile

## Key Features Implementation

### Authentication
- JWT tokens stored in AsyncStorage
- Automatic token refresh
- Protected routes with auth middleware

### Real-time Order Tracking
- Polling mechanism for order status updates
- Visual progress indicator
- Estimated delivery time

### Cart Management
- Persistent cart storage
- Restaurant validation (can't mix items from different restaurants)
- Quantity management

### Search and Filtering
- Restaurant search by name and cuisine
- Menu filtering by category
- Rating and delivery time filters

## Future Enhancements

- Push notifications for order updates
- Google Maps integration for delivery tracking
- Payment gateway integration
- Admin dashboard for restaurant management
- Real-time chat with delivery driver
- Rating and review system
- Promotional codes and discounts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
