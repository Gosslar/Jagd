-- Migration der bestehenden Benutzerdaten in das neue System
-- Übertragung von jagd@soliso.de und anderen Benutzern

-- 1. Migriere alle Benutzer aus der alten user_profiles Tabelle
INSERT INTO public.benutzer_profile_2025_10_31_11_00 (
    user_id, email, full_name, telefon, adresse, 
    freigabe_status, benutzer_typ, aktiv, erstellt_am
)
SELECT 
    user_id, 
    email, 
    full_name,
    NULL as telefon,
    NULL as adresse,
    freigabe_status,
    'admin' as benutzer_typ, -- Alle bestehenden Benutzer als Admin
    true as aktiv,
    erstellt_am
FROM public.user_profiles_2025_10_25_19_00
WHERE user_id IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    freigabe_status = EXCLUDED.freigabe_status,
    benutzer_typ = 'admin',
    aktiv = true;

-- 2. Migriere Rollen aus der alten admin_rollen Tabelle
INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (
    user_id, rolle, beschreibung, aktiv, erstellt_am
)
SELECT 
    user_id,
    CASE 
        WHEN rolle = 'super_admin' THEN 'super_admin'
        WHEN rolle = 'benutzer_admin' THEN 'admin'
        WHEN rolle = 'lager_admin' THEN 'admin'
        ELSE 'admin'
    END as rolle,
    'Migriert aus altem System' as beschreibung,
    true as aktiv,
    erstellt_am
FROM public.admin_rollen_2025_10_25_19_00
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, rolle) DO UPDATE SET
    aktiv = true,
    beschreibung = 'Migriert aus altem System';

-- 3. Stelle sicher, dass jagd@soliso.de Super-Admin ist
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
WHERE email = 'jagd@soliso.de'
ON CONFLICT (user_id) DO UPDATE SET
    freigabe_status = 'freigegeben',
    benutzer_typ = 'admin',
    aktiv = true,
    freigegeben_am = NOW();

INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, beschreibung, aktiv)
SELECT 
    id, 
    'super_admin', 
    'System-Administrator mit allen Berechtigungen',
    true
FROM auth.users 
WHERE email = 'jagd@soliso.de'
ON CONFLICT (user_id, rolle) DO UPDATE SET 
    aktiv = true,
    beschreibung = 'System-Administrator mit allen Berechtigungen';

-- 4. Füge auch Admin-Rolle für jagd@soliso.de hinzu (für Kompatibilität)
INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, beschreibung, aktiv)
SELECT 
    id, 
    'admin', 
    'Administrator-Rolle',
    true
FROM auth.users 
WHERE email = 'jagd@soliso.de'
ON CONFLICT (user_id, rolle) DO UPDATE SET 
    aktiv = true;

-- 5. Erstelle Standard-Berechtigungen für Admins
INSERT INTO public.benutzer_berechtigungen_2025_10_31_11_00 (user_id, bereich, berechtigung, aktiv)
SELECT 
    u.id,
    bereich.name,
    'admin',
    true
FROM auth.users u
CROSS JOIN (
    VALUES 
    ('shop'), ('lager'), ('benutzer'), ('bestellungen'), 
    ('blog'), ('kontakt'), ('veranstaltungen')
) AS bereich(name)
WHERE u.email = 'jagd@soliso.de'
ON CONFLICT (user_id, bereich, berechtigung) DO UPDATE SET aktiv = true;

-- 6. Debug-Abfrage: Zeige alle Rollen für jagd@soliso.de
DO $$
DECLARE
    user_record RECORD;
    role_record RECORD;
BEGIN
    -- Finde Benutzer
    SELECT id, email INTO user_record FROM auth.users WHERE email = 'jagd@soliso.de';
    
    IF user_record.id IS NOT NULL THEN
        RAISE NOTICE 'Benutzer gefunden: % (ID: %)', user_record.email, user_record.id;
        
        -- Zeige alle Rollen
        FOR role_record IN 
            SELECT rolle, aktiv, beschreibung 
            FROM public.benutzer_rollen_2025_10_31_11_00 
            WHERE user_id = user_record.id
        LOOP
            RAISE NOTICE 'Rolle: % (Aktiv: %) - %', role_record.rolle, role_record.aktiv, role_record.beschreibung;
        END LOOP;
        
        -- Zeige Profil-Status
        SELECT freigabe_status, benutzer_typ, aktiv INTO role_record
        FROM public.benutzer_profile_2025_10_31_11_00 
        WHERE user_id = user_record.id;
        
        IF FOUND THEN
            RAISE NOTICE 'Profil-Status: % (Typ: %, Aktiv: %)', role_record.freigabe_status, role_record.benutzer_typ, role_record.aktiv;
        ELSE
            RAISE NOTICE 'Kein Profil gefunden!';
        END IF;
    ELSE
        RAISE NOTICE 'Benutzer jagd@soliso.de nicht gefunden!';
    END IF;
END $$;

-- Kommentar
COMMENT ON TABLE public.benutzer_rollen_2025_10_31_11_00 IS 'Migrierte Rollen aus altem System + neue Struktur';