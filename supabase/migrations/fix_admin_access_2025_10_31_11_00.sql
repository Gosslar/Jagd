-- Einfache Migration für jagd@soliso.de als Super-Admin
-- Stelle sicher, dass der Hauptbenutzer Zugriff hat

-- 1. Lösche eventuell vorhandene Einträge für jagd@soliso.de
DELETE FROM public.benutzer_rollen_2025_10_31_11_00 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jagd@soliso.de');

DELETE FROM public.benutzer_profile_2025_10_31_11_00 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jagd@soliso.de');

-- 2. Erstelle Profil für jagd@soliso.de
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

-- 3. Erstelle Super-Admin Rolle für jagd@soliso.de
INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, beschreibung, aktiv)
SELECT 
    id, 
    'super_admin', 
    'System-Administrator mit allen Berechtigungen',
    true
FROM auth.users 
WHERE email = 'jagd@soliso.de';

-- 4. Erstelle auch Admin-Rolle für Kompatibilität
INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, beschreibung, aktiv)
SELECT 
    id, 
    'admin', 
    'Administrator-Rolle für Kompatibilität',
    true
FROM auth.users 
WHERE email = 'jagd@soliso.de';

-- 5. Erstelle Standard-Berechtigungen
INSERT INTO public.benutzer_berechtigungen_2025_10_31_11_00 (user_id, bereich, berechtigung, aktiv)
SELECT 
    u.id,
    unnest(ARRAY['shop', 'lager', 'benutzer', 'bestellungen', 'blog', 'kontakt', 'veranstaltungen']),
    'admin',
    true
FROM auth.users u
WHERE u.email = 'jagd@soliso.de';

-- 6. Prüfe das Ergebnis
SELECT 
    u.email,
    p.freigabe_status,
    p.benutzer_typ,
    p.aktiv as profil_aktiv,
    array_agg(r.rolle) as rollen
FROM auth.users u
LEFT JOIN public.benutzer_profile_2025_10_31_11_00 p ON u.id = p.user_id
LEFT JOIN public.benutzer_rollen_2025_10_31_11_00 r ON u.id = r.user_id AND r.aktiv = true
WHERE u.email = 'jagd@soliso.de'
GROUP BY u.email, p.freigabe_status, p.benutzer_typ, p.aktiv;