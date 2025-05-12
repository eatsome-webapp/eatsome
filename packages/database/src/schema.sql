-- Enable UUID extension for generating IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant staff (for user-restaurant relationship)
CREATE TABLE IF NOT EXISTS restaurant_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff', 'kitchen')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, user_id)
);

-- Menu categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tables (for dine-in service)
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  position_x FLOAT,
  position_y FLOAT,
  status TEXT CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')) NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id UUID REFERENCES restaurant_tables(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public user profiles for customers
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for new user signups
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Restaurant policies
CREATE POLICY "Users can view public restaurant data" 
ON restaurants FOR SELECT
USING (true);

CREATE POLICY "Staff can update their restaurant" 
ON restaurants FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM restaurant_staff
    WHERE restaurant_id = id
    AND user_id = auth.uid()
    AND role IN ('owner', 'manager')
  )
);

-- Restaurant staff policies
CREATE POLICY "Staff can view their restaurant's staff" 
ON restaurant_staff FOR SELECT
USING (
  restaurant_id IN (
    SELECT restaurant_id 
    FROM restaurant_staff
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners can manage staff" 
ON restaurant_staff FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM restaurant_staff
    WHERE restaurant_id = restaurant_id
    AND user_id = auth.uid()
    AND role = 'owner'
  )
);

-- Menu category policies
CREATE POLICY "Anyone can view menu categories" 
ON menu_categories FOR SELECT
USING (true);

CREATE POLICY "Staff can manage menu categories" 
ON menu_categories FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM restaurant_staff
    WHERE restaurant_id = menu_categories.restaurant_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'manager')
  )
);

-- Menu item policies
CREATE POLICY "Anyone can view menu items" 
ON menu_items FOR SELECT
USING (true);

CREATE POLICY "Staff can manage menu items" 
ON menu_items FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM restaurant_staff
    WHERE restaurant_id = menu_items.restaurant_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'manager')
  )
);

-- Table policies
CREATE POLICY "Staff can view and update tables" 
ON restaurant_tables FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM restaurant_staff
    WHERE restaurant_id = restaurant_tables.restaurant_id
    AND user_id = auth.uid()
  )
);

-- Order policies
CREATE POLICY "Customers can view their own orders" 
ON orders FOR SELECT
USING (
  customer_id = auth.uid()
);

CREATE POLICY "Staff can view restaurant orders" 
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM restaurant_staff
    WHERE restaurant_id = orders.restaurant_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Staff can update restaurant orders" 
ON orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM restaurant_staff
    WHERE restaurant_id = orders.restaurant_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Customers can create orders" 
ON orders FOR INSERT
WITH CHECK (
  customer_id = auth.uid()
);

-- Order item policies
CREATE POLICY "Customers can view their own order items" 
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE id = order_items.order_id
    AND customer_id = auth.uid()
  )
);

CREATE POLICY "Staff can view restaurant order items" 
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM orders
    JOIN restaurant_staff ON orders.restaurant_id = restaurant_staff.restaurant_id
    WHERE orders.id = order_items.order_id
    AND restaurant_staff.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own profile" 
ON profiles FOR ALL
USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT
USING (true); 