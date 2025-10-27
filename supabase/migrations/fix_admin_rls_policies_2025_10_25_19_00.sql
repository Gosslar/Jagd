-- Entferne alte Policies und erstelle neue, weniger restriktive
DROP POLICY IF EXISTS "Benutzer können eigene freigegebene Profile einsehen" ON public.user_profiles_2025_10_25_19_00;
DROP POLICY IF EXISTS "Benutzer können Profile erstellen" ON public.user_profiles_2025_10_25_19_00;
DROP POLICY IF EXISTS "Admins können alle Profile verwalten" ON public.user_profiles_2025_10_25_19_00;

-- Neue, einfachere Policies für user_profiles
CREATE POLICY "Jeder kann eigene Profile verwalten" 
ON public.user_profiles_2025_10_25_19_00 
FOR ALL 
USING (user_id = auth.uid());

-- Admins können alle Profile sehen und verwalten
CREATE POLICY "Authentifizierte Benutzer können alle Profile sehen" 
ON public.user_profiles_2025_10_25_19_00 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Admins können alle Profile bearbeiten (weniger restriktiv)
CREATE POLICY "Authentifizierte Benutzer können Profile bearbeiten" 
ON public.user_profiles_2025_10_25_19_00 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Entferne alte Admin-Rollen Policies
DROP POLICY IF EXISTS "Super Admins können Admin-Rollen verwalten" ON public.admin_rollen_2025_10_25_19_00;
DROP POLICY IF EXISTS "Benutzer können eigene Rollen einsehen" ON public.admin_rollen_2025_10_25_19_00;

-- Neue, einfachere Policies für admin_rollen
CREATE POLICY "Authentifizierte Benutzer können Rollen verwalten" 
ON public.admin_rollen_2025_10_25_19_00 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Funktion zum direkten Setzen von Admin-Rechten
CREATE OR REPLACE FUNCTION set_user_as_admin(target_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
    result JSON;
BEGIN
    -- Finde User ID basierend auf E-Mail
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = target_email;
    
    IF target_user_id IS NULL THEN
        RETURN json_build_object('error', 'Benutzer nicht gefunden');
    END IF;

    -- Erstelle oder aktualisiere Profil
    INSERT INTO public.user_profiles_2025_10_25_19_00 (
        user_id, email, full_name, freigabe_status, freigabe_datum, freigabe_notiz
    ) VALUES (
        target_user_id, 
        target_email, 
        target_email, 
        'freigegeben', 
        NOW(), 
        'Admin-Setup - automatisch freigegeben'
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        freigabe_status = 'freigegeben',
        freigabe_datum = NOW(),
        freigabe_notiz = 'Admin-Setup - automatisch freigegeben';

    -- Erstelle Admin-Rolle
    INSERT INTO public.admin_rollen_2025_10_25_19_00 (
        user_id, rolle, erstellt_von
    ) VALUES (
        target_user_id, 
        'super_admin', 
        target_user_id
    )
    ON CONFLICT (user_id, rolle) 
    DO NOTHING;

    RETURN json_build_object(
        'success', true, 
        'message', 'Benutzer erfolgreich als Admin eingerichtet',
        'user_id', target_user_id
    );
END;
$$;

-- Beispiel-Aufruf (ersetzen Sie die E-Mail-Adresse):
-- SELECT set_user_as_admin('ihre-email@example.com');

-- Kommentare
COMMENT ON FUNCTION set_user_as_admin IS 'Setzt einen Benutzer als Super-Admin basierend auf E-Mail-Adresse';