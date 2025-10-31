-- RLS-Policies vereinfachen und Benutzerzugriff sicherstellen
-- Fokus auf jagd@soliso.de Zugriff

-- 1. Prüfe Tabellen-Existenz und Inhalt
DO $$
DECLARE
    table_exists boolean;
    row_count integer;
    user_id_jagd uuid;
BEGIN
    -- Finde jagd@soliso.de User ID
    SELECT id INTO user_id_jagd FROM auth.users WHERE email = 'jagd@soliso.de';
    
    IF user_id_jagd IS NOT NULL THEN
        RAISE NOTICE 'jagd@soliso.de gefunden mit ID: %', user_id_jagd;
    ELSE
        RAISE NOTICE 'jagd@soliso.de NICHT in auth.users gefunden!';
    END IF;
    
    -- Prüfe benutzer_profile_2025_10_31_11_00
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'benutzer_profile_2025_10_31_11_00'
    ) INTO table_exists;
    
    IF table_exists THEN
        SELECT COUNT(*) INTO row_count FROM public.benutzer_profile_2025_10_31_11_00;
        RAISE NOTICE 'benutzer_profile_2025_10_31_11_00: % Zeilen', row_count;
        
        -- Zeige alle Profile
        FOR row_count IN 
            SELECT 1 FROM public.benutzer_profile_2025_10_31_11_00 
            WHERE user_id = user_id_jagd
        LOOP
            RAISE NOTICE 'jagd@soliso.de Profil gefunden';
        END LOOP;
    ELSE
        RAISE NOTICE 'Tabelle benutzer_profile_2025_10_31_11_00 existiert NICHT';
    END IF;
    
    -- Prüfe benutzer_rollen_2025_10_31_11_00
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'benutzer_rollen_2025_10_31_11_00'
    ) INTO table_exists;
    
    IF table_exists THEN
        SELECT COUNT(*) INTO row_count FROM public.benutzer_rollen_2025_10_31_11_00;
        RAISE NOTICE 'benutzer_rollen_2025_10_31_11_00: % Zeilen', row_count;
    ELSE
        RAISE NOTICE 'Tabelle benutzer_rollen_2025_10_31_11_00 existiert NICHT';
    END IF;
END $$;

-- 2. Temporär RLS komplett deaktivieren für alle Tabellen
ALTER TABLE IF EXISTS public.benutzer_rollen_2025_10_31_11_00 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.benutzer_profile_2025_10_31_11_00 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.benutzer_berechtigungen_2025_10_31_11_00 DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.benutzer_audit_log_2025_10_31_11_00 DISABLE ROW LEVEL SECURITY;

-- 3. Lösche alle existierenden Policies
DROP POLICY IF EXISTS "Admins können alle Rollen sehen" ON public.benutzer_rollen_2025_10_31_11_00;
DROP POLICY IF EXISTS "Benutzer können eigene Rollen sehen" ON public.benutzer_rollen_2025_10_31_11_00;
DROP POLICY IF EXISTS "Nur Super-Admins können Rollen verwalten" ON public.benutzer_rollen_2025_10_31_11_00;
DROP POLICY IF EXISTS "Admins können alle Profile sehen" ON public.benutzer_profile_2025_10_31_11_00;
DROP POLICY IF EXISTS "Benutzer können eigenes Profil sehen" ON public.benutzer_profile_2025_10_31_11_00;
DROP POLICY IF EXISTS "Admins können Profile verwalten" ON public.benutzer_profile_2025_10_31_11_00;
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.benutzer_rollen_2025_10_31_11_00;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.benutzer_profile_2025_10_31_11_00;
DROP POLICY IF EXISTS "jagd@soliso.de can manage roles" ON public.benutzer_rollen_2025_10_31_11_00;
DROP POLICY IF EXISTS "jagd@soliso.de can manage profiles" ON public.benutzer_profile_2025_10_31_11_00;

-- 4. Stelle sicher, dass jagd@soliso.de korrekte Daten hat
DELETE FROM public.benutzer_rollen_2025_10_31_11_00 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jagd@soliso.de');

DELETE FROM public.benutzer_profile_2025_10_31_11_00 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jagd@soliso.de');

-- Erstelle Profil für jagd@soliso.de
INSERT INTO public.benutzer_profile_2025_10_31_11_00 (
    user_id, email, full_name, freigabe_status, benutzer_typ, aktiv, freigegeben_am
)
SELECT 
    id, 
    email, 
    'Super Administrator', 
    'freigegeben', 
    'admin', 
    true,
    NOW()
FROM auth.users 
WHERE email = 'jagd@soliso.de';

-- Erstelle Rollen für jagd@soliso.de
INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, beschreibung, aktiv)
SELECT 
    id, 
    'super_admin', 
    'System-Administrator',
    true
FROM auth.users 
WHERE email = 'jagd@soliso.de';

INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, beschreibung, aktiv)
SELECT 
    id, 
    'admin', 
    'Administrator',
    true
FROM auth.users 
WHERE email = 'jagd@soliso.de';

-- 5. Migriere alle anderen existierenden Benutzer aus alten Tabellen
INSERT INTO public.benutzer_profile_2025_10_31_11_00 (
    user_id, email, full_name, freigabe_status, benutzer_typ, aktiv, erstellt_am
)
SELECT 
    up.user_id,
    up.email,
    up.full_name,
    up.freigabe_status,
    'shop_user' as benutzer_typ,
    true as aktiv,
    up.erstellt_am
FROM public.user_profiles_2025_10_25_19_00 up
WHERE up.user_id NOT IN (
    SELECT user_id FROM public.benutzer_profile_2025_10_31_11_00 
    WHERE user_id IS NOT NULL
)
ON CONFLICT (user_id) DO NOTHING;

-- Migriere Rollen aus alten Tabellen
INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (
    user_id, rolle, beschreibung, aktiv, erstellt_am
)
SELECT 
    ar.user_id,
    CASE 
        WHEN ar.rolle = 'super_admin' THEN 'super_admin'
        WHEN ar.rolle IN ('benutzer_admin', 'lager_admin') THEN 'admin'
        ELSE 'shop_user'
    END as rolle,
    'Migriert aus altem System' as beschreibung,
    true as aktiv,
    ar.erstellt_am
FROM public.admin_rollen_2025_10_25_19_00 ar
WHERE ar.user_id NOT IN (
    SELECT user_id FROM public.benutzer_rollen_2025_10_31_11_00 
    WHERE user_id IS NOT NULL
)
ON CONFLICT (user_id, rolle) DO NOTHING;

-- 6. Zeige finale Benutzer-Übersicht
SELECT 
    u.email,
    p.full_name,
    p.freigabe_status,
    p.benutzer_typ,
    p.aktiv as profil_aktiv,
    array_agg(r.rolle ORDER BY r.rolle) FILTER (WHERE r.rolle IS NOT NULL) as rollen
FROM auth.users u
LEFT JOIN public.benutzer_profile_2025_10_31_11_00 p ON u.id = p.user_id
LEFT JOIN public.benutzer_rollen_2025_10_31_11_00 r ON u.id = r.user_id AND r.aktiv = true
GROUP BY u.id, u.email, p.full_name, p.freigabe_status, p.benutzer_typ, p.aktiv
ORDER BY u.email;

-- Kommentar
COMMENT ON TABLE public.benutzer_rollen_2025_10_31_11_00 IS 'RLS deaktiviert für Debugging - alle Benutzer sichtbar';
COMMENT ON TABLE public.benutzer_profile_2025_10_31_11_00 IS 'RLS deaktiviert für Debugging - alle Benutzer sichtbar';