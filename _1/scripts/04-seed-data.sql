-- Insert sample restaurants
INSERT INTO restaurants (id, name, description, image, cuisine, rating, total_ratings, delivery_time, delivery_fee, minimum_order, address) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Mario''s Italian Kitchen',
  'Authentic Italian cuisine with fresh ingredients',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
  ARRAY['Italian', 'Pizza', 'Pasta'],
  4.5,
  150,
  '25-35 mins',
  2.99,
  15.00,
  '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "coordinates": {"latitude": 40.7128, "longitude": -74.006}}'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Spice Garden',
  'Authentic Indian and Asian fusion',
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
  ARRAY['Indian', 'Asian', 'Curry'],
  4.3,
  89,
  '30-40 mins',
  3.49,
  20.00,
  '{"street": "456 Oak Ave", "city": "New York", "state": "NY", "zipCode": "10002", "coordinates": {"latitude": 40.7589, "longitude": -73.9851}}'::jsonb
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Burger Palace',
  'Gourmet burgers and American classics',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
  ARRAY['American', 'Burgers', 'Fast Food'],
  4.1,
  203,
  '20-30 mins',
  2.49,
  12.00,
  '{"street": "789 Burger Blvd", "city": "New York", "state": "NY", "zipCode": "10003", "coordinates": {"latitude": 40.7505, "longitude": -73.9934}}'::jsonb
);

-- Insert menu items for Mario's Italian Kitchen
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_vegetarian) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Margherita Pizza', 'Fresh tomatoes, mozzarella, basil', 16.99, 'Pizza', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300', true),
('550e8400-e29b-41d4-a716-446655440001', 'Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 18.99, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', false),
('550e8400-e29b-41d4-a716-446655440001', 'Spaghetti Carbonara', 'Creamy pasta with bacon and parmesan', 14.99, 'Pasta', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300', false),
('550e8400-e29b-41d4-a716-446655440001', 'Caesar Salad', 'Crisp romaine lettuce with caesar dressing', 9.99, 'Salads', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300', true),
('550e8400-e29b-41d4-a716-446655440001', 'Fettuccine Alfredo', 'Rich and creamy alfredo sauce with fettuccine', 13.99, 'Pasta', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300', true),
('550e8400-e29b-41d4-a716-446655440001', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 7.99, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300', true);

-- Insert menu items for Spice Garden
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_vegetarian) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Chicken Tikka Masala', 'Tender chicken in creamy tomato sauce', 15.99, 'Main Course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300', false),
('550e8400-e29b-41d4-a716-446655440002', 'Vegetable Biryani', 'Fragrant basmati rice with mixed vegetables', 13.99, 'Rice', 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300', true),
('550e8400-e29b-41d4-a716-446655440002', 'Samosas (4 pieces)', 'Crispy pastries filled with spiced potatoes', 6.99, 'Appetizers', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', true),
('550e8400-e29b-41d4-a716-446655440002', 'Butter Chicken', 'Creamy tomato-based curry with tender chicken', 16.99, 'Main Course', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300', false),
('550e8400-e29b-41d4-a716-446655440002', 'Naan Bread', 'Fresh baked Indian flatbread', 3.99, 'Sides', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', true),
('550e8400-e29b-41d4-a716-446655440002', 'Mango Lassi', 'Sweet yogurt drink with mango', 4.99, 'Beverages', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', true);

-- Insert menu items for Burger Palace
INSERT INTO menu_items (restaurant_id, name, description, price, category, image, is_vegetarian) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Classic Cheeseburger', 'Beef patty with cheese, lettuce, tomato', 12.99, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', false),
('550e8400-e29b-41d4-a716-446655440003', 'Chicken Deluxe', 'Grilled chicken breast with avocado', 13.99, 'Burgers', 'https://images.unsplash.com/photo-1606755962773-d324e9a13086?w=300', false),
('550e8400-e29b-41d4-a716-446655440003', 'Sweet Potato Fries', 'Crispy sweet potato fries with aioli', 5.99, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', true),
('550e8400-e29b-41d4-a716-446655440003', 'Veggie Burger', 'Plant-based patty with fresh vegetables', 11.99, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', true),
('550e8400-e29b-41d4-a716-446655440003', 'Onion Rings', 'Crispy beer-battered onion rings', 4.99, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', true),
('550e8400-e29b-41d4-a716-446655440003', 'Chocolate Milkshake', 'Rich chocolate milkshake with whipped cream', 5.99, 'Beverages', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', true);

-- Create an admin user (you'll need to sign up with this email first)
-- This will be updated after the user signs up
-- INSERT INTO users (id, name, role) VALUES 
-- ('your-admin-user-id', 'Admin User', 'admin');
