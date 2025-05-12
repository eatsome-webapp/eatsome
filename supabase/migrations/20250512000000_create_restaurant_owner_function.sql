-- Create a function to safely add a user as a restaurant owner
-- This avoids the RLS policy recursion issue
CREATE OR REPLACE FUNCTION public.create_restaurant_owner(p_restaurant_id UUID, p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- Important: runs with definer's permissions, bypassing RLS
AS $$
BEGIN
  -- Insert the user as owner
  INSERT INTO restaurant_members (restaurant_id, user_id, role)
  VALUES (p_restaurant_id, p_user_id, 'owner')
  ON CONFLICT (restaurant_id, user_id) DO UPDATE
  SET role = 'owner';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_restaurant_owner(UUID, UUID) TO authenticated;

-- Also fix the RLS policy for restaurant_members to prevent recursion
DROP POLICY IF EXISTS "Restaurant owners can manage staff" ON restaurant_members;

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