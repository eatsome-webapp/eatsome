-- Enforce Row Level Security on all tables to ensure proper data isolation

-- First enable RLS on all tables if not already enabled
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if they exist) to replace with improved ones
DROP POLICY IF EXISTS "Restaurant staff can view their own restaurant" ON public.restaurants;
DROP POLICY IF EXISTS "Restaurant staff can manage their restaurant staff" ON public.restaurant_staff;
DROP POLICY IF EXISTS "Restaurant staff can manage menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Restaurant staff can manage menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Restaurant staff can manage restaurant tables" ON public.restaurant_tables;
DROP POLICY IF EXISTS "Restaurant staff can view restaurant orders" ON public.orders;
DROP POLICY IF EXISTS "Restaurant staff can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can read public restaurant data" ON public.restaurants;
DROP POLICY IF EXISTS "Users can read menu categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Users can read menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.profiles;

-- Create improved RLS policies for restaurant staff
-- Restaurant staff can view and manage their own restaurant
CREATE POLICY "Restaurant staff can manage their restaurant" ON public.restaurants
  USING (id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ));

-- Restaurant staff can manage their restaurant staff
CREATE POLICY "Restaurant staff can manage restaurant staff" ON public.restaurant_staff
  USING (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
  ))
  WITH CHECK (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
  ));

-- Restaurant staff can view their own assignment
CREATE POLICY "Restaurant staff can view own assignment" ON public.restaurant_staff
  USING (user_id = auth.uid());

-- Restaurant staff can manage menu categories for their restaurant
CREATE POLICY "Restaurant staff can manage menu categories" ON public.menu_categories
  USING (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ));

-- Restaurant staff can manage menu items for their restaurant
CREATE POLICY "Restaurant staff can manage menu items" ON public.menu_items
  USING (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ));

-- Restaurant staff can manage restaurant tables for their restaurant
CREATE POLICY "Restaurant staff can manage restaurant tables" ON public.restaurant_tables
  USING (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ));

-- Restaurant staff can manage orders for their restaurant
CREATE POLICY "Restaurant staff can manage orders" ON public.orders
  USING (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (restaurant_id IN (
    SELECT restaurant_id FROM public.restaurant_staff 
    WHERE user_id = auth.uid()
  ));

-- Restaurant staff can manage order items for their restaurant's orders
CREATE POLICY "Restaurant staff can manage order items" ON public.order_items
  USING (order_id IN (
    SELECT id FROM public.orders
    WHERE restaurant_id IN (
      SELECT restaurant_id FROM public.restaurant_staff 
      WHERE user_id = auth.uid()
    )
  ))
  WITH CHECK (order_id IN (
    SELECT id FROM public.orders
    WHERE restaurant_id IN (
      SELECT restaurant_id FROM public.restaurant_staff 
      WHERE user_id = auth.uid()
    )
  ));

-- Create RLS policies for regular users (customers)
-- Users can view public restaurant data
CREATE POLICY "Users can view active restaurants" ON public.restaurants
  FOR SELECT USING (is_active = true);

-- Users can view menu categories for active restaurants
CREATE POLICY "Users can view menu categories" ON public.menu_categories
  FOR SELECT USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE is_active = true
  ));

-- Users can view available menu items for active restaurants
CREATE POLICY "Users can view menu items" ON public.menu_items
  FOR SELECT USING (
    is_available = true AND 
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE is_active = true
    )
  );

-- Users can view and manage their own orders
CREATE POLICY "Users can manage their own orders" ON public.orders
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Users can view and manage items in their own orders
CREATE POLICY "Users can manage their own order items" ON public.order_items
  USING (order_id IN (
    SELECT id FROM public.orders WHERE customer_id = auth.uid()
  ))
  WITH CHECK (order_id IN (
    SELECT id FROM public.orders WHERE customer_id = auth.uid()
  ));

-- Users can view and update their own profile
CREATE POLICY "Users can manage their own profile" ON public.profiles
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Anonymous access policies for public restaurant information
-- Allow anonymous users to view active restaurants
CREATE POLICY "Anonymous users can view active restaurants" ON public.restaurants
  FOR SELECT USING (is_active = true);

-- Allow anonymous users to view menu categories for active restaurants
CREATE POLICY "Anonymous users can view menu categories" ON public.menu_categories
  FOR SELECT USING (restaurant_id IN (
    SELECT id FROM public.restaurants WHERE is_active = true
  ));

-- Allow anonymous users to view available menu items for active restaurants
CREATE POLICY "Anonymous users can view menu items" ON public.menu_items
  FOR SELECT USING (
    is_available = true AND 
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE is_active = true
    )
  ); 