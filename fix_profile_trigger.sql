-- SQL script om het profiles probleem te fixen
-- Voer dit uit in de Supabase SQL editor of via een database tool

-- 1. Tijdelijk uitschakelen van de trigger die profielen aanmaakt
ALTER TABLE auth.users DISABLE TRIGGER handle_new_user;
ALTER TABLE auth.users DISABLE TRIGGER create_profile_on_signup;

-- 2. Fix de handle_new_user functie zodat deze eerst controleert of het profiel al bestaat
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Controleer eerst of er al een profiel bestaat voor deze gebruiker
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    -- Alleen een profiel aanmaken als er nog geen bestaat
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Zelfde voor de andere trigger functie als deze bestaat
CREATE OR REPLACE FUNCTION public.create_profile_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Controleer eerst of er al een profiel bestaat voor deze gebruiker
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    -- Alleen een profiel aanmaken als er nog geen bestaat
    INSERT INTO public.profiles (id, full_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Triggers weer aanzetten
ALTER TABLE auth.users ENABLE TRIGGER handle_new_user;
ALTER TABLE auth.users ENABLE TRIGGER create_profile_on_signup;

-- 5. Opschonen: Eventuele profielen zonder gebruiker verwijderen
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users); 