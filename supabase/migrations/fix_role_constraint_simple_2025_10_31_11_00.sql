-- Korrigierte Benutzerrollen-Verwaltung
-- Problem: Key Constraint Violation beim Ändern von Rollen

-- 1. Erstelle verbesserte set_user_role Funktion die Konflikte vermeidet
CREATE OR REPLACE FUNCTION public.set_user_role_fixed(target_user_id UUID, new_role VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    -- Lösche alle alten Rollen des Benutzers
    DELETE FROM public.benutzer_rollen_2025_10_31_11_00 
    WHERE user_id = target_user_id;
    
    -- Füge neue Rolle hinzu
    INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, erstellt_von, beschreibung, aktiv)
    VALUES (
        target_user_id, 
        new_role, 
        auth.uid(), 
        'Rolle gesetzt via Admin-Interface',
        true
    );
    
    -- Benutzer-Typ im Profil aktualisieren
    UPDATE public.benutzer_profile_2025_10_31_11_00
    SET benutzer_typ = CASE 
        WHEN new_role IN ('super_admin', 'admin') THEN 'admin'
        ELSE 'shop_user'
    END,
    aktualisiert_am = NOW()
    WHERE user_id = target_user_id;
    
    -- Audit-Log (falls Tabelle existiert)
    BEGIN
        INSERT INTO public.benutzer_audit_log_2025_10_31_11_00 (user_id, aktion, details)
        VALUES (
            auth.uid(), 
            'ROLE_CHANGED', 
            jsonb_build_object(
                'target_user_id', target_user_id, 
                'new_role', new_role,
                'timestamp', NOW()
            )
        );
    EXCEPTION WHEN OTHERS THEN
        -- Ignoriere Audit-Log Fehler
        NULL;
    END;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Erstelle Funktion zum Hinzufügen zusätzlicher Rollen (ohne Löschen)
CREATE OR REPLACE FUNCTION public.add_user_role(target_user_id UUID, new_role VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    -- Füge Rolle hinzu oder aktualisiere sie
    INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, erstellt_von, beschreibung, aktiv)
    VALUES (
        target_user_id, 
        new_role, 
        auth.uid(), 
        'Zusätzliche Rolle hinzugefügt',
        true
    )
    ON CONFLICT (user_id, rolle) 
    DO UPDATE SET 
        aktiv = true,
        aktualisiert_am = NOW(),
        erstellt_von = auth.uid();
    
    -- Benutzer-Typ im Profil aktualisieren (höchste Rolle gewinnt)
    UPDATE public.benutzer_profile_2025_10_31_11_00
    SET benutzer_typ = CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.benutzer_rollen_2025_10_31_11_00 
            WHERE user_id = target_user_id 
            AND rolle IN ('super_admin', 'admin') 
            AND aktiv = true
        ) THEN 'admin'
        ELSE 'shop_user'
    END,
    aktualisiert_am = NOW()
    WHERE user_id = target_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Teste die neue Funktion mit jagd@soliso.de
DO $$
DECLARE
    user_id_jagd UUID;
    test_rolle VARCHAR(50);
    test_aktiv BOOLEAN;
    test_typ VARCHAR(20);
BEGIN
    -- Finde jagd@soliso.de
    SELECT id INTO user_id_jagd FROM auth.users WHERE email = 'jagd@soliso.de';
    
    IF user_id_jagd IS NOT NULL THEN
        -- Teste Rollenwechsel
        PERFORM public.set_user_role_fixed(user_id_jagd, 'super_admin');
        RAISE NOTICE 'Rolle für jagd@soliso.de erfolgreich auf super_admin gesetzt';
        
        -- Zeige Ergebnis
        SELECT r.rolle, r.aktiv, p.benutzer_typ 
        INTO test_rolle, test_aktiv, test_typ
        FROM public.benutzer_rollen_2025_10_31_11_00 r
        JOIN public.benutzer_profile_2025_10_31_11_00 p ON r.user_id = p.user_id
        WHERE r.user_id = user_id_jagd
        AND r.aktiv = true
        LIMIT 1;
        
        RAISE NOTICE 'Aktuelle Rolle: %, Aktiv: %, Benutzer-Typ: %', test_rolle, test_aktiv, test_typ;
    ELSE
        RAISE NOTICE 'jagd@soliso.de nicht gefunden';
    END IF;
END $$;

-- 4. Zeige alle Benutzer mit ihren Rollen
SELECT 
    u.email,
    p.full_name,
    p.benutzer_typ,
    p.freigabe_status,
    array_agg(r.rolle ORDER BY r.rolle) FILTER (WHERE r.aktiv = true) as aktive_rollen
FROM auth.users u
LEFT JOIN public.benutzer_profile_2025_10_31_11_00 p ON u.id = p.user_id
LEFT JOIN public.benutzer_rollen_2025_10_31_11_00 r ON u.id = r.user_id
GROUP BY u.id, u.email, p.full_name, p.benutzer_typ, p.freigabe_status
ORDER BY u.email;

-- Kommentare
COMMENT ON FUNCTION public.set_user_role_fixed(UUID, VARCHAR) IS 'Setzt eine einzelne Rolle für einen Benutzer (löscht alle anderen) - behebt Key Constraint Violation';
COMMENT ON FUNCTION public.add_user_role(UUID, VARCHAR) IS 'Fügt eine zusätzliche Rolle hinzu ohne andere zu löschen';