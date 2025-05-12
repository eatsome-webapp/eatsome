-- Laten we beginnen met het aanmaken van de basis tabellen en enums
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'restaurant_owner');
CREATE TYPE restaurant_member_role AS ENUM ('owner', 'manager', 'staff');

-- Restaurant members relatie tabel met verschillende rol niveaus
CREATE TABLE IF NOT EXISTS restaurant_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role restaurant_member_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, user_id)
);

-- Update de trigger om gebruikersmetadata naar profielen te synchroniseren
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log de user info voor debugging
  RAISE NOTICE 'New user created: id=%, email=%, user_metadata=%', NEW.id, NEW.email, NEW.raw_user_meta_data;
  
  -- Get role from metadata or default to 'customer'
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migreer bestaande restaurant_staff data
INSERT INTO restaurant_members (restaurant_id, user_id, role)
SELECT 
  restaurant_id, 
  user_id, 
  CASE 
    WHEN role = 'owner' THEN 'owner'::restaurant_member_role
    WHEN role = 'manager' THEN 'manager'::restaurant_member_role
    ELSE 'staff'::restaurant_member_role
  END
FROM restaurant_staff
ON CONFLICT (restaurant_id, user_id) DO NOTHING;

-- RLS policies voor restaurant members
ALTER TABLE restaurant_members ENABLE ROW LEVEL SECURITY;

-- Restaurant members kunnen hun eigen lidmaatschappen zien
CREATE POLICY "Users can view their own restaurant memberships" 
  ON restaurant_members 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Restaurant eigenaren kunnen restaurant staff beheren
CREATE POLICY "Restaurant owners can manage staff" 
  ON restaurant_members 
  FOR ALL 
  USING (
    restaurant_id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Restaurant managers kunnen restaurant staff bekijken
CREATE POLICY "Restaurant managers can view staff" 
  ON restaurant_members 
  FOR SELECT 
  USING (
    restaurant_id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'manager')
    )
  );

-- Update restaurant RLS policies
DROP POLICY IF EXISTS "Restaurant staff can view their restaurants" ON restaurants;
CREATE POLICY "Restaurant members can view their restaurants" 
  ON restaurants 
  FOR SELECT 
  USING (
    id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Restaurant owners can update their restaurants" ON restaurants;
CREATE POLICY "Restaurant owners and managers can update restaurants" 
  ON restaurants 
  FOR UPDATE 
  USING (
    id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Restaurant owners can delete restaurants" 
  ON restaurants 
  FOR DELETE 
  USING (
    id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Zorg dat de menu's alleen door eigenaren en managers kunnen worden aangepast
DROP POLICY IF EXISTS "Iedereen kan menu's bekijken" ON menu_categories;
CREATE POLICY "Anyone can view published menu categories" 
  ON menu_categories 
  FOR SELECT 
  USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE status = 'active'
    ) 
    OR 
    restaurant_id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only owners and managers can modify menu categories" 
  ON menu_categories 
  FOR ALL 
  USING (
    restaurant_id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'manager')
    )
  );

-- Zelfde voor menu items
DROP POLICY IF EXISTS "Iedereen kan menu items bekijken" ON menu_items;
CREATE POLICY "Anyone can view menu items" 
  ON menu_items 
  FOR SELECT 
  USING (
    category_id IN (
      SELECT id FROM menu_categories WHERE 
      restaurant_id IN (
        SELECT id FROM restaurants WHERE status = 'active'
      )
      OR
      restaurant_id IN (
        SELECT restaurant_id 
        FROM restaurant_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Only owners and managers can modify menu items" 
  ON menu_items 
  FOR ALL 
  USING (
    category_id IN (
      SELECT id FROM menu_categories WHERE 
      restaurant_id IN (
        SELECT restaurant_id 
        FROM restaurant_members 
        WHERE user_id = auth.uid() 
        AND role IN ('owner', 'manager')
      )
    )
  );

-- Orders policies - iedereen in restaurant staff kan orders beheren
CREATE POLICY "Restaurant staff can view orders" 
  ON orders 
  FOR SELECT 
  USING (
    restaurant_id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant staff can update orders" 
  ON orders 
  FOR UPDATE 
  USING (
    restaurant_id IN (
      SELECT restaurant_id 
      FROM restaurant_members 
      WHERE user_id = auth.uid()
    )
  );

-- Klanten kunnen alleen hun eigen orders zien
CREATE POLICY "Customers can view their own orders" 
  ON orders 
  FOR SELECT 
  USING (customer_id = auth.uid());

-- Indices voor performance
CREATE INDEX IF NOT EXISTS idx_restaurant_members_user_id ON restaurant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_members_restaurant_id ON restaurant_members(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_members_role ON restaurant_members(role); 