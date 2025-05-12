-- SQL script om rollen van bestaande gebruikers bij te werken
-- Voer dit uit in de Supabase SQL editor

-- Update de role van een bestaande gebruiker naar restaurant_owner
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "restaurant_owner"}'::jsonb
WHERE email = 'emre.kocamis@hotmail.com';

-- Update de role van een bestaande gebruiker naar admin
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'kocamis.emre@gmail.com';

-- Update de role van een bestaande gebruiker naar customer
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "customer"}'::jsonb
WHERE email = 'emre___1989@hotmail.com';

-- Controleer de resultaten
SELECT id, email, raw_app_meta_data 
FROM auth.users 
WHERE email IN ('emre.kocamis@hotmail.com', 'kocamis.emre@gmail.com', 'emre___1989@hotmail.com'); 