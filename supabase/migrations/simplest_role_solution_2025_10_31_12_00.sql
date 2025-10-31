-- Einfachste Lösung: Rolle direkt im Benutzerprofil
-- Keine separaten Tabellen, keine Constraints, keine Komplikationen

-- 1. Füge Rolle-Spalte direkt zur Profil-Tabelle hinzu
ALTER TABLE public.benutzer_profile_2025_10_31_11_00 
ADD COLUMN IF NOT EXISTS rolle VARCHAR(50) DEFAULT 'shop_user' 
CHECK (rolle IN ('super_admin', 'admin', 'shop_user'));

-- 2. Setze Rollen basierend auf benutzer_typ
UPDATE public.benutzer_profile_2025_10_31_11_00 
SET rolle = CASE 
    WHEN benutzer_typ = 'admin' THEN 'admin'
    ELSE 'shop_user'
END
WHERE rolle IS NULL;

-- 3. Setze jagd@soliso.de als Super-Admin
UPDATE public.benutzer_profile_2025_10_31_11_00 
SET rolle = 'super_admin', benutzer_typ = 'admin'
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jagd@soliso.de');

-- 4. Zeige alle Benutzer mit ihren Rollen
SELECT 
    u.email,
    p.full_name,
    p.rolle,
    p.benutzer_typ,
    p.freigabe_status,
    p.aktiv
FROM auth.users u
JOIN public.benutzer_profile_2025_10_31_11_00 p ON u.id = p.user_id
ORDER BY u.email;

-- Das war's! Keine separaten Tabellen, keine RPC-Funktionen, keine Constraints.
-- Rollenwechsel = einfaches UPDATE auf eine Spalte.

COMMENT ON COLUMN public.benutzer_profile_2025_10_31_11_00.rolle IS 'Einfache Rollenspeicherung direkt im Profil - keine separaten Tabellen nötig';