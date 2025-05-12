-- Fix infinite recursion in restaurant_members policies

-- Drop the problematic policy
DROP POLICY IF EXISTS "Restaurant owners can manage staff" ON restaurant_members;

-- Create a new version that avoids recursion
CREATE POLICY "Restaurant owners can manage staff" 
  ON restaurant_members 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1
      FROM restaurant_members rm
      WHERE rm.restaurant_id = restaurant_members.restaurant_id
      AND rm.user_id = auth.uid() 
      AND rm.role = 'owner'
      -- Add this condition to prevent the policy from querying itself recursively
      AND rm.id != restaurant_members.id
    )
    -- Add this condition to handle the case where the user is creating their first record
    OR (
      auth.uid() = restaurant_members.user_id 
      AND restaurant_members.role = 'owner'
    )
  );

-- Also create a trigger to automatically add the restaurant creator as an owner
CREATE OR REPLACE FUNCTION public.handle_new_restaurant()
RETURNS TRIGGER AS $$
BEGIN
  -- Add the restaurant creator as owner
  INSERT INTO restaurant_members (restaurant_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner')
  ON CONFLICT (restaurant_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new restaurant
DROP TRIGGER IF EXISTS on_restaurant_created ON public.restaurants;
CREATE TRIGGER on_restaurant_created
  AFTER INSERT ON public.restaurants
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_restaurant(); 