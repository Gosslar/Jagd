-- Veranstaltungskalender-Tabelle für Admin-Bereich
-- Nur für Administratoren sichtbar und bearbeitbar

CREATE TABLE IF NOT EXISTS public.veranstaltungen_2025_10_27_18_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    beschreibung TEXT,
    kategorie VARCHAR(100) DEFAULT 'Allgemein',
    startdatum DATE NOT NULL,
    enddatum DATE,
    startzeit TIME,
    endzeit TIME,
    ganztaegig BOOLEAN DEFAULT false,
    ort VARCHAR(255),
    max_teilnehmer INTEGER,
    anmeldung_erforderlich BOOLEAN DEFAULT false,
    anmeldeschluss DATE,
    status VARCHAR(50) DEFAULT 'geplant' CHECK (status IN ('geplant', 'bestaetigt', 'abgesagt', 'verschoben', 'abgeschlossen')),
    prioritaet VARCHAR(20) DEFAULT 'normal' CHECK (prioritaet IN ('niedrig', 'normal', 'hoch', 'kritisch')),
    farbe VARCHAR(7) DEFAULT '#10b981', -- Hex-Farbcode für Kalender-Anzeige
    notizen TEXT,
    erstellt_von UUID REFERENCES auth.users(id),
    bearbeitet_von UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS (Row Level Security) aktivieren
ALTER TABLE public.veranstaltungen_2025_10_27_18_00 ENABLE ROW LEVEL SECURITY;

-- Policy: Nur Administratoren können Veranstaltungen sehen
CREATE POLICY "Nur Admins können Veranstaltungen sehen" ON public.veranstaltungen_2025_10_27_18_00
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar
            JOIN public.user_profiles_2025_10_25_19_00 up ON ar.user_id = up.user_id
            WHERE ar.user_id = auth.uid() 
            AND up.freigabe_status = 'freigegeben'
            AND ar.rolle IN ('super_admin', 'benutzer_admin', 'veranstaltungs_admin')
        )
    );

-- Policy: Nur Administratoren können Veranstaltungen erstellen
CREATE POLICY "Nur Admins können Veranstaltungen erstellen" ON public.veranstaltungen_2025_10_27_18_00
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar
            JOIN public.user_profiles_2025_10_25_19_00 up ON ar.user_id = up.user_id
            WHERE ar.user_id = auth.uid() 
            AND up.freigabe_status = 'freigegeben'
            AND ar.rolle IN ('super_admin', 'benutzer_admin', 'veranstaltungs_admin')
        )
    );

-- Policy: Nur Administratoren können Veranstaltungen bearbeiten
CREATE POLICY "Nur Admins können Veranstaltungen bearbeiten" ON public.veranstaltungen_2025_10_27_18_00
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar
            JOIN public.user_profiles_2025_10_25_19_00 up ON ar.user_id = up.user_id
            WHERE ar.user_id = auth.uid() 
            AND up.freigabe_status = 'freigegeben'
            AND ar.rolle IN ('super_admin', 'benutzer_admin', 'veranstaltungs_admin')
        )
    );

-- Policy: Nur Administratoren können Veranstaltungen löschen
CREATE POLICY "Nur Admins können Veranstaltungen löschen" ON public.veranstaltungen_2025_10_27_18_00
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 ar
            JOIN public.user_profiles_2025_10_25_19_00 up ON ar.user_id = up.user_id
            WHERE ar.user_id = auth.uid() 
            AND up.freigabe_status = 'freigegeben'
            AND ar.rolle IN ('super_admin', 'benutzer_admin', 'veranstaltungs_admin')
        )
    );

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_veranstaltungen_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    NEW.bearbeitet_von = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_veranstaltungen_updated_at_trigger
    BEFORE UPDATE ON public.veranstaltungen_2025_10_27_18_00
    FOR EACH ROW
    EXECUTE PROCEDURE update_veranstaltungen_updated_at();

-- Trigger für erstellt_von bei INSERT
CREATE OR REPLACE FUNCTION set_veranstaltungen_erstellt_von()
RETURNS TRIGGER AS $$
BEGIN
    NEW.erstellt_von = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_veranstaltungen_erstellt_von_trigger
    BEFORE INSERT ON public.veranstaltungen_2025_10_27_18_00
    FOR EACH ROW
    EXECUTE PROCEDURE set_veranstaltungen_erstellt_von();

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_veranstaltungen_datum ON public.veranstaltungen_2025_10_27_18_00(startdatum);
CREATE INDEX IF NOT EXISTS idx_veranstaltungen_kategorie ON public.veranstaltungen_2025_10_27_18_00(kategorie);
CREATE INDEX IF NOT EXISTS idx_veranstaltungen_status ON public.veranstaltungen_2025_10_27_18_00(status);

-- Beispiel-Veranstaltungen einfügen
INSERT INTO public.veranstaltungen_2025_10_27_18_00 (
    titel, beschreibung, kategorie, startdatum, enddatum, startzeit, endzeit, 
    ort, max_teilnehmer, anmeldung_erforderlich, status, prioritaet, farbe
) VALUES 
(
    'Herbstjagd Rehwild', 
    'Gemeinsame Jagd auf Rehwild im südlichen Revierteil. Treffpunkt am Hochsitz 3.',
    'Jagd',
    '2025-11-15',
    '2025-11-15',
    '06:00',
    '10:00',
    'Hochsitz 3, Südrevier',
    4,
    true,
    'geplant',
    'hoch',
    '#dc2626'
),
(
    'Wildkamera-Wartung',
    'Kontrolle und Wartung aller Wildkameras im Revier. Batterien und SD-Karten wechseln.',
    'Wartung',
    '2025-11-08',
    '2025-11-08',
    '14:00',
    '17:00',
    'Gesamtes Revier',
    2,
    false,
    'geplant',
    'normal',
    '#059669'
),
(
    'Jagdpächter-Versammlung',
    'Monatliche Besprechung der Jagdpächter. Planung der kommenden Jagdaktivitäten und Revierpflege.',
    'Verwaltung',
    '2025-11-20',
    '2025-11-20',
    '19:00',
    '21:00',
    'Gasthaus Zur Linde, Weetzen',
    8,
    true,
    'bestaetigt',
    'hoch',
    '#7c3aed'
),
(
    'Hochsitz-Reparatur',
    'Reparatur des beschädigten Hochsitzes 5. Material ist bereits bestellt.',
    'Wartung',
    '2025-11-12',
    '2025-11-12',
    '09:00',
    '15:00',
    'Hochsitz 5, Nordrevier',
    3,
    false,
    'geplant',
    'normal',
    '#059669'
),
(
    'Drückjagd Schwarzwild',
    'Große Drückjagd auf Schwarzwild mit benachbarten Revieren. Anmeldung bis 10.11. erforderlich.',
    'Jagd',
    '2025-11-25',
    '2025-11-25',
    '07:00',
    '14:00',
    'Gesamtes Revier + Nachbarreviere',
    15,
    true,
    'geplant',
    'kritisch',
    '#dc2626'
),
(
    'Wildäcker anlegen',
    'Anlage neuer Wildäcker für die kommende Saison. Saatgut ist vorbereitet.',
    'Revierpflege',
    '2025-11-30',
    '2025-12-01',
    '08:00',
    '16:00',
    'Westlicher Revierteil',
    6,
    true,
    'geplant',
    'normal',
    '#ea580c'
);

-- Neue Admin-Rolle für Veranstaltungsmanagement hinzufügen (falls noch nicht vorhanden)
INSERT INTO public.admin_rollen_2025_10_25_19_00 (user_id, rolle)
SELECT 
    '2188861a-2ea5-4c7b-9ee4-959ced77091a'::uuid,
    'veranstaltungs_admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 
    WHERE user_id = '2188861a-2ea5-4c7b-9ee4-959ced77091a'::uuid 
    AND rolle = 'veranstaltungs_admin'
);

COMMENT ON TABLE public.veranstaltungen_2025_10_27_18_00 IS 'Veranstaltungskalender für Administratoren - Jagdtermine, Wartung, Versammlungen';
COMMENT ON COLUMN public.veranstaltungen_2025_10_27_18_00.farbe IS 'Hex-Farbcode für Kalender-Darstellung (#RRGGBB)';
COMMENT ON COLUMN public.veranstaltungen_2025_10_27_18_00.prioritaet IS 'Prioritätsstufe: niedrig, normal, hoch, kritisch';
COMMENT ON COLUMN public.veranstaltungen_2025_10_27_18_00.status IS 'Status: geplant, bestaetigt, abgesagt, verschoben, abgeschlossen';