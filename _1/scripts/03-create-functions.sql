-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate order totals
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  subtotal DECIMAL := 0;
  delivery_fee DECIMAL := 0;
  tax_rate DECIMAL := 0.08;
  total DECIMAL := 0;
BEGIN
  -- Calculate subtotal from order items
  SELECT COALESCE(SUM(price * quantity), 0)
  INTO subtotal
  FROM order_items
  WHERE order_items.order_id = calculate_order_total.order_id;

  -- Get delivery fee from restaurant
  SELECT r.delivery_fee
  INTO delivery_fee
  FROM orders o
  JOIN restaurants r ON o.restaurant_id = r.id
  WHERE o.id = calculate_order_total.order_id;

  -- Calculate total
  total := subtotal + delivery_fee + (subtotal * tax_rate);

  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to search restaurants
CREATE OR REPLACE FUNCTION public.search_restaurants(
  search_term TEXT DEFAULT NULL,
  cuisine_filter TEXT DEFAULT NULL,
  min_rating DECIMAL DEFAULT NULL,
  sort_by TEXT DEFAULT 'created_at'
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  image TEXT,
  cuisine TEXT[],
  rating DECIMAL,
  total_ratings INTEGER,
  delivery_time TEXT,
  delivery_fee DECIMAL,
  minimum_order DECIMAL,
  address JSONB,
  is_open BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.description,
    r.image,
    r.cuisine,
    r.rating,
    r.total_ratings,
    r.delivery_time,
    r.delivery_fee,
    r.minimum_order,
    r.address,
    r.is_open,
    r.created_at
  FROM restaurants r
  WHERE 
    r.is_open = true
    AND (search_term IS NULL OR 
         r.name ILIKE '%' || search_term || '%' OR 
         EXISTS (SELECT 1 FROM unnest(r.cuisine) AS c WHERE c ILIKE '%' || search_term || '%'))
    AND (cuisine_filter IS NULL OR cuisine_filter = ANY(r.cuisine))
    AND (min_rating IS NULL OR r.rating >= min_rating)
  ORDER BY 
    CASE 
      WHEN sort_by = 'rating' THEN r.rating
      WHEN sort_by = 'delivery_time' THEN EXTRACT(EPOCH FROM INTERVAL r.delivery_time)
      ELSE EXTRACT(EPOCH FROM r.created_at)
    END DESC;
END;
$$ LANGUAGE plpgsql;
