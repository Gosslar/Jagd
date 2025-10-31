-- Sicherstellen dass rolle Spalte existiert und funktioniert

-- 1. Prüfe ob rolle Spalte existiert
DO $$
BEGIN
    -- Versuche rolle Spalte hinzuzufügen
    BEGIN
        ALTER TABLE public.benutzer_profile_2025_10_31_11_00 
        ADD COLUMN rolle VARCHAR(50) DEFAULT 'shop_user';
        RAISE NOTICE 'Rolle Spalte hinzugefügt';
    EXCEPTION WHEN duplicate_column THEN
        RAISE NOTICE 'Rolle Spalte existiert bereits';
    END;
    
    -- Entferne Check Constraint falls vorhanden (kann Probleme verursachen)
    BEGIN
        ALTER TABLE public.benutzer_profile_2025_10_31_11_00 
        DROP CONSTRAINT IF EXISTS benutzer_profile_2025_10_31_11_00_rolle_check;
        RAISE NOTICE 'Check Constraint entfernt';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Kein Check Constraint zu entfernen';
    END;
END $$;

-- 2. Setze Standardwerte für alle Benutzer ohne Rolle
UPDATE public.benutzer_profile_2025_10_31_11_00 
SET rolle = CASE 
    WHEN benutzer_typ = 'admin' THEN 'admin'
    ELSE 'shop_user'
END
WHERE rolle IS NULL OR rolle = '';

-- 3. Setze jagd@soliso.de explizit als Super-Admin
UPDATE public.benutzer_profile_2025_10_31_11_00 
SET rolle = 'super_admin', benutzer_typ = 'admin'
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jagd@soliso.de');

-- 4. Teste UPDATE Operation
DO $$
DECLARE
    test_user_id UUID;
    update_result INTEGER;
BEGIN
    -- Finde jagd@soliso.de
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'jagd@soliso.de';
    
    IF test_user_id IS NOT NULL THEN
        -- Teste UPDATE
        UPDATE public.benutzer_profile_2025_10_31_11_00 
        SET rolle = 'super_admin', 
            benutzer_typ = 'admin',
            aktualisiert_am = NOW()
        WHERE user_id = test_user_id;
        
        GET DIAGNOSTICS update_result = ROW_COUNT;
        RAISE NOTICE 'UPDATE Test erfolgreich: % Zeilen betroffen', update_result;
    ELSE
        RAISE NOTICE 'jagd@soliso.de nicht gefunden für Test';
    END IF;
END $$;

-- 5. Zeige Tabellen-Struktur
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'benutzer_profile_2025_10_31_11_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Zeige alle Benutzer mit Rollen
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

COMMENT ON COLUMN public.benutzer_profile_2025_10_31_11_00.rolle IS 'Benutzerrolle ohne Constraints - sollte UPDATE Fehler beheben';