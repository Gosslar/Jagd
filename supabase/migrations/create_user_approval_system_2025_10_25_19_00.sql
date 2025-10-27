-- Erweitere die Benutzerprofile-Tabelle um Freigabe-Status
ALTER TABLE public.benutzerprofile_2025_10_23_06_04 
ADD COLUMN IF NOT EXISTS freigabe_status TEXT DEFAULT 'wartend' CHECK (freigabe_status IN ('wartend', 'freigegeben', 'abgelehnt'));

ALTER TABLE public.benutzerprofile_2025_10_23_06_04 
ADD COLUMN IF NOT EXISTS freigegeben_von UUID REFERENCES auth.users(id);

ALTER TABLE public.benutzerprofile_2025_10_23_06_04 
ADD COLUMN IF NOT EXISTS freigabe_datum TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.benutzerprofile_2025_10_23_06_04 
ADD COLUMN IF NOT EXISTS freigabe_notiz TEXT;

ALTER TABLE public.benutzerprofile_2025_10_23_06_04 
ADD COLUMN IF NOT EXISTS registrierung_datum TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Erstelle Admin-Rollen Tabelle
CREATE TABLE IF NOT EXISTS public.admin_rollen_2025_10_25_19_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rolle TEXT NOT NULL CHECK (rolle IN ('super_admin', 'benutzer_admin', 'lager_admin')),
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    erstellt_von UUID REFERENCES auth.users(id),
    UNIQUE(user_id, rolle)
);

-- RLS Policies für Admin-Rollen
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

-- Aktualisiere RLS Policy für Benutzerprofile
DROP POLICY IF EXISTS "Benutzer können eigene Profile verwalten" ON public.benutzerprofile_2025_10_23_06_04;

-- Neue Policy: Nur freigegebene Benutzer können sich anmelden
CREATE POLICY "Nur freigegebene Benutzer können Profile einsehen" 
ON public.benutzerprofile_2025_10_23_06_04 
FOR SELECT 
USING (
    user_id = auth.uid() AND freigabe_status = 'freigegeben'
);

-- Benutzer können ihre Profile erstellen (beim ersten Login)
CREATE POLICY "Benutzer können Profile erstellen" 
ON public.benutzerprofile_2025_10_23_06_04 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Admins können alle Profile verwalten
CREATE POLICY "Admins können alle Profile verwalten" 
ON public.benutzerprofile_2025_10_23_06_04 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar 
        WHERE ar.user_id = auth.uid() 
        AND ar.rolle IN ('super_admin', 'benutzer_admin')
    )
);

-- Funktion zur Benutzerfreigabe
CREATE OR REPLACE FUNCTION approve_user(
    target_user_id UUID,
    admin_notiz TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Prüfe ob der aufrufende Benutzer Admin-Rechte hat
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 
        WHERE user_id = auth.uid() 
        AND rolle IN ('super_admin', 'benutzer_admin')
    ) THEN
        RETURN json_build_object('error', 'Keine Berechtigung');
    END IF;

    -- Aktualisiere Benutzerprofil
    UPDATE public.benutzerprofile_2025_10_23_06_04 
    SET 
        freigabe_status = 'freigegeben',
        freigegeben_von = auth.uid(),
        freigabe_datum = NOW(),
        freigabe_notiz = admin_notiz
    WHERE user_id = target_user_id;

    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Benutzer erfolgreich freigegeben');
    ELSE
        RETURN json_build_object('error', 'Benutzer nicht gefunden');
    END IF;
END;
$$;

-- Funktion zur Benutzer-Ablehnung
CREATE OR REPLACE FUNCTION reject_user(
    target_user_id UUID,
    admin_notiz TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Prüfe ob der aufrufende Benutzer Admin-Rechte hat
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 
        WHERE user_id = auth.uid() 
        AND rolle IN ('super_admin', 'benutzer_admin')
    ) THEN
        RETURN json_build_object('error', 'Keine Berechtigung');
    END IF;

    -- Aktualisiere Benutzerprofil
    UPDATE public.benutzerprofile_2025_10_23_06_06_04 
    SET 
        freigabe_status = 'abgelehnt',
        freigegeben_von = auth.uid(),
        freigabe_datum = NOW(),
        freigabe_notiz = admin_notiz
    WHERE user_id = target_user_id;

    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Benutzer abgelehnt');
    ELSE
        RETURN json_build_object('error', 'Benutzer nicht gefunden');
    END IF;
END;
$$;

-- Erstelle ersten Super-Admin (muss manuell angepasst werden)
-- HINWEIS: Diese Zeile muss mit einer echten User-ID ausgeführt werden
-- INSERT INTO public.admin_rollen_2025_10_25_19_00 (user_id, rolle, erstellt_von) 
-- VALUES ('IHRE_USER_ID_HIER', 'super_admin', 'IHRE_USER_ID_HIER');

-- Kommentare für Dokumentation
COMMENT ON TABLE public.admin_rollen_2025_10_25_19_00 IS 'Admin-Rollen für Benutzerverwaltung';
COMMENT ON COLUMN public.benutzerprofile_2025_10_23_06_04.freigabe_status IS 'Status der Benutzerfreigabe: wartend, freigegeben, abgelehnt';
COMMENT ON FUNCTION approve_user IS 'Funktion zur Freigabe von Benutzern durch Admins';
COMMENT ON FUNCTION reject_user IS 'Funktion zur Ablehnung von Benutzern durch Admins';