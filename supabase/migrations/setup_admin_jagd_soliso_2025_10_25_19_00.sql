-- Erstelle Profil und Admin-Rechte für jagd@soliso.de
-- User ID: 2188861a-2ea5-4c7b-9ee4-959ced77091a

-- Erstelle Benutzerprofil
INSERT INTO public.user_profiles_2025_10_25_19_00 (
    user_id, 
    email, 
    full_name, 
    freigabe_status, 
    freigabe_datum, 
    freigabe_notiz,
    registrierung_datum
) VALUES (
    '2188861a-2ea5-4c7b-9ee4-959ced77091a',
    'jagd@soliso.de',
    'Jagd Administrator',
    'freigegeben',
    NOW(),
    'Erster Administrator - direkt eingerichtet',
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    freigabe_status = 'freigegeben',
    freigabe_datum = NOW(),
    freigabe_notiz = 'Administrator - direkt eingerichtet';

-- Erstelle Super-Admin Rolle
INSERT INTO public.admin_rollen_2025_10_25_19_00 (
    user_id,
    rolle,
    erstellt_von,
    erstellt_am
) VALUES (
    '2188861a-2ea5-4c7b-9ee4-959ced77091a',
    'super_admin',
    '2188861a-2ea5-4c7b-9ee4-959ced77091a',
    NOW()
) ON CONFLICT (user_id, rolle) DO NOTHING;

-- Erstelle auch Benutzer-Admin Rolle
INSERT INTO public.admin_rollen_2025_10_25_19_00 (
    user_id,
    rolle,
    erstellt_von,
    erstellt_am
) VALUES (
    '2188861a-2ea5-4c7b-9ee4-959ced77091a',
    'benutzer_admin',
    '2188861a-2ea5-4c7b-9ee4-959ced77091a',
    NOW()
) ON CONFLICT (user_id, rolle) DO NOTHING;

-- Erstelle auch Lager-Admin Rolle
INSERT INTO public.admin_rollen_2025_10_25_19_00 (
    user_id,
    rolle,
    erstellt_von,
    erstellt_am
) VALUES (
    '2188861a-2ea5-4c7b-9ee4-959ced77091a',
    'lager_admin',
    '2188861a-2ea5-4c7b-9ee4-959ced77091a',
    NOW()
) ON CONFLICT (user_id, rolle) DO NOTHING;

-- Überprüfe das Ergebnis
SELECT 
    'Setup erfolgreich!' as status,
    up.email,
    up.freigabe_status,
    array_agg(ar.rolle) as rollen
FROM public.user_profiles_2025_10_25_19_00 up
LEFT JOIN public.admin_rollen_2025_10_25_19_00 ar ON up.user_id = ar.user_id
WHERE up.user_id = '2188861a-2ea5-4c7b-9ee4-959ced77091a'
GROUP BY up.email, up.freigabe_status;