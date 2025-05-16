-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM (
  'customer',
  'courier',
  'restaurant_staff',
  'restaurant_admin',
  'platform_admin'
);

-- Create a profiles table that extends the auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  role user_role DEFAULT 'customer'::user_role,
  restaurant_id UUID, -- For restaurant staff and admins
  metadata JSONB
);

-- Create a function to create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for the profiles table
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow restaurant_admin to view and update staff profiles for their restaurant
CREATE POLICY "Restaurant admins can view all profiles in their restaurant"
  ON public.profiles
  FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'restaurant_admin'::user_role
    AND restaurant_id = (SELECT restaurant_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Restaurant admins can update staff profiles in their restaurant"
  ON public.profiles
  FOR UPDATE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'restaurant_admin'::user_role
    AND restaurant_id = (SELECT restaurant_id FROM public.profiles WHERE id = auth.uid())
    AND role = 'restaurant_staff'::user_role
  );

-- Allow platform_admin to view all profiles
CREATE POLICY "Platform admins can view all profiles"
  ON public.profiles
  FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'platform_admin'::user_role);

-- Create a function to get the current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Create function to check if user has the required role
CREATE OR REPLACE FUNCTION public.has_required_role(required_role user_role)
RETURNS BOOLEAN AS $$
DECLARE
  user_curr_role user_role;
BEGIN
  SELECT role INTO user_curr_role FROM public.profiles WHERE id = auth.uid();
  
  IF user_curr_role = 'platform_admin' THEN 
    RETURN TRUE;
  ELSIF user_curr_role = 'restaurant_admin' AND required_role IN ('restaurant_admin', 'restaurant_staff') THEN
    RETURN TRUE;
  ELSIF user_curr_role = required_role THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 