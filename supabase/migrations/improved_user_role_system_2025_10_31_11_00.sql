-- Verbessertes Rollen- und Benutzerverwaltungssystem
-- Unterscheidung zwischen Admin und Shop-User + Benutzer löschen

-- 1. Erweiterte Rollen-Tabelle mit besserer Struktur
CREATE TABLE IF NOT EXISTS public.benutzer_rollen_2025_10_31_11_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rolle VARCHAR(50) NOT NULL CHECK (rolle IN ('super_admin', 'admin', 'shop_user')),
    beschreibung TEXT,
    berechtigung JSONB DEFAULT '{}',
    aktiv BOOLEAN DEFAULT true,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    erstellt_von UUID REFERENCES auth.users(id),
    UNIQUE(user_id, rolle)
);

-- 2. Erweiterte Benutzerprofile mit besserer Struktur
CREATE TABLE IF NOT EXISTS public.benutzer_profile_2025_10_31_11_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    telefon VARCHAR(50),
    adresse TEXT,
    freigabe_status VARCHAR(20) DEFAULT 'wartend' CHECK (freigabe_status IN ('wartend', 'freigegeben', 'abgelehnt', 'gesperrt')),
    benutzer_typ VARCHAR(20) DEFAULT 'shop_user' CHECK (benutzer_typ IN ('admin', 'shop_user')),
    letzter_login TIMESTAMP WITH TIME ZONE,
    aktiv BOOLEAN DEFAULT true,
    notizen TEXT,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    freigegeben_von UUID REFERENCES auth.users(id),
    freigegeben_am TIMESTAMP WITH TIME ZONE
);

-- 3. Berechtigungen-Tabelle für granulare Kontrolle
CREATE TABLE IF NOT EXISTS public.benutzer_berechtigungen_2025_10_31_11_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bereich VARCHAR(50) NOT NULL, -- 'shop', 'lager', 'benutzer', 'bestellungen', 'blog', 'kontakt', 'veranstaltungen'
    berechtigung VARCHAR(20) NOT NULL CHECK (berechtigung IN ('lesen', 'schreiben', 'loeschen', 'admin')),
    aktiv BOOLEAN DEFAULT true,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, bereich, berechtigung)
);

-- 4. Audit-Log für Benutzeraktionen
CREATE TABLE IF NOT EXISTS public.benutzer_audit_log_2025_10_31_11_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    aktion VARCHAR(100) NOT NULL,
    bereich VARCHAR(50),
    details JSONB,
    ip_adresse INET,
    user_agent TEXT,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_benutzer_rollen_user_id ON public.benutzer_rollen_2025_10_31_11_00(user_id);
CREATE INDEX IF NOT EXISTS idx_benutzer_rollen_rolle ON public.benutzer_rollen_2025_10_31_11_00(rolle);
CREATE INDEX IF NOT EXISTS idx_benutzer_profile_user_id ON public.benutzer_profile_2025_10_31_11_00(user_id);
CREATE INDEX IF NOT EXISTS idx_benutzer_profile_freigabe_status ON public.benutzer_profile_2025_10_31_11_00(freigabe_status);
CREATE INDEX IF NOT EXISTS idx_benutzer_berechtigungen_user_id ON public.benutzer_berechtigungen_2025_10_31_11_00(user_id);
CREATE INDEX IF NOT EXISTS idx_benutzer_audit_log_user_id ON public.benutzer_audit_log_2025_10_31_11_00(user_id);

-- 6. RLS Policies für Sicherheit
ALTER TABLE public.benutzer_rollen_2025_10_31_11_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benutzer_profile_2025_10_31_11_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benutzer_berechtigungen_2025_10_31_11_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benutzer_audit_log_2025_10_31_11_00 ENABLE ROW LEVEL SECURITY;

-- Policies für benutzer_rollen_2025_10_31_11_00
CREATE POLICY "Admins können alle Rollen sehen" ON public.benutzer_rollen_2025_10_31_11_00
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.benutzer_rollen_2025_10_31_11_00 r
            WHERE r.user_id = auth.uid() 
            AND r.rolle IN ('super_admin', 'admin')
            AND r.aktiv = true
        )
    );

CREATE POLICY "Benutzer können eigene Rollen sehen" ON public.benutzer_rollen_2025_10_31_11_00
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Nur Super-Admins können Rollen verwalten" ON public.benutzer_rollen_2025_10_31_11_00
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.benutzer_rollen_2025_10_31_11_00 r
            WHERE r.user_id = auth.uid() 
            AND r.rolle = 'super_admin'
            AND r.aktiv = true
        )
    );

-- Policies für benutzer_profile_2025_10_31_11_00
CREATE POLICY "Admins können alle Profile sehen" ON public.benutzer_profile_2025_10_31_11_00
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.benutzer_rollen_2025_10_31_11_00 r
            WHERE r.user_id = auth.uid() 
            AND r.rolle IN ('super_admin', 'admin')
            AND r.aktiv = true
        )
    );

CREATE POLICY "Benutzer können eigenes Profil sehen" ON public.benutzer_profile_2025_10_31_11_00
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins können Profile verwalten" ON public.benutzer_profile_2025_10_31_11_00
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.benutzer_rollen_2025_10_31_11_00 r
            WHERE r.user_id = auth.uid() 
            AND r.rolle IN ('super_admin', 'admin')
            AND r.aktiv = true
        )
    );

-- 7. Funktionen für Benutzerverwaltung

-- Funktion: Benutzer löschen (nur für Super-Admins)
CREATE OR REPLACE FUNCTION public.delete_user_complete(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role VARCHAR(50);
BEGIN
    -- Prüfe ob aktueller Benutzer Super-Admin ist
    SELECT rolle INTO current_user_role
    FROM public.benutzer_rollen_2025_10_31_11_00
    WHERE user_id = auth.uid() AND rolle = 'super_admin' AND aktiv = true;
    
    IF current_user_role IS NULL THEN
        RAISE EXCEPTION 'Nur Super-Admins können Benutzer löschen';
    END IF;
    
    -- Verhindere Selbstlöschung
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Sie können sich nicht selbst löschen';
    END IF;
    
    -- Lösche alle zugehörigen Daten (CASCADE sollte das meiste erledigen)
    DELETE FROM public.benutzer_berechtigungen_2025_10_31_11_00 WHERE user_id = target_user_id;
    DELETE FROM public.benutzer_rollen_2025_10_31_11_00 WHERE user_id = target_user_id;
    DELETE FROM public.benutzer_profile_2025_10_31_11_00 WHERE user_id = target_user_id;
    
    -- Audit-Log erstellen
    INSERT INTO public.benutzer_audit_log_2025_10_31_11_00 (user_id, aktion, details)
    VALUES (auth.uid(), 'USER_DELETED', jsonb_build_object('deleted_user_id', target_user_id));
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion: Benutzer-Rolle setzen
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id UUID, new_role VARCHAR(50))
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role VARCHAR(50);
BEGIN
    -- Prüfe Berechtigung
    SELECT rolle INTO current_user_role
    FROM public.benutzer_rollen_2025_10_31_11_00
    WHERE user_id = auth.uid() AND rolle IN ('super_admin', 'admin') AND aktiv = true;
    
    IF current_user_role IS NULL THEN
        RAISE EXCEPTION 'Keine Berechtigung zum Setzen von Rollen';
    END IF;
    
    -- Nur Super-Admins können Super-Admin-Rollen vergeben
    IF new_role = 'super_admin' AND current_user_role != 'super_admin' THEN
        RAISE EXCEPTION 'Nur Super-Admins können Super-Admin-Rollen vergeben';
    END IF;
    
    -- Rolle setzen (INSERT oder UPDATE)
    INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, erstellt_von)
    VALUES (target_user_id, new_role, auth.uid())
    ON CONFLICT (user_id, rolle) 
    DO UPDATE SET aktiv = true, aktualisiert_am = NOW(), erstellt_von = auth.uid();
    
    -- Benutzer-Typ im Profil aktualisieren
    UPDATE public.benutzer_profile_2025_10_31_11_00
    SET benutzer_typ = CASE 
        WHEN new_role IN ('super_admin', 'admin') THEN 'admin'
        ELSE 'shop_user'
    END,
    aktualisiert_am = NOW()
    WHERE user_id = target_user_id;
    
    -- Audit-Log
    INSERT INTO public.benutzer_audit_log_2025_10_31_11_00 (user_id, aktion, details)
    VALUES (auth.uid(), 'ROLE_ASSIGNED', jsonb_build_object('target_user_id', target_user_id, 'role', new_role));
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion: Benutzer freigeben
CREATE OR REPLACE FUNCTION public.approve_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Prüfe Admin-Berechtigung
    IF NOT EXISTS (
        SELECT 1 FROM public.benutzer_rollen_2025_10_31_11_00
        WHERE user_id = auth.uid() AND rolle IN ('super_admin', 'admin') AND aktiv = true
    ) THEN
        RAISE EXCEPTION 'Keine Berechtigung zum Freigeben von Benutzern';
    END IF;
    
    -- Benutzer freigeben
    UPDATE public.benutzer_profile_2025_10_31_11_00
    SET freigabe_status = 'freigegeben',
        freigegeben_von = auth.uid(),
        freigegeben_am = NOW(),
        aktualisiert_am = NOW()
    WHERE user_id = target_user_id;
    
    -- Standard Shop-User Rolle vergeben falls keine Rolle existiert
    INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, erstellt_von)
    VALUES (target_user_id, 'shop_user', auth.uid())
    ON CONFLICT (user_id, rolle) DO NOTHING;
    
    -- Audit-Log
    INSERT INTO public.benutzer_audit_log_2025_10_31_11_00 (user_id, aktion, details)
    VALUES (auth.uid(), 'USER_APPROVED', jsonb_build_object('target_user_id', target_user_id));
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger für automatische Aktualisierung
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.aktualisiert_am = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_benutzer_rollen_updated_at
    BEFORE UPDATE ON public.benutzer_rollen_2025_10_31_11_00
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_benutzer_profile_updated_at
    BEFORE UPDATE ON public.benutzer_profile_2025_10_31_11_00
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Initiale Daten - Super-Admin für jagd@soliso.de
INSERT INTO public.benutzer_profile_2025_10_31_11_00 (user_id, email, full_name, freigabe_status, benutzer_typ, freigegeben_am)
SELECT id, email, 'Super Administrator', 'freigegeben', 'admin', NOW()
FROM auth.users 
WHERE email = 'jagd@soliso.de'
ON CONFLICT (user_id) DO UPDATE SET
    freigabe_status = 'freigegeben',
    benutzer_typ = 'admin',
    freigegeben_am = NOW();

INSERT INTO public.benutzer_rollen_2025_10_31_11_00 (user_id, rolle, beschreibung)
SELECT id, 'super_admin', 'System-Administrator mit allen Berechtigungen'
FROM auth.users 
WHERE email = 'jagd@soliso.de'
ON CONFLICT (user_id, rolle) DO UPDATE SET aktiv = true;

-- Kommentare für bessere Dokumentation
COMMENT ON TABLE public.benutzer_rollen_2025_10_31_11_00 IS 'Rollen-System: super_admin, admin, shop_user';
COMMENT ON TABLE public.benutzer_profile_2025_10_31_11_00 IS 'Erweiterte Benutzerprofile mit Freigabe-System';
COMMENT ON TABLE public.benutzer_berechtigungen_2025_10_31_11_00 IS 'Granulare Berechtigungen pro Bereich';
COMMENT ON TABLE public.benutzer_audit_log_2025_10_31_11_00 IS 'Audit-Log für alle Benutzeraktionen';
COMMENT ON FUNCTION public.delete_user_complete(UUID) IS 'Vollständiges Löschen eines Benutzers (nur Super-Admin)';
COMMENT ON FUNCTION public.set_user_role(UUID, VARCHAR) IS 'Rolle einem Benutzer zuweisen';
COMMENT ON FUNCTION public.approve_user(UUID) IS 'Benutzer freigeben und Shop-User Rolle vergeben';