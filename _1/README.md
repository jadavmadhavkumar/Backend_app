# Food Delivery App with Supabase

A full-stack mobile food delivery application built with React Native and Supabase backend.

## Features

### User App
- User registration and login with Supabase Auth
- Browse restaurants with search and filtering
- View restaurant menus with categories
- Add items to cart and place orders
- Real-time order tracking with Supabase Realtime
- User profile management
- Order history

### Backend (Supabase)
- PostgreSQL database with Row Level Security
- Real-time subscriptions for order updates
- User authentication and authorization
- Optimized queries with proper indexing
- Database functions for complex operations

## Tech Stack

### Frontend
- React Native with Expo
- React Navigation for routing
- Context API for state management
- Supabase client for backend integration
- AsyncStorage for local data

### Backend
- Supabase (PostgreSQL + Auth + Realtime)
- Row Level Security policies
- Database functions and triggers
- Real-time subscriptions

## Project Structure

\`\`\`
food-delivery-supabase/
├── scripts/
│   ├── 01-create-tables.sql
│   ├── 02-create-policies.sql
│   ├── 03-create-functions.sql
│   └── 04-seed-data.sql
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
    │   │   ├── restaurantService.js
    │   │   └── orderService.js
    │   └── lib/
    │       └── supabase.js
    ├── App.js
    └── package.json
\`\`\`

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. In your Supabase dashboard, go to the SQL Editor and run the scripts in order:
   - `01-create-tables.sql` - Creates all database tables
   - `02-create-policies.sql` - Sets up Row Level Security policies
   - `03-create-functions.sql` - Creates database functions and triggers
   - `04-seed-data.sql` - Adds sample restaurant data

3. Get your Supabase URL and anon key from Settings > API

### 2. Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Update the Supabase configuration in \`src/lib/supabase.js\`:
\`\`\`javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
\`\`\`

4. Start the Expo development server:
\`\`\`bash
npm start
\`\`\`

5. Use the Expo Go app on your phone or an emulator to run the app

## Database Schema

### Tables
- **users** - User profiles (extends Supabase auth.users)
- **restaurants** - Restaurant information and details
- **menu_items** - Menu items for each restaurant
- **orders** - Customer orders with status tracking
- **order_items** - Individual items within each order

### Key Features
- **Row Level Security** - Users can only access their own data
- **Real-time Updates** - Order status changes are pushed to clients
- **Optimized Queries** - Proper indexing for fast searches
- **Database Functions** - Server-side logic for complex operations

## Key Features Implementation

### Authentication
- Supabase Auth with email/password
- Automatic user profile creation via database triggers
- Row Level Security for data protection

### Real-time Order Tracking
- Supabase Realtime subscriptions for order updates
- Visual progress indicator
- Automatic UI updates when order status changes

### Search and Filtering
- Full-text search on restaurant names and cuisines
- Category-based filtering
- Rating and delivery time sorting

### Cart Management
- Persistent cart storage with AsyncStorage
- Restaurant validation (can't mix items from different restaurants)
- Quantity management with real-time totals

## Environment Variables

Create a \`.env\` file in the frontend directory:

\`\`\`
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Admin Features

To create an admin user:

1. Sign up normally through the app
2. In your Supabase dashboard, go to Authentication > Users
3. Find your user and note the UUID
4. In the SQL Editor, run:
\`\`\`sql
UPDATE users SET role = 'admin' WHERE id = 'your-user-uuid';
\`\`\`

Admin users can:
- View all orders
- Update order status
- Manage restaurants and menu items

## Real-time Features

The app uses Supabase Realtime for:
- Order status updates
- Live order tracking
- Automatic UI refreshes

## Security

- Row Level Security ensures users can only access their own data
- Admin-only operations are protected by role-based policies
- All database operations go through Supabase's secure API

## Future Enhancements

- Push notifications for order updates
- Google Maps integration for delivery tracking
- Payment gateway integration (Stripe)
- Image upload for restaurants and menu items
- Rating and review system
- Promotional codes and discounts
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
