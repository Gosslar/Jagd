-- Lösche alte Tabellen falls sie existieren (um sauberen Neustart zu haben)
DROP TABLE IF EXISTS public.admin_rollen_2025_10_25_19_00 CASCADE;
DROP TABLE IF EXISTS public.user_profiles_2025_10_25_19_00 CASCADE;
DROP TABLE IF EXISTS public.registrierungsanfragen_2025_10_25_19_00 CASCADE;

-- Erstelle Benutzerprofile-Tabelle
CREATE TABLE public.user_profiles_2025_10_25_19_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    username TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    freigabe_status TEXT DEFAULT 'wartend' CHECK (freigabe_status IN ('wartend', 'freigegeben', 'abgelehnt')),
    freigegeben_von UUID REFERENCES auth.users(id),
    freigabe_datum TIMESTAMP WITH TIME ZONE,
    freigabe_notiz TEXT,
    registrierung_datum TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstelle Admin-Rollen Tabelle
CREATE TABLE public.admin_rollen_2025_10_25_19_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rolle TEXT NOT NULL CHECK (rolle IN ('super_admin', 'benutzer_admin', 'lager_admin')),
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    erstellt_von UUID REFERENCES auth.users(id),
    UNIQUE(user_id, rolle)
);

-- Erstelle Registrierungsanfragen Tabelle
CREATE TABLE public.registrierungsanfragen_2025_10_25_19_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    username TEXT,
    phone TEXT,
    nachricht TEXT,
    status TEXT DEFAULT 'wartend' CHECK (status IN ('wartend', 'freigegeben', 'abgelehnt')),
    bearbeitet_von UUID REFERENCES auth.users(id),
    bearbeitet_am TIMESTAMP WITH TIME ZONE,
    admin_notiz TEXT,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktiviere RLS für alle Tabellen
ALTER TABLE public.user_profiles_2025_10_25_19_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_rollen_2025_10_25_19_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrierungsanfragen_2025_10_25_19_00 ENABLE ROW LEVEL SECURITY;

-- Einfache RLS-Policies für user_profiles
CREATE POLICY "Jeder kann eigene Profile verwalten" 
ON public.user_profiles_2025_10_25_19_00 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Authentifizierte Benutzer können alle Profile sehen" 
ON public.user_profiles_2025_10_25_19_00 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authentifizierte Benutzer können Profile bearbeiten" 
ON public.user_profiles_2025_10_25_19_00 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Einfache RLS-Policies für admin_rollen
CREATE POLICY "Authentifizierte Benutzer können Rollen verwalten" 
ON public.admin_rollen_2025_10_25_19_00 
FOR ALL 
USING (auth.role() = 'authenticated');

-- RLS-Policies für registrierungsanfragen
CREATE POLICY "Jeder kann Registrierungsanfragen erstellen" 
ON public.registrierungsanfragen_2025_10_25_19_00 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authentifizierte Benutzer können Registrierungsanfragen verwalten" 
ON public.registrierungsanfragen_2025_10_25_19_00 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Trigger für automatische Profilerstellung bei neuen Benutzern
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles_2025_10_25_19_00 (user_id, email, full_name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignoriere Fehler (z.B. wenn Profil bereits existiert)
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Lösche alten Trigger falls er existiert
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;

-- Erstelle neuen Trigger
CREATE TRIGGER create_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Funktion zum einfachen Admin-Setup
CREATE OR REPLACE FUNCTION setup_admin_by_email(target_email TEXT)
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
        RETURN json_build_object('error', 'Benutzer mit dieser E-Mail nicht gefunden');
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
        'message', 'Benutzer erfolgreich als Super-Admin eingerichtet',
        'user_id', target_user_id,
        'email', target_email
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'error', 'Fehler beim Setup: ' || SQLERRM
        );
END;
$$;

-- Erstelle Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles_2025_10_25_19_00(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_freigabe_status ON public.user_profiles_2025_10_25_19_00(freigabe_status);
CREATE INDEX IF NOT EXISTS idx_admin_rollen_user_id ON public.admin_rollen_2025_10_25_19_00(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_rollen_rolle ON public.admin_rollen_2025_10_25_19_00(rolle);

-- Kommentare für Dokumentation
COMMENT ON TABLE public.user_profiles_2025_10_25_19_00 IS 'Benutzerprofile mit manuellem Freigabesystem';
COMMENT ON TABLE public.admin_rollen_2025_10_25_19_00 IS 'Admin-Rollen für Benutzerverwaltung';
COMMENT ON TABLE public.registrierungsanfragen_2025_10_25_19_00 IS 'Registrierungsanfragen vor Benutzer-Erstellung';
COMMENT ON FUNCTION setup_admin_by_email IS 'Setzt einen Benutzer als Super-Admin basierend auf E-Mail-Adresse';

-- Erfolgsmeldung
SELECT 'Alle Tabellen erfolgreich erstellt!' as status;