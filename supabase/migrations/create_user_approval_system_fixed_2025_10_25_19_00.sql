-- Prüfe existierende Tabellen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%benutzer%' OR table_name LIKE '%user%' OR table_name LIKE '%profile%';

-- Erstelle Benutzerprofile-Tabelle falls sie nicht existiert
CREATE TABLE IF NOT EXISTS public.user_profiles_2025_10_25_19_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
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
CREATE TABLE IF NOT EXISTS public.admin_rollen_2025_10_25_19_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rolle TEXT NOT NULL CHECK (rolle IN ('super_admin', 'benutzer_admin', 'lager_admin')),
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    erstellt_von UUID REFERENCES auth.users(id),
    UNIQUE(user_id, rolle)
);

-- Erstelle Registrierungsanfragen Tabelle
CREATE TABLE IF NOT EXISTS public.registrierungsanfragen_2025_10_25_19_00 (
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

-- RLS für User Profiles
ALTER TABLE public.user_profiles_2025_10_25_19_00 ENABLE ROW LEVEL SECURITY;

-- Benutzer können nur ihre eigenen Profile sehen (und nur wenn freigegeben)
CREATE POLICY "Benutzer können eigene freigegebene Profile einsehen" 
ON public.user_profiles_2025_10_25_19_00 
FOR SELECT 
USING (user_id = auth.uid() AND freigabe_status = 'freigegeben');

-- Benutzer können ihre Profile erstellen
CREATE POLICY "Benutzer können Profile erstellen" 
ON public.user_profiles_2025_10_25_19_00 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Admins können alle Profile verwalten
CREATE POLICY "Admins können alle Profile verwalten" 
ON public.user_profiles_2025_10_25_19_00 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar 
        WHERE ar.user_id = auth.uid() 
        AND ar.rolle IN ('super_admin', 'benutzer_admin')
    )
);

-- RLS für Admin-Rollen
ALTER TABLE public.admin_rollen_2025_10_25_19_00 ENABLE ROW LEVEL SECURITY;

-- Nur Super-Admins können Admin-Rollen verwalten
CREATE POLICY "Super Admins können Admin-Rollen verwalten" 
ON public.admin_rollen_2025_10_25_19_00 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar 
        WHERE ar.user_id = auth.uid() AND ar.rolle = 'super_admin'
    )
);

-- Benutzer können ihre eigenen Rollen einsehen
CREATE POLICY "Benutzer können eigene Rollen einsehen" 
ON public.admin_rollen_2025_10_25_19_00 
FOR SELECT 
USING (user_id = auth.uid());

-- RLS für Registrierungsanfragen
ALTER TABLE public.registrierungsanfragen_2025_10_25_19_00 ENABLE ROW LEVEL SECURITY;

-- Jeder kann Registrierungsanfragen erstellen
CREATE POLICY "Jeder kann Registrierungsanfragen erstellen" 
ON public.registrierungsanfragen_2025_10_25_19_00 
FOR INSERT 
WITH CHECK (true);

-- Nur Admins können Registrierungsanfragen verwalten
CREATE POLICY "Admins können Registrierungsanfragen verwalten" 
ON public.registrierungsanfragen_2025_10_25_19_00 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar 
        WHERE ar.user_id = auth.uid() 
        AND ar.rolle IN ('super_admin', 'benutzer_admin')
    )
);

-- Trigger für automatische Profilerstellung
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER create_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Kommentare
COMMENT ON TABLE public.user_profiles_2025_10_25_19_00 IS 'Benutzerprofile mit manuellem Freigabesystem';
COMMENT ON TABLE public.admin_rollen_2025_10_25_19_00 IS 'Admin-Rollen für Benutzerverwaltung';
COMMENT ON TABLE public.registrierungsanfragen_2025_10_25_19_00 IS 'Registrierungsanfragen vor Benutzer-Erstellung';