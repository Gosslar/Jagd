-- Erstelle Kontaktanfragen Tabelle
CREATE TABLE public.kontaktanfragen_2025_10_26_12_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'neu' CHECK (status IN ('neu', 'bearbeitet', 'abgeschlossen')),
    bearbeitet_von UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    bearbeitet_am TIMESTAMP WITH TIME ZONE,
    admin_notiz TEXT,
    erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktualisiert_am TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktiviere RLS
ALTER TABLE public.kontaktanfragen_2025_10_26_12_00 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Jeder kann Kontaktanfragen erstellen (für das Formular)
CREATE POLICY "Jeder kann Kontaktanfragen erstellen" 
ON public.kontaktanfragen_2025_10_26_12_00 
FOR INSERT 
WITH CHECK (true);

-- Admins können alle Kontaktanfragen verwalten
CREATE POLICY "Admins können Kontaktanfragen verwalten" 
ON public.kontaktanfragen_2025_10_26_12_00 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_rollen_2025_10_25_19_00 
        WHERE user_id = auth.uid() 
        AND rolle IN ('super_admin', 'benutzer_admin')
    )
);

-- Trigger für automatische Zeitstempel-Updates
CREATE OR REPLACE FUNCTION update_kontaktanfragen_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.aktualisiert_am = NOW();
    
    -- Setze Bearbeitungsdatum wenn Status geändert wird
    IF NEW.status != OLD.status AND NEW.status != 'neu' THEN
        NEW.bearbeitet_am = NOW();
        NEW.bearbeitet_von = auth.uid();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kontaktanfragen_timestamp_trigger
    BEFORE UPDATE ON public.kontaktanfragen_2025_10_26_12_00
    FOR EACH ROW
    EXECUTE FUNCTION update_kontaktanfragen_timestamp();

-- Erstelle Indizes für bessere Performance
CREATE INDEX idx_kontaktanfragen_status ON public.kontaktanfragen_2025_10_26_12_00(status);
CREATE INDEX idx_kontaktanfragen_erstellt ON public.kontaktanfragen_2025_10_26_12_00(erstellt_am DESC);
CREATE INDEX idx_kontaktanfragen_email ON public.kontaktanfragen_2025_10_26_12_00(email);

-- Kommentare
COMMENT ON TABLE public.kontaktanfragen_2025_10_26_12_00 IS 'Kontaktanfragen über das Website-Formular';
COMMENT ON FUNCTION update_kontaktanfragen_timestamp IS 'Aktualisiert Zeitstempel bei Kontaktanfragen-Änderungen';

-- Erfolgsmeldung
SELECT 'Kontaktanfragen-Tabelle erfolgreich erstellt!' as status;