-- Functie om een nieuwe gebruiker aan te maken met admin rechten
CREATE OR REPLACE FUNCTION create_admin_user(
    email_param TEXT,
    password_param TEXT
) RETURNS UUID AS $$
DECLARE
    user_id UUID;
    encrypted_pw TEXT;
    created_at_val TIMESTAMPTZ;
BEGIN
    -- Genereer een UUID en encrypteer het wachtwoord
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password_param, gen_salt('bf'));
    created_at_val := now();
    
    -- Gebruiker toevoegen aan auth.users tabel
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        user_id,
        'authenticated',
        'authenticated',
        email_param,
        encrypted_pw,
        created_at_val,
        NULL,
        NULL,
        '{"provider":"email","providers":["email"],"role":"admin"}',
        '{"name":"Admin User"}',
        created_at_val,
        created_at_val,
        '',
        '',
        '',
        ''
    );
    
    -- Identity toevoegen aan auth.identities
    INSERT INTO auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        user_id,
        user_id,
        jsonb_build_object(
            'sub', user_id::text,
            'email', email_param,
            'email_verified', 'true'
        ),
        'email',
        NULL,
        created_at_val,
        created_at_val
    );
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Gebruiker aanmaken met de functie
SELECT create_admin_user('kocamis.emre@gmail.com', 'Welkom123!'); 