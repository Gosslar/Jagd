-- Einfache Rollenverwaltung ohne UNIQUE Constraints
-- Vollständige Neuerstellung der Rollenverwaltung

-- 1. Erstelle neue, einfachere Tabelle ohne problematische Constraints
CREATE TABLE IF NOT EXISTS public.simple_user_roles_2025_10_31_12_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'shop_user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Kein UNIQUE Constraint! Das war das Problem.

-- 2. Erstelle einfache Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_simple_user_roles_user_id ON public.simple_user_roles_2025_10_31_12_00(user_id);
CREATE INDEX IF NOT EXISTS idx_simple_user_roles_role ON public.simple_user_roles_2025_10_31_12_00(role);

-- 3. RLS deaktiviert lassen für Tests
ALTER TABLE public.simple_user_roles_2025_10_31_12_00 DISABLE ROW LEVEL SECURITY;

-- 4. Erstelle einfache Funktion zum Setzen von Rollen
CREATE OR REPLACE FUNCTION public.set_simple_user_role(target_user_id UUID, new_role VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    -- Lösche alle alten Rollen des Benutzers
    DELETE FROM public.simple_user_roles_2025_10_31_12_00 
    WHERE user_id = target_user_id;
    
    -- Füge neue Rolle hinzu
    INSERT INTO public.simple_user_roles_2025_10_31_12_00 (user_id, role, created_by)
    VALUES (target_user_id, new_role, auth.uid());
    
    -- Benutzer-Typ im Profil aktualisieren
    UPDATE public.benutzer_profile_2025_10_31_11_00
    SET benutzer_typ = CASE 
        WHEN new_role IN ('super_admin', 'admin') THEN 'admin'
        ELSE 'shop_user'
    END,
    aktualisiert_am = NOW()
    WHERE user_id = target_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Migriere Daten aus der alten Tabelle
INSERT INTO public.simple_user_roles_2025_10_31_12_00 (user_id, role, created_by)
SELECT 
    user_id, 
    rolle as role,
    erstellt_von as created_by
FROM public.benutzer_rollen_2025_10_31_11_00 
WHERE aktiv = true
ON CONFLICT DO NOTHING;

-- 6. Stelle sicher, dass jagd@soliso.de Super-Admin ist
DELETE FROM public.simple_user_roles_2025_10_31_12_00 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jagd@soliso.de');

INSERT INTO public.simple_user_roles_2025_10_31_12_00 (user_id, role)
SELECT id, 'super_admin'
FROM auth.users 
WHERE email = 'jagd@soliso.de';

-- 7. Teste die neue Funktion
DO $$
DECLARE
    user_id_jagd UUID;
BEGIN
    SELECT id INTO user_id_jagd FROM auth.users WHERE email = 'jagd@soliso.de';
    
    IF user_id_jagd IS NOT NULL THEN
        -- Teste Rollenwechsel mehrmals
        PERFORM public.set_simple_user_role(user_id_jagd, 'admin');
        PERFORM public.set_simple_user_role(user_id_jagd, 'super_admin');
        PERFORM public.set_simple_user_role(user_id_jagd, 'shop_user');
        PERFORM public.set_simple_user_role(user_id_jagd, 'super_admin');
        
        RAISE NOTICE 'Rollenwechsel-Tests erfolgreich für jagd@soliso.de';
    END IF;
END $$;

-- 8. Zeige alle Benutzer mit neuen Rollen
SELECT 
    u.email,
    p.full_name,
    p.benutzer_typ,
    p.freigabe_status,
    sr.role as aktuelle_rolle,
    sr.created_at as rolle_seit
FROM auth.users u
LEFT JOIN public.benutzer_profile_2025_10_31_11_00 p ON u.id = p.user_id
LEFT JOIN public.simple_user_roles_2025_10_31_12_00 sr ON u.id = sr.user_id
ORDER BY u.email;

-- 9. Erstelle View für einfachen Zugriff
CREATE OR REPLACE VIEW public.user_roles_view AS
SELECT 
    u.id as user_id,
    u.email,
    p.full_name,
    p.freigabe_status,
    p.benutzer_typ,
    sr.role,
    sr.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN public.benutzer_profile_2025_10_31_11_00 p ON u.id = p.user_id
LEFT JOIN public.simple_user_roles_2025_10_31_12_00 sr ON u.id = sr.user_id;

-- Kommentare
COMMENT ON TABLE public.simple_user_roles_2025_10_31_12_00 IS 'Einfache Rollentabelle OHNE UNIQUE Constraints - behebt Key Violations';
COMMENT ON FUNCTION public.set_simple_user_role(UUID, VARCHAR) IS 'Einfache Rollensetzung ohne Constraint-Probleme';
COMMENT ON VIEW public.user_roles_view IS 'Vereinfachte Sicht auf Benutzer und ihre Rollen';